# File: backend/api/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, UserRole # Make sure UserRole is imported

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        # Get or create the "Regular" role using the constant
        # The UserRole model's save() method will set its default permissions/access_level
        default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
        UserProfile.objects.create(user=instance, role=default_role)
    else:
        # If user is updated, ensure profile exists and save it.
        # This handles cases where profile might have been created manually or if signal didn't run.
        try:
            instance.profile.save()
        except UserProfile.DoesNotExist:
            # If profile somehow doesn't exist for an existing user, create it.
            default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
            UserProfile.objects.create(user=instance, role=default_role)

# Remove the old save_user_profile signal if create_or_update_user_profile handles both cases
# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     if hasattr(instance, 'profile'):
#         instance.profile.save()