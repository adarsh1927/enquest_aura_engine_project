# backend/src/users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserProfile

# This function will be called every time a UserAccount object is saved.
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Create a UserProfile when a new UserAccount is created.
    """
    if created:
        UserProfile.objects.create(user=instance)