# backend/src/api/views.py
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_world(request):
    """
    A test endpoint to confirm the API is working.
    """
    return Response({"message": "Hello from the Django & Docker Backend!"})