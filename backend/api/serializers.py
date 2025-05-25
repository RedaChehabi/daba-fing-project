from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FingerprintImage, UserProfile, UserRole, ExpertApplication

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ['id', 'role_name', 'description', 'access_level']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = UserRoleSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'role', 'first_name', 'last_name', 'is_active', 'registration_date']

class FingerprintImageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = FingerprintImage
        fields = ['id', 'user', 'title', 'description', 'image', 'hand_type', 
                 'finger_position', 'upload_date', 'is_processed', 'preprocessing_status']
        read_only_fields = ['user', 'upload_date', 'is_processed', 'preprocessing_status']

# Add to your existing serializers.py

class ExpertApplicationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.username', read_only=True)
    
    class Meta:
        model = ExpertApplication
        fields = [
            'id', 'user', 'user_name', 'user_email', 'application_date', 'status',
            'motivation', 'experience', 'education', 'certifications',
            'reviewed_by', 'reviewed_by_name', 'review_date', 'review_notes'
        ]
        read_only_fields = ['user', 'application_date', 'reviewed_by', 'review_date']