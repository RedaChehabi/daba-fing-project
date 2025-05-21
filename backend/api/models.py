from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone  # Add this import
import os
import uuid
import json
from datetime import datetime

def fingerprint_upload_path(instance, filename):
    # Generate a unique filename with original extension
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    # Return the upload path
    return os.path.join('fingerprints', new_filename)

# Update the UserRole model to match what's in the database
# File: backend/api/models.py
class UserRole(models.Model):
    # Define role constants for internal use and choices
    ROLE_REGULAR = "Regular"
    ROLE_EXPERT = "Expert"
    ROLE_ADMIN = "Admin"

    ROLE_CHOICES = [
        (ROLE_REGULAR, "Regular"),   # Value stored in DB, Human-readable name
        (ROLE_EXPERT, "Expert"),
        (ROLE_ADMIN, "Admin"),
    ]

    role_name = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default=ROLE_REGULAR,
        unique=True # Ensures role names are unique
    )
    description = models.TextField(blank=True, null=True)
    access_level = models.IntegerField(default=1)  # e.g., 1 for Regular, 2 for Expert, 3 for Admin

    # Specific permissions (can be expanded)
    can_provide_expert_feedback = models.BooleanField(default=False)
    can_manage_users = models.BooleanField(default=False)
    can_access_analytics = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Automatically set access_level and basic permissions based on role_name
        if self.role_name == self.ROLE_EXPERT:
            self.access_level = 2
            self.can_provide_expert_feedback = True
            self.can_manage_users = False 
            self.can_access_analytics = False
        elif self.role_name == self.ROLE_ADMIN:
            self.access_level = 3
            self.can_provide_expert_feedback = True 
            self.can_manage_users = True
            self.can_access_analytics = True
        else: # Default to Regular User
            self.role_name = self.ROLE_REGULAR # Explicitly set to Regular if not Expert or Admin
            self.access_level = 1
            self.can_provide_expert_feedback = False
            self.can_manage_users = False
            self.can_access_analytics = False
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.get_role_name_display()

# Ensure UserProfile links correctly
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.ForeignKey(UserRole, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics', blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    registration_date = models.DateField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(blank=True, null=True)
    preferred_platform = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class ImageSource(models.Model):
    source_type = models.CharField(max_length=50)
    device_name = models.CharField(max_length=100, blank=True, null=True)
    device_model = models.CharField(max_length=100, blank=True, null=True)
    source_details = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.source_type} - {self.device_name}"

