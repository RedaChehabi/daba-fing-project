from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FingerprintImage, UserProfile, UserRole

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