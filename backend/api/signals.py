# File: backend/api/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, UserRole

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        # Get or create the "Regular" role using the constant
        default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
        # Use get_or_create instead of create to prevent unique constraint errors
        UserProfile.objects.get_or_create(user=instance, defaults={'role': default_role})
    else:
        # If user is updated, ensure profile exists and save it.
        try:
            instance.profile.save()
        except UserProfile.DoesNotExist:
            # If profile somehow doesn't exist for an existing user, create it.
            default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
            UserProfile.objects.get_or_create(user=instance, defaults={'role': default_role})