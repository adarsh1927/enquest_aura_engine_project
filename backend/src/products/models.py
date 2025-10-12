# backend/src/products/models.py
from django.db import models

class Product(models.Model):
    item_id = models.CharField(max_length=10, unique=True, primary_key=True)
    item_name = models.CharField(max_length=255)
    image_url = models.URLField(max_length=1024)
    category = models.CharField(max_length=50)
    color_name = models.CharField(max_length=50)
    color_family = models.CharField(max_length=50)
    is_neutral = models.BooleanField(default=False)
    season = models.CharField(max_length=50)
    fit = models.CharField(max_length=50)
    style = models.CharField(max_length=255) # Storing as comma-separated string
    body_type = models.CharField(max_length=255) # Storing as comma-separated string
    lifestyle = models.CharField(max_length=255) # Storing as comma-separated string
    utility = models.CharField(max_length=255) # Storing as comma-separated string

    def __str__(self):
        return f"{self.item_name} ({self.item_id})"