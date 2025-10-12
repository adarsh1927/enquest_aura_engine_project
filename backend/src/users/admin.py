# backend/src/users/admin.py
from django.contrib import admin
from .models import UserAccount, UserProfile

# We can display the UserProfile inline with the UserAccount for convenience
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(admin.ModelAdmin):
    inlines = (UserProfileInline,)
    list_display = ('email', 'first_name', 'last_name', 'is_staff')

# Unregister the default Group model if iam not using it
# from django.contrib.auth.models import Group
# admin.site.unregister(Group)

admin.site.register(UserAccount, CustomUserAdmin)
# Register your models here.