class FingerprintImage(models.Model):
    HAND_CHOICES = (
        ('left', 'Left Hand'),
        ('right', 'Right Hand'),
    )
    
    FINGER_CHOICES = (
        ('thumb', 'Thumb'),
        ('index', 'Index Finger'),
        ('middle', 'Middle Finger'),
        ('ring', 'Ring Finger'),
        ('pinky', 'Pinky Finger'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fingerprints')
    source = models.ForeignKey(ImageSource, on_delete=models.SET_NULL, null=True, related_name='images')
    image = models.ImageField(upload_to=fingerprint_upload_path)
    original_filename = models.CharField(max_length=255, blank=True, null=True)
    image_format = models.CharField(max_length=10, blank=True, null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    finger_position = models.CharField(max_length=10, choices=FINGER_CHOICES)
    hand_type = models.CharField(max_length=5, choices=HAND_CHOICES)
    is_processed = models.BooleanField(default=False)
    preprocessing_status = models.CharField(max_length=50, default='pending')
    title = models.CharField(max_length=100, default='Untitled')
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s {self.get_hand_type_display()} {self.get_finger_position_display()}"
    
    def save(self, *args, **kwargs):
        if not self.original_filename and self.image:
            self.original_filename = os.path.basename(self.image.name)
        if not self.image_format and self.image:
            self.image_format = os.path.splitext(self.image.name)[1][1:].lower()
        super().save(*args, **kwargs)

class ModelVersion(models.Model):
    version_number = models.CharField(max_length=20)
    release_date = models.DateTimeField()
    accuracy_score = models.FloatField()
    training_dataset = models.CharField(max_length=255)
    model_parameters = models.TextField()
    is_active = models.BooleanField(default=True)
    framework_used = models.CharField(max_length=50)
    
    def __str__(self):
        return f"Model v{self.version_number}"

class FingerprintAnalysis(models.Model):
    image = models.ForeignKey(FingerprintImage, on_delete=models.CASCADE, related_name='analyses')
    model_version = models.ForeignKey(ModelVersion, on_delete=models.SET_NULL, null=True, related_name='analyses')
    classification = models.CharField(max_length=50)
    ridge_count = models.IntegerField()
    confidence_score = models.FloatField()
    analysis_date = models.DateTimeField(auto_now_add=True)
    analysis_status = models.CharField(max_length=50, default='completed')
    processing_time = models.CharField(max_length=20)
    is_validated = models.BooleanField(default=False)
    analysis_results = models.JSONField(blank=True, null=True)
    
    def __str__(self):
        return f"Analysis of {self.image} - {self.classification}"

class UserFeedback(models.Model):
    analysis = models.ForeignKey(FingerprintAnalysis, on_delete=models.CASCADE, related_name='feedback')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback')
    feedback_type = models.CharField(max_length=50)
    correction_details = models.TextField(blank=True, null=True)
    corrected_ridge_count = models.IntegerField(blank=True, null=True)
    corrected_classification = models.CharField(max_length=50, blank=True, null=True)
    feedback_date = models.DateTimeField(auto_now_add=True)
    helpfulness_rating = models.IntegerField(blank=True, null=True)
    is_expert_feedback = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Feedback on {self.analysis} by {self.user.username}"

class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    token = models.CharField(max_length=255)
    login_time = models.DateTimeField(auto_now_add=True)
    expiry_time = models.DateTimeField()
    ip_address = models.CharField(max_length=50, blank=True, null=True)
    device_info = models.TextField(blank=True, null=True)
    platform = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Session for {self.user.username} from {self.login_time}"

class UserNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50)
    message = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    related_entity = models.CharField(max_length=50, blank=True, null=True)
    related_entity_id = models.IntegerField(blank=True, null=True)
    action_url = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"Notification for {self.user.username}: {self.notification_type}"

class AnalysisHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analysis_history')
    image = models.ForeignKey(FingerprintImage, on_delete=models.CASCADE, related_name='analysis_history')
    analysis = models.ForeignKey(FingerprintAnalysis, on_delete=models.CASCADE, related_name='history')
    timestamp = models.DateTimeField(auto_now_add=True)
    action_performed = models.CharField(max_length=100) # E.g., 'analysis_requested', 'feedback_submitted'
    platform_used = models.CharField(max_length=255, blank=True, null=True) # E.g., 'WebApp', 'MobileApp', 'DesktopApp'
    device_info = models.CharField(max_length=255, blank=True, null=True) # E.g., 'Chrome on Windows', 'iPhone Safari'

    class Meta:
        verbose_name_plural = "Analysis Histories"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action_performed} by {self.user.username} at {self.timestamp}"

# Remove or comment out the following signal receiver and its function:
# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         # Get or create default role
#         default_role, _ = UserRole.objects.get_or_create(
#             role_name="Regular",
#             defaults={
#                 'description': 'Standard user with basic permissions',
#                 'access_level': 1,
#                 'can_provide_expert_feedback': False,
#                 'can_manage_users': False,
#                 'can_access_analytics': False
#             }
#         )
#         UserProfile.objects.get_or_create(user=instance, defaults={'role': default_role})

class ExportLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exports')
    analysis = models.ForeignKey(FingerprintAnalysis, on_delete=models.CASCADE, related_name='exports')
    export_format = models.CharField(max_length=20)
    export_date = models.DateTimeField(auto_now_add=True)
    file_path = models.CharField(max_length=255)
    is_successful = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Export of {self.analysis} by {self.user.username} in {self.export_format}"

class MergedFingerprint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='merged_fingerprints')
    left_image = models.ForeignKey(FingerprintImage, on_delete=models.CASCADE, related_name='left_merges')
    middle_image = models.ForeignKey(FingerprintImage, on_delete=models.CASCADE, related_name='middle_merges', blank=True, null=True)
    right_image = models.ForeignKey(FingerprintImage, on_delete=models.CASCADE, related_name='right_merges')
    merged_image = models.ImageField(upload_to='merged_fingerprints')
    merge_date = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Merged fingerprint by {self.user.username} on {self.merge_date}"

# Signal to create user profile when a new user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Get or create default role
        default_role, _ = UserRole.objects.get_or_create(
            role_name="Regular",
            defaults={
                'description': 'Standard user with basic permissions',
                'access_level': 1,
                'can_provide_expert_feedback': False,
                'can_manage_users': False,
                'can_access_analytics': False
            }
        )
        UserProfile.objects.get_or_create(user=instance, defaults={'role': default_role})

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
