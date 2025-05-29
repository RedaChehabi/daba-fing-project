#!/usr/bin/env python
"""
Script to create an admin user for testing the user management functionality.
"""
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daba_fing_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserRole, UserProfile

def create_admin_user():
    """Create an admin user for testing."""
    
    # Check if admin user already exists
    if User.objects.filter(username='admin').exists():
        print("Admin user already exists!")
        return
    
    # Create admin role if it doesn't exist
    admin_role, created = UserRole.objects.get_or_create(
        role_name=UserRole.ROLE_ADMIN,
        defaults={
            'description': 'Administrator with full system access',
            'access_level': 3,
            'can_provide_expert_feedback': True,
            'can_manage_users': True,
            'can_access_analytics': True
        }
    )
    
    if created:
        print("Created admin role")
    
    # Create admin user
    admin_user = User.objects.create_user(
        username='admin',
        email='admin@example.com',
        password='admin123',
        first_name='System',
        last_name='Administrator',
        is_staff=True,
        is_superuser=True
    )
    
    # Update the user profile with admin role
    try:
        profile = admin_user.profile
        profile.role = admin_role
        profile.first_name = 'System'
        profile.last_name = 'Administrator'
        profile.save()
    except UserProfile.DoesNotExist:
        # Create profile if it doesn't exist
        UserProfile.objects.create(
            user=admin_user,
            role=admin_role,
            first_name='System',
            last_name='Administrator'
        )
    
    print("Admin user created successfully!")
    print("Username: admin")
    print("Password: admin123")
    print("Email: admin@example.com")

if __name__ == '__main__':
    create_admin_user() 