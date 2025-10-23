# backend/src/api/views.py
from rest_framework.decorators import api_view, permission_classes # <--- Add permission_classes(remeber)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from products.models import Product
from quiz.services import QuizProcessor
from users.models import UserProfile



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
    for the currently logged-in user.
    """
    user = request.user
    
    try:
        profile = user.profile # We can access the profile directly thanks to the related_name
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found. Please complete the quiz first."}, status=404)

    # --- Start implementing the recommendation logic from the flowchart ---
    
    # 1. First round of filtration: Body Type
    # We will query all products to start.
    all_products = Product.objects.all()
    
    # Filter products where the product's body_type string contains the user's primary type
    body_type_filtered_products = all_products.filter(
        body_type__icontains=profile.primary_body_type
    )

    # 2. Second round of filtration: Lifestyle
    # For simplicity, we'll just combine the lifestyle tags for now.
    user_lifestyles = [profile.weekday_lifestyle] + profile.weekend_lifestyle.split(',')
    
    # This is a placeholder for a more complex query.
    # A real implementation would use Elasticsearch for a more efficient OR query.
    # For now, we'll just filter by weekday lifestyle.
    lifestyle_filtered_products = body_type_filtered_products.filter(
        lifestyle__icontains=profile.weekday_lifestyle
    )
    
    # TODO: Implement proportional weighting and style filtering here.
    # For now, we'll just return the first 40 items from our filtered list.
    
    final_recommendations = lifestyle_filtered_products[:40]
    
    # Serialize the data to send back to the frontend
    data = [
        {
            "item_id": p.item_id,
            "item_name": p.item_name,
            "image_url": p.image_url,
            "category": p.category,
        } for p in final_recommendations
    ]
    
    return Response(data)