# backend/src/users/models.py
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        user = self.create_user(email, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

class UserProfile(models.Model):
    # This is the core of the relationship.
    # Each UserAccount will have exactly one UserProfile, and each UserProfile
    # is linked to exactly one UserAccount.
    # settings.AUTH_USER_MODEL is the correct way to reference the active user model.
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile' # We can access the profile from a user object via user.profile
    )

    # --- Fields to store quiz results ---
    # Based on the client's flowcharts

    # 1. Body Type
    primary_body_type = models.CharField(max_length=50, blank=True, null=True)
    secondary_body_type = models.CharField(max_length=50, blank=True, null=True)

    # 2. Lifestyle
    weekday_lifestyle = models.CharField(max_length=50, blank=True, null=True)
    weekend_lifestyle = models.CharField(max_length=100, blank=True, null=True) # Can store multiple, e.g., "Social,Lounge"

    # 3. Wardrobe Percentages (using JSONField for flexibility)
    # This is a modern and clean way to store structured data like percentages.
    wardrobe_percentages = models.JSONField(default=dict, blank=True)
    # Example: {'seasonality': 0.2, 'workwear': 0.7, 'dresses': 0.5, 'utility': 0.3}

    # 4. Style Personality (also using JSONField)
    style_scores = models.JSONField(default=dict, blank=True)
    # Example: {'Classic': 3.5, 'Bohemian': 1.0, 'Edgy': 0.5, ...}
    
    top_three_styles = models.CharField(max_length=150, blank=True, null=True) # Stores the final result, e.g., "Classic,Romantic,Chic"

    # Timestamp for when the profile was last updated
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Profile"