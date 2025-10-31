# backend/src/api/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import random # We will use this for proportional selection keep in mind

from users.models import UserProfile
from products.models import Product
from products.documents import ProductDocument # IMPORT ELASTICSEARCH DOCUMENT
from quiz.services import QuizProcessor



@api_view(['GET'])
def hello_world(request):
    """
    A test endpoint to confirm the API is working and hotreloading.
    """
    return Response({"message": "Hello from the Django & Docker Backend!"})


@api_view(['POST'])
@permission_classes([IsAuthenticated]) # This line protects the endpoint
def quiz_submit(request):
    """
    Accepts quiz data from a logged-in user, processes it,
    and saves it to their UserProfile.
    """
    user = request.user  # Thanks to the token, DRF knows who the user is
    quiz_data = request.data

    try:
        # Use the service we just built!
        processor = QuizProcessor(user=user, quiz_data=quiz_data)
        processor.process_and_save()
        return Response({"status": "success", "message": "Profile updated successfully."})
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    """
    Generates and returns a personalized list of 40 product recommendations
    for the currently logged-in user using Elasticsearch and proportional weighting.
    """
    user = request.user
    
    try:
        profile = user.profile
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found. Please complete the quiz first."}, status=404)

    # --- 1. ADVANCED FILTERING WITH ELASTICSEARCH ---
    
    # Get the user's lifestyle tags. Example: ['Business Casual', 'Social/Trendy', 'Lounge']
    user_lifestyles = [profile.weekday_lifestyle] + profile.weekend_lifestyle.split(',')
    # Clean up any empty strings that might result from splitting
    user_lifestyles = [style.strip() for style in user_lifestyles if style.strip()]

    # Build the Elasticsearch query
    search = ProductDocument.search()

    # We need products that match the user's body type AND at least one of their lifestyles.
    # This is a classic "bool" query in Elasticsearch.
    search = search.query(
        "bool",
        must=[
            # The product's body_type field MUST contain the user's primary body type.
            {'match': {'body_type': profile.primary_body_type}},
        ],
        filter=[
            # The product's lifestyle field SHOULD match one of the user's lifestyles.
            # Using 'filter' is faster as it doesn't calculate relevance scores.
            {'terms': {'lifestyle.raw': user_lifestyles}},
        ]
    )

    # Execute the search and get a response object. Let's get a generous number to work with.
    response = search[:500].execute()
    
    # The response contains hits. We want the actual product objects from our database.
    # This is more efficient than returning all data from Elasticsearch.
    product_ids = [hit.item_id for hit in response]
    filtered_products = list(Product.objects.filter(item_id__in=product_ids))
    
    # If we have no results after initial filtering, return early.
    if not filtered_products:
        return Response({"message": "No products matched the initial criteria.", "data": []})

    # --- 2. PROPORTIONAL WEIGHTING ---

    # This is where we implement the logic for seasonality, workwear, etc.
    # For this example, let's just implement a simple version for 'statement' vs 'basics'
    percentages = profile.wardrobe_percentages
    target_statement_ratio = percentages.get('statement', 0.3) # Default to 30% statement pieces

    statement_products = [p for p in filtered_products if 'Statement' in p.utility]
    basic_products = [p for p in filtered_products if 'Statement' not in p.utility]

    # Calculate how many of each we need for our final pool of ~100 items
    total_pool_size = min(len(filtered_products), 100)
    num_statement_needed = int(total_pool_size * target_statement_ratio)
    num_basic_needed = total_pool_size - num_statement_needed

    # Shuffle and select the items to create our "capsule"
    random.shuffle(statement_products)
    random.shuffle(basic_products)
    
    capsule_wardrobe = statement_products[:num_statement_needed] + basic_products[:num_basic_needed]

    # --- 3. FINAL STYLE FILTER ---
    
    top_styles = profile.top_three_styles.split(',')
    top_styles = [style.strip() for style in top_styles if style.strip()]

    final_recommendations = []
    if top_styles:
        for product in capsule_wardrobe:
            # Check if any of the user's top styles are in the product's style string
            if any(style in product.style for style in top_styles):
                final_recommendations.append(product)
    else:
        # If user has no top styles, just use the capsule
        final_recommendations = capsule_wardrobe
    
    # --- 4. PREPARE AND RETURN RESPONSE ---
    
    # Ensure we return a maximum of 40 items
    final_recommendations = final_recommendations[:40]

    data = [
        {
            "item_id": p.item_id,
            "item_name": p.item_name,
            "image_url": p.image_url,
            "category": p.category,
        } for p in final_recommendations
    ]
    
    return Response(data)