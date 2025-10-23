# backend/src/api/urls.py
from django.urls import path
from .views import hello_world, quiz_submit, get_recommendations # Add new views

urlpatterns = [
    path('hello/', hello_world, name='hello-world'),
    path('quiz/submit/', quiz_submit, name='quiz-submit'),
    path('recommendations/', get_recommendations, name='get-recommendations'),
]