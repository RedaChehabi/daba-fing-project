#!/usr/bin/env python
"""
Script to create test users for demonstrating the user management functionality.
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
from api.models import UserRole, UserProfile, FingerprintAnalysis
import random

def create_test_users():
    """Create test users for demonstration."""
    
    # Get or create roles
    regular_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
    expert_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_EXPERT)
    admin_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_ADMIN)
    
    # Test users data
    test_users = [
        {
            'username': 'john_doe',
            'email': 'john.doe@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': expert_role,
            'is_staff': False,
        },
        {
            'username': 'jane_smith',
            'email': 'jane.smith@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'role': regular_role,
            'is_staff': False,
        },
        {
            'username': 'bob_expert',
            'email': 'bob.expert@example.com',
            'first_name': 'Bob',
            'last_name': 'Expert',
            'role': expert_role,
            'is_staff': False,
        },
        {
            'username': 'alice_user',
            'email': 'alice.user@example.com',
            'first_name': 'Alice',
            'last_name': 'User',
            'role': regular_role,
            'is_staff': False,
        },
        {
            'username': 'charlie_admin',
            'email': 'charlie.admin@example.com',
            'first_name': 'Charlie',
            'last_name': 'Administrator',
            'role': admin_role,
            'is_staff': True,
        },
    ]
    
    created_count = 0
    
    for user_data in test_users:
        username = user_data['username']
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            print(f"User {username} already exists, skipping...")
            continue
            
        # Create user
        user = User.objects.create_user(
            username=username,
            email=user_data['email'],
            password='password123',  # Simple password for testing
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            is_staff=user_data['is_staff']
        )
        
        # Update user profile
        try:
            profile = user.profile
            profile.role = user_data['role']
            profile.first_name = user_data['first_name']
            profile.last_name = user_data['last_name']
            # Set random status
            profile.is_active = random.choice([True, True, True, False])  # 75% active
            profile.save()
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            UserProfile.objects.create(
                user=user,
                role=user_data['role'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                is_active=random.choice([True, True, True, False])
            )
        
        print(f"Created user: {username} ({user_data['role'].role_name})")
        created_count += 1
    
    print(f"\nSuccessfully created {created_count} test users!")
    print("All test users have password: password123")
    print("\nYou can now test the user management functionality with:")
    print("- Admin user: admin / admin123")
    print("- Test users: [username] / password123")

if __name__ == '__main__':
    create_test_users() 