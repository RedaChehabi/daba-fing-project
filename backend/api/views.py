# File: backend/api/views.py
import json
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, serializers # Make sure serializers is imported if used by CustomAuthToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from .models import (
    FingerprintImage, FingerprintAnalysis, ModelVersion, AnalysisHistory,
    UserProfile, UserRole, ExpertApplication, ImageSource  # Add ImageSource
)
# Removed UserProfile, UserRole, User imports here as they are already imported above or from auth.models
from .serializers import FingerprintImageSerializer
from django.db import transaction # Import transaction
from django.contrib.auth import authenticate
from .permissions import IsUser, IsExpert, IsAdmin
import os
import tempfile
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from io import BytesIO
from PIL import Image
import traceback



# --- Mock Analysis Function (actual model logic deferred) ---
def perform_mock_analysis(image_path):
    import time
    import random
    start_time = time.time()
    # Simulate some processing delay
    time.sleep(random.uniform(0.3, 1.0))
    end_time = time.time()
    processing_time_taken = end_time - start_time

    classifications = ["Whorl", "Loop", "Arch", "Tented Arch"]
    return {
        "classification": random.choice(classifications),
        "ridge_count": random.randint(10, 30),
        "confidence_score": round(random.uniform(0.85, 0.99), 3), # Store as 0.0 to 1.0
        "processing_time": f"{processing_time_taken:.2f}s",
        "analysis_details": {
            "message": "Mock analysis complete. Integrate actual model.",
            "model_type": "MockModel v0.1",
            "core_points": [{"x": random.randint(50,100), "y": random.randint(50,100)}],
            "delta_points": [{"x": random.randint(150,200), "y": random.randint(150,200)}]
        }
    }
# --- End Mock Analysis Function ---

class FingerprintAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            fingerprint_id = request.data.get('fingerprint_id')

            if not fingerprint_id:
                return Response({
                    "detail": "Fingerprint ID is required.", # Changed "message" to "detail" for consistency with DRF
                    "status": "error" # You can keep this custom status or remove it if frontend adapts to DRF style
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                fingerprint_image_instance = FingerprintImage.objects.get(id=fingerprint_id, user=request.user)
            except FingerprintImage.DoesNotExist:
                return Response({
                    "detail": "Fingerprint not found or you do not have permission to access it.",
                    "status": "error"
                }, status=status.HTTP_404_NOT_FOUND)

            if not fingerprint_image_instance.image or not hasattr(fingerprint_image_instance.image, 'path'):
                return Response({
                    "detail": "Fingerprint image file not found or path is invalid for analysis.",
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Assuming perform_mock_analysis might raise its own specific errors or a generic Exception
            # If perform_mock_analysis can raise specific, catchable errors (e.g., ModelNotReadyError),
            # you could catch those here.
            image_path = fingerprint_image_instance.image.path
            analysis_results_data = perform_mock_analysis(image_path)

            model_version_str = analysis_results_data.get("analysis_details", {}).get("model_type", "0.1-mock")
            model_version, _ = ModelVersion.objects.get_or_create(
                version_number=model_version_str,
                defaults={
                    "release_date": timezone.now(),
                    "accuracy_score": analysis_results_data.get("confidence_score", 0.0) * 100,
                    "training_dataset": "Mock Dataset",
                    "model_parameters": json.dumps({"type": model_version_str}),
                    "is_active": True,
                    "framework_used": "MockFramework"
                }
            )

            analysis = FingerprintAnalysis.objects.create(
                image=fingerprint_image_instance,
                model_version=model_version,
                classification=analysis_results_data.get("classification", "N/A"),
                ridge_count=analysis_results_data.get("ridge_count", 0),
                confidence_score=analysis_results_data.get("confidence_score", 0.0),
                analysis_status="completed_mock", # Consider a more descriptive status
                processing_time=analysis_results_data.get("processing_time", "0s"),
                is_validated=False,
                analysis_results=analysis_results_data.get("analysis_details", {})
            )

            fingerprint_image_instance.is_processed = True
            fingerprint_image_instance.preprocessing_status = "analyzed_mock" # Consider a more descriptive status
            fingerprint_image_instance.save()

            AnalysisHistory.objects.create(
                user=request.user,
                image=fingerprint_image_instance,
                analysis=analysis,
                action_performed="mock_analysis_completed", # Be more specific if it's real analysis
                platform_used=request.META.get('HTTP_USER_AGENT', 'unknown'),
                device_info=request.META.get('REMOTE_ADDR', 'unknown')
            )

            return Response({
                "message": "Fingerprint analysis (mock) completed successfully.", # Keep "message" if frontend expects it
                "status": "success",
                "id": analysis.id,
                "fingerprint_id": fingerprint_image_instance.id,
                "classification": analysis.classification,
                "ridge_count": analysis.ridge_count,
                "confidence": analysis.confidence_score * 100, 
                "processing_time": analysis.processing_time,
                "additional_details": analysis.analysis_results
            }, status=status.HTTP_200_OK)

        # Specific exceptions that might occur during the process
        except FingerprintImage.DoesNotExist: # This is already handled above, but kept for clarity if refactored
            return Response({"detail": "Fingerprint not found."}, status=status.HTTP_404_NOT_FOUND)
        except KeyError as e: # Example: if request.data is missing an expected key
            print(f"KeyError in FingerprintAnalysisView: {str(e)}")
            return Response({"detail": f"Missing expected data: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the full error on the server for debugging
            print(f"Unexpected Error in FingerprintAnalysisView: {str(e)}")
            import traceback
            traceback.print_exc() 
            return Response({
                "detail": "An unexpected error occurred during analysis. Please contact support if the issue persists.",
                "status": "error" # Custom status field
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FingerprintViewSet(viewsets.ModelViewSet):
    serializer_class = FingerprintImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FingerprintImage.objects.filter(user=self.request.user).order_by('-upload_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data) # No need to copy request.data for validation
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            # Log the validation error for debugging on the server
            print(f"Validation Error in FingerprintViewSet create: {e.detail}")
            # Return DRF's standard validation error response
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Catch other potential errors during the process
            print(f"Unexpected Error in FingerprintViewSet create: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": "An unexpected error occurred while creating the fingerprint record.", "status": "error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR # Use 500 for truly unexpected server errors
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    try:
        user_profile = user.profile
        if not user_profile.role: 
            default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
            user_profile.role = default_role
            user_profile.save()
        role_name = user_profile.role.role_name
    except UserProfile.DoesNotExist:
        default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
        user_profile = UserProfile.objects.create(user=user, role=default_role)
        role_name = default_role.role_name
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': role_name,
        'profile': {
            'first_name': user_profile.first_name or user.first_name,
            'last_name': user_profile.last_name or user.last_name,
            'is_active': user_profile.is_active,
            'user_is_active': user.is_active,
            'registration_date': user_profile.registration_date.strftime('%Y-%m-%d') if user_profile.registration_date else None,
        }
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    user_profile = user.profile 

    new_username = request.data.get('username')
    if new_username and new_username != user.username:
        if User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
            return Response({'detail': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)
        user.username = new_username

    new_email = request.data.get('email')
    if new_email and new_email != user.email:
        if User.objects.filter(email=new_email).exclude(pk=user.pk).exists():
            return Response({'detail': 'Email already taken.'}, status=status.HTTP_400_BAD_REQUEST)
        user.email = new_email
    user.save()

    user_profile.first_name = request.data.get('first_name', user_profile.first_name)
    user_profile.last_name = request.data.get('last_name', user_profile.last_name)
    user_profile.save()

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user_profile.role.role_name if user_profile.role else UserRole.ROLE_REGULAR,
        'profile': {
            'first_name': user_profile.first_name,
            'last_name': user_profile.last_name,
        },
        'message': 'Profile updated successfully.'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic # Add atomic transaction for robust user creation
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    # Default to Regular role if not provided or invalid
    role_name_from_request = request.data.get('role', UserRole.ROLE_REGULAR) 

    # Basic validation
    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not email:
        return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check for existing user/email
    if User.objects.filter(username=username).exists():
        return Response({'username': ['User with this username already exists.']}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'email': ['User with this email already exists.']}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create the user. The post_save signal (create_or_update_user_profile)
        # should fire and create the UserProfile with a default role.
        user = User.objects.create_user(username=username, email=email, password=password)
        # user.is_active = True # create_user by default sets is_active=True unless is_staff or is_superuser is set
        # user.save() # create_user already saves the user

        # Retrieve the UserProfile. The signal should have created it.
        # Using user.profile assumes the related_name='profile' is set on UserProfile.user
        user_profile = user.profile 
        
        # Determine the final role to assign.
        # The signal assigns ROLE_REGULAR. If a different valid role is requested, update it.
        valid_roles = [UserRole.ROLE_REGULAR, UserRole.ROLE_EXPERT, UserRole.ROLE_ADMIN]
        final_role_name = role_name_from_request if role_name_from_request in valid_roles else UserRole.ROLE_REGULAR
        
        if user_profile.role.role_name != final_role_name:
            target_role, _ = UserRole.objects.get_or_create(role_name=final_role_name)
            user_profile.role = target_role
            user_profile.save() # Save the profile with the potentially updated role

        # Create auth token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user_profile.role.role_name,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Log the error for server-side debugging
        print(f"Critical Error during user registration for {username}: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'detail': 'An unexpected error occurred during registration. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CustomAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print(f"--- LOGIN ATTEMPT ---") 
        print(f"Request data: {request.data}") 

        serializer = self.serializer_class(data=request.data,
            context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e: 
            print(f"Serializer validation error: {e.detail}")
            # Ensure the response for validation errors is consistent with what frontend expects
            # DRF's default for raise_exception=True might already be good.
            # Example of more custom error:
            # error_key = list(e.detail.keys())[0] if isinstance(e.detail, dict) else 'non_field_errors'
            # error_message = e.detail[error_key][0] if isinstance(e.detail, dict) and e.detail[error_key] else str(e.detail)
            # return Response({"detail": error_message}, status=status.HTTP_400_BAD_REQUEST)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST) # Keep DRF default or customize
        except Exception as e:
            print(f"Unexpected error during login validation: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({"detail": "An unexpected error occurred during login."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user = serializer.validated_data['user']
        print(f"User validated: {user.username}, Active: {user.is_active}") 

        if not user.is_active:
            print(f"Login failed: User {user.username} is inactive.")
            return Response({"detail": "User account is inactive."}, # Make sure frontend handles this specific detail
                            status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        print(f"Token {'created' if created else 'retrieved'} for user {user.username}")

        try:
            user_profile = user.profile
            if not user_profile.role:
                print(f"User {user.username} profile has no role, assigning default.")
                default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
                user_profile.role = default_role
                user_profile.save()
            role_name_to_send = user_profile.role.role_name
        except UserProfile.DoesNotExist:
            print(f"UserProfile DoesNotExist for {user.username}, creating with default role.")
            default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
            UserProfile.objects.create(user=user, role=default_role) # Ensure this profile is saved
            role_name_to_send = default_role.role_name

        print(f"Login successful for {user.username}, role: {role_name_to_send}")
        response_data = {
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'role': role_name_to_send
        }
        print(f"Response data: {response_data}")
        return Response(response_data)
#
# NOTE: The second, more basic CustomAuthToken class that was here has been removed.
#

# Add these views to the existing views.py file

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_expert_application(request):
    """Submit an expert application"""
    user = request.user
    
    # Check if user already has a pending application
    existing_application = ExpertApplication.objects.filter(
        user=user, status='pending'
    ).first()
    
    if existing_application:
        return Response({
            'detail': 'You already have a pending expert application.',
            'status': 'error'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user is already an expert
    if hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_EXPERT:
        return Response({
            'detail': 'You are already an expert.',
            'status': 'error'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    motivation = request.data.get('motivation', '').strip()
    experience = request.data.get('experience', '').strip()
    qualifications = request.data.get('qualifications', '').strip()
    
    if not motivation or not experience:
        return Response({
            'detail': 'Motivation and experience are required fields.',
            'status': 'error'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    application = ExpertApplication.objects.create(
        user=user,
        motivation=motivation,
        experience=experience,
        qualifications=qualifications
    )
    
    return Response({
        'detail': 'Expert application submitted successfully.',
        'status': 'success',
        'application_id': application.id
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_expert_application(request):
    """Get current user's expert application status"""
    user = request.user
    
    try:
        application = ExpertApplication.objects.filter(user=user).latest('application_date')
        return Response({
            'id': application.id,
            'status': application.status,
            'application_date': application.application_date.strftime('%Y-%m-%d %H:%M'),
            'motivation': application.motivation,
            'experience': application.experience,
            'qualifications': application.qualifications,
            'review_date': application.review_date.strftime('%Y-%m-%d %H:%M') if application.review_date else None,
            'review_notes': application.review_notes
        })
    except ExpertApplication.DoesNotExist:
        return Response({
            'detail': 'No expert application found.',
            'status': 'not_found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expert_applications(request):
    """Get all expert applications (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    applications = ExpertApplication.objects.all()
    
    applications_data = []
    for app in applications:
        applications_data.append({
            'id': app.id,
            'user': {
                'id': app.user.id,
                'username': app.user.username,
                'email': app.user.email,
                'first_name': app.user.first_name,
                'last_name': app.user.last_name
            },
            'status': app.status,
            'application_date': app.application_date.strftime('%Y-%m-%d %H:%M'),
            'motivation': app.motivation,
            'experience': app.experience,
            'qualifications': app.qualifications,
            'reviewed_by': app.reviewed_by.username if app.reviewed_by else None,
            'review_date': app.review_date.strftime('%Y-%m-%d %H:%M') if app.review_date else None,
            'review_notes': app.review_notes
        })
    
    return Response({
        'applications': applications_data,
        'total_count': len(applications_data)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_expert_application(request, application_id):
    """Review an expert application (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        application = ExpertApplication.objects.get(id=application_id)
    except ExpertApplication.DoesNotExist:
        return Response({
            'detail': 'Expert application not found.',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    
    action = request.data.get('action')  # 'approve' or 'reject'
    review_notes = request.data.get('review_notes', '').strip()
    
    if action not in ['approve', 'reject']:
        return Response({
            'detail': 'Invalid action. Must be "approve" or "reject".',
            'status': 'error'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    application.status = 'approved' if action == 'approve' else 'rejected'
    application.reviewed_by = user
    application.review_date = timezone.now()
    application.review_notes = review_notes
    application.save()
    
    # If approved, update user role to Expert
    if action == 'approve':
        expert_role, _ = UserRole.objects.get_or_create(
            role_name=UserRole.ROLE_EXPERT,
            defaults={
                'description': 'Expert user with advanced permissions',
                'access_level': 2,
                'can_provide_expert_feedback': True,
                'can_manage_users': False,
                'can_access_analytics': False
            }
        )
        # Update the user's profile role
        if hasattr(application.user, 'profile'):
            application.user.profile.role = expert_role
            application.user.profile.save()
    
    return Response({
        'detail': f'Expert application {action}d successfully.',
        'status': 'success'
    })

# Admin User Management Endpoints
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_list_users(request):
    """List all users (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        users = User.objects.all().select_related('profile__role')
        user_list = []
        
        for u in users:
            # Get user profile or create default
            try:
                profile = u.profile
                if not profile.role:
                    default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
                    profile.role = default_role
                    profile.save()
                role_name = profile.role.role_name
                first_name = profile.first_name or u.first_name or ""
                last_name = profile.last_name or u.last_name or ""
                is_active = profile.is_active and u.is_active
                registration_date = profile.registration_date
            except Exception:
                # Create profile if doesn't exist
                default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
                profile = UserProfile.objects.create(user=u, role=default_role)
                role_name = default_role.role_name
                first_name = u.first_name or ""
                last_name = u.last_name or ""
                is_active = u.is_active
                registration_date = profile.registration_date
            
            # Get analysis count
            analysis_count = FingerprintAnalysis.objects.filter(image__user=u).count()
            
            # Get last login info
            last_login = u.last_login.strftime('%Y-%m-%d %H:%M:%S') if u.last_login else "Never"
            
            user_data = {
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'first_name': first_name,
                'last_name': last_name,
                'full_name': f"{first_name} {last_name}".strip() or u.username,
                'role': role_name.lower(),
                'status': 'active' if is_active else 'inactive',
                'last_active': last_login,
                'join_date': registration_date.strftime('%Y-%m-%d') if registration_date else u.date_joined.strftime('%Y-%m-%d'),
                'analyses': analysis_count,
                'date_joined': u.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
                'is_staff': u.is_staff,
                'is_superuser': u.is_superuser,
            }
            user_list.append(user_data)
        
        return Response({
            'users': user_list,
            'total_count': len(user_list)
        })
    except Exception as e:
        print(f"Error in admin_list_users: {str(e)}")
        return Response({
            'detail': 'An error occurred while fetching users.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_user(request):
    """Create a new user (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        username = request.data.get('username', '').strip()
        email = request.data.get('email', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        password = request.data.get('password', '').strip()
        role_name = request.data.get('role', 'Regular').strip()
        
        # Validation
        if not username:
            return Response({'detail': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({'detail': 'Password is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for existing user/email
        if User.objects.filter(username=username).exists():
            return Response({'detail': 'User with this username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'detail': 'User with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate role
        valid_roles = [UserRole.ROLE_REGULAR, UserRole.ROLE_EXPERT, UserRole.ROLE_ADMIN]
        if role_name not in valid_roles:
            role_name = UserRole.ROLE_REGULAR
        
        # Create user
        new_user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Set role
        target_role, _ = UserRole.objects.get_or_create(role_name=role_name)
        new_user.profile.role = target_role
        new_user.profile.first_name = first_name
        new_user.profile.last_name = last_name
        new_user.profile.save()
        
        return Response({
            'id': new_user.id,
            'username': new_user.username,
            'email': new_user.email,
            'role': role_name,
            'message': 'User created successfully.'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Error in admin_create_user: {str(e)}")
        return Response({
            'detail': 'An error occurred while creating the user.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_user(request, user_id):
    """Update a user (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'detail': 'User not found.',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Update user fields
        username = request.data.get('username', target_user.username).strip()
        email = request.data.get('email', target_user.email).strip()
        first_name = request.data.get('first_name', target_user.first_name or '').strip()
        last_name = request.data.get('last_name', target_user.last_name or '').strip()
        role_name = request.data.get('role', '').strip()
        is_active = request.data.get('is_active', target_user.is_active)
        
        # Check for duplicate username/email (excluding current user)
        if username != target_user.username and User.objects.filter(username=username).exists():
            return Response({'detail': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)
        if email != target_user.email and User.objects.filter(email=email).exists():
            return Response({'detail': 'Email already taken.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user
        target_user.username = username
        target_user.email = email
        target_user.first_name = first_name
        target_user.last_name = last_name
        target_user.is_active = is_active
        target_user.save()
        
        # Update profile
        if role_name:
            valid_roles = [UserRole.ROLE_REGULAR, UserRole.ROLE_EXPERT, UserRole.ROLE_ADMIN]
            if role_name in valid_roles:
                target_role, _ = UserRole.objects.get_or_create(role_name=role_name)
                target_user.profile.role = target_role
        
        target_user.profile.first_name = first_name
        target_user.profile.last_name = last_name
        target_user.profile.is_active = is_active
        target_user.profile.save()
        
        return Response({
            'id': target_user.id,
            'username': target_user.username,
            'email': target_user.email,
            'role': target_user.profile.role.role_name if target_user.profile.role else UserRole.ROLE_REGULAR,
            'message': 'User updated successfully.'
        })
        
    except Exception as e:
        print(f"Error in admin_update_user: {str(e)}")
        return Response({
            'detail': 'An error occurred while updating the user.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_user(request, user_id):
    """Delete a user (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        target_user = User.objects.get(id=user_id)
        
        # Prevent deleting self
        if target_user.id == user.id:
            return Response({
                'detail': 'Cannot delete your own account.',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        target_user.delete()
        
        return Response({
            'message': 'User deleted successfully.',
            'status': 'success'
        })
        
    except User.DoesNotExist:
        return Response({
            'detail': 'User not found.',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in admin_delete_user: {str(e)}")
        return Response({
            'detail': 'An error occurred while deleting the user.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_bulk_delete_users(request):
    """Bulk delete users (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user_ids = request.data.get('user_ids', [])
        
        if not user_ids:
            return Response({
                'detail': 'No user IDs provided.',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Prevent deleting self
        if user.id in user_ids:
            return Response({
                'detail': 'Cannot delete your own account.',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        deleted_count = User.objects.filter(id__in=user_ids).delete()[0]
        
        return Response({
            'message': f'{deleted_count} users deleted successfully.',
            'deleted_count': deleted_count,
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error in admin_bulk_delete_users: {str(e)}")
        return Response({
            'detail': 'An error occurred while deleting users.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_user(request, user_id):
    """Get detailed user information (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        target_user = User.objects.get(id=user_id)
        
        # Get user profile
        try:
            profile = target_user.profile
            role_name = profile.role.role_name if profile.role else UserRole.ROLE_REGULAR
        except:
            # Create profile if doesn't exist
            default_role, _ = UserRole.objects.get_or_create(role_name=UserRole.ROLE_REGULAR)
            profile = UserProfile.objects.create(user=target_user, role=default_role)
            role_name = default_role.role_name
        
        # Get user statistics
        analysis_count = FingerprintAnalysis.objects.filter(image__user=target_user).count()
        
        user_data = {
            'id': target_user.id,
            'username': target_user.username,
            'email': target_user.email,
            'first_name': profile.first_name or target_user.first_name or '',
            'last_name': profile.last_name or target_user.last_name or '',
            'role': role_name,
            'is_active': profile.is_active and target_user.is_active,
            'date_joined': target_user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
            'last_login': target_user.last_login.strftime('%Y-%m-%d %H:%M:%S') if target_user.last_login else None,
            'analyses_count': analysis_count,
            'is_staff': target_user.is_staff,
            'is_superuser': target_user.is_superuser,
        }
        
        return Response(user_data)
        
    except User.DoesNotExist:
        return Response({
            'detail': 'User not found.',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in admin_get_user: {str(e)}")
        return Response({
            'detail': 'An error occurred while fetching user data.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Role Management Endpoints
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_list_roles(request):
    """List all roles (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        roles = UserRole.objects.all()
        role_list = []
        
        for role in roles:
            # Count users with this role
            user_count = UserProfile.objects.filter(role=role).count()
            
            role_data = {
                'id': role.id,
                'role_name': role.role_name,
                'description': role.description or '',
                'access_level': role.access_level,
                'can_provide_expert_feedback': role.can_provide_expert_feedback,
                'can_manage_users': role.can_manage_users,
                'can_access_analytics': role.can_access_analytics,
                'user_count': user_count,
            }
            role_list.append(role_data)
        
        return Response({
            'roles': role_list,
            'total_count': len(role_list)
        })
    except Exception as e:
        print(f"Error in admin_list_roles: {str(e)}")
        return Response({
            'detail': 'An error occurred while fetching roles.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_role(request):
    """Create a new role (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        role_name = request.data.get('role_name', '').strip()
        description = request.data.get('description', '').strip()
        access_level = request.data.get('access_level', 1)
        can_provide_expert_feedback = request.data.get('can_provide_expert_feedback', False)
        can_manage_users = request.data.get('can_manage_users', False)
        can_access_analytics = request.data.get('can_access_analytics', False)
        
        # Validation
        if not role_name:
            return Response({'detail': 'Role name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if role already exists
        if UserRole.objects.filter(role_name=role_name).exists():
            return Response({'detail': 'Role with this name already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create role
        new_role = UserRole.objects.create(
            role_name=role_name,
            description=description,
            access_level=access_level,
            can_provide_expert_feedback=can_provide_expert_feedback,
            can_manage_users=can_manage_users,
            can_access_analytics=can_access_analytics
        )
        
        return Response({
            'id': new_role.id,
            'role_name': new_role.role_name,
            'description': new_role.description,
            'message': 'Role created successfully.'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Error in admin_create_role: {str(e)}")
        return Response({
            'detail': 'An error occurred while creating the role.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_role(request, role_id):
    """Update a role (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        role = UserRole.objects.get(id=role_id)
        
        # Update role fields
        role.description = request.data.get('description', role.description)
        role.access_level = request.data.get('access_level', role.access_level)
        role.can_provide_expert_feedback = request.data.get('can_provide_expert_feedback', role.can_provide_expert_feedback)
        role.can_manage_users = request.data.get('can_manage_users', role.can_manage_users)
        role.can_access_analytics = request.data.get('can_access_analytics', role.can_access_analytics)
        
        role.save()
        
        return Response({
            'id': role.id,
            'role_name': role.role_name,
            'description': role.description,
            'message': 'Role updated successfully.'
        })
        
    except UserRole.DoesNotExist:
        return Response({
            'detail': 'Role not found.',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in admin_update_role: {str(e)}")
        return Response({
            'detail': 'An error occurred while updating the role.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_role(request, role_id):
    """Delete a role (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        role = UserRole.objects.get(id=role_id)
        
        # Prevent deleting default roles
        if role.role_name in [UserRole.ROLE_ADMIN, UserRole.ROLE_EXPERT, UserRole.ROLE_REGULAR]:
            return Response({
                'detail': 'Cannot delete default system roles.',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if role is in use
        if UserProfile.objects.filter(role=role).exists():
            return Response({
                'detail': 'Cannot delete role that is assigned to users.',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        role.delete()
        
        return Response({
            'message': 'Role deleted successfully.',
            'status': 'success'
        })
        
    except UserRole.DoesNotExist:
        return Response({
            'detail': 'Role not found.',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in admin_delete_role: {str(e)}")
        return Response({
            'detail': 'An error occurred while deleting the role.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Permission Settings Endpoint
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_permissions(request):
    """Get all system permissions (admin only)"""
    user = request.user
    
    # Check if user is admin
    if not (hasattr(user, 'profile') and user.profile.role and user.profile.role.role_name == UserRole.ROLE_ADMIN):
        return Response({
            'detail': 'Permission denied. Admin access required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Define system permissions
        permissions = [
            {
                'id': 'can_provide_expert_feedback',
                'name': 'Provide Expert Feedback',
                'description': 'Ability to provide expert feedback on fingerprint analyses',
                'category': 'Analysis'
            },
            {
                'id': 'can_manage_users',
                'name': 'Manage Users',
                'description': 'Ability to create, edit, and delete user accounts',
                'category': 'User Management'
            },
            {
                'id': 'can_access_analytics',
                'name': 'Access Analytics',
                'description': 'Ability to view system analytics and reports',
                'category': 'Analytics'
            }
        ]
        
        # Get role-permission mappings
        roles = UserRole.objects.all()
        role_permissions = {}
        
        for role in roles:
            role_permissions[role.role_name] = {
                'can_provide_expert_feedback': role.can_provide_expert_feedback,
                'can_manage_users': role.can_manage_users,
                'can_access_analytics': role.can_access_analytics,
            }
        
        return Response({
            'permissions': permissions,
            'role_permissions': role_permissions
        })
        
    except Exception as e:
        print(f"Error in admin_get_permissions: {str(e)}")
        return Response({
            'detail': 'An error occurred while fetching permissions.',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# User Groups Endpoints
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_user_groups(request):
    """
    Get all user groups for admin management
    """
    if not request.user.profile.role.can_manage_users:
        return Response({
            'message': 'Access denied. Admin privileges required.',
            'status': 'error'
        }, status=status.HTTP_403_FORBIDDEN)
        
    try:
        # For now, return basic groups structure
        # In a real implementation, you might have a UserGroup model
        groups = [
            {
                'id': 'group-001',
                'name': 'Default Users',
                'type': 'auto',
                'description': 'Automatically assigned group for regular users',
                'user_count': User.objects.filter(profile__role__role_name=UserRole.ROLE_REGULAR).count(),
                'users': []
            },
            {
                'id': 'group-002', 
                'name': 'Expert Reviewers',
                'type': 'manual',
                'description': 'Expert users who can review analyses',
                'user_count': User.objects.filter(profile__role__role_name=UserRole.ROLE_EXPERT).count(),
                'users': []
            },
            {
                'id': 'group-003',
                'name': 'Administrators', 
                'type': 'manual',
                'description': 'Admin users with full system access',
                'user_count': User.objects.filter(profile__role__role_name=UserRole.ROLE_ADMIN).count(),
                'users': []
            }
        ]
        
        return Response({
            'groups': groups,
            'total_groups': len(groups),
            'status': 'success'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in admin_get_user_groups: {str(e)}")
        traceback.print_exc()
        return Response({
            'message': 'Failed to fetch user groups',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_analysis_history(request):
    """
    Get analysis history for the current user
    """
    try:
        # Get user's fingerprint analyses
        analyses = FingerprintAnalysis.objects.filter(
            image__user=request.user
        ).select_related('image', 'model_version').order_by('-created_at')
        
        history_data = []
        for analysis in analyses:
            history_data.append({
                'id': f"FP-{analysis.id}",
                'date': analysis.created_at,
                'classification': analysis.classification or 'Unknown',
                'ridge_count': analysis.ridge_count or 0,
                'confidence': round((analysis.confidence_score or 0) * 100, 1),
                'status': 'completed' if analysis.analysis_status == 'completed_mock' else 'needs_review',
                'image_id': analysis.image.id,
                'processing_time': analysis.processing_time or '0s'
            })
        
        return Response({
            'history': history_data,
            'total_count': len(history_data),
            'status': 'success'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in get_user_analysis_history: {str(e)}")
        traceback.print_exc()
        return Response({
            'message': 'Failed to fetch analysis history',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_analysis_detail(request, analysis_id):
    """
    Get detailed information about a specific analysis
    """
    try:
        # Parse the analysis ID (removing FP- prefix if present)
        if analysis_id.startswith('FP-'):
            actual_id = analysis_id[3:]
        else:
            actual_id = analysis_id
            
        analysis = FingerprintAnalysis.objects.select_related(
            'image', 'model_version'
        ).get(id=actual_id, image__user=request.user)
        
        analysis_data = {
            'id': f"FP-{analysis.id}",
            'type': f"Index Finger",  # Could be enhanced with actual finger type
            'status': 'Analyzed' if analysis.analysis_status == 'completed_mock' else 'Processing',
            'upload_date': analysis.image.upload_date.strftime('%b %d, %Y'),
            'analyzed_date': analysis.created_at.strftime('%b %d, %Y'),
            'user': analysis.image.user.get_full_name() or analysis.image.user.username,
            'pattern': analysis.classification or 'Unknown',
            'pattern_subtype': 'Standard',  # Could be enhanced with subtype analysis
            'confidence_score': round((analysis.confidence_score or 0) * 100),
            'minutiae_count': analysis.ridge_count or 0,
            'notes': f"Analysis completed using {analysis.model_version.version_number if analysis.model_version else 'Unknown model'}",
            'image_url': analysis.image.image.url if analysis.image.image else None,
            'processing_time': analysis.processing_time or '0s',
            'analysis_results': analysis.analysis_results or {}
        }
        
        return Response({
            'analysis': analysis_data,
            'status': 'success'
        }, status=status.HTTP_200_OK)
        
    except FingerprintAnalysis.DoesNotExist:
        return Response({
            'message': 'Analysis not found or access denied',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in get_analysis_detail: {str(e)}")
        traceback.print_exc()
        return Response({
            'message': 'Failed to fetch analysis details',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_analysis(request, analysis_id):
    """
    Delete a user's analysis
    """
    try:
        # Parse the analysis ID (removing FP- prefix if present)
        if analysis_id.startswith('FP-'):
            actual_id = analysis_id[3:]
        else:
            actual_id = analysis_id
            
        analysis = FingerprintAnalysis.objects.get(id=actual_id, image__user=request.user)
        analysis.delete()
        
        return Response({
            'message': 'Analysis deleted successfully',
            'status': 'success'
        }, status=status.HTTP_200_OK)
        
    except FingerprintAnalysis.DoesNotExist:
        return Response({
            'message': 'Analysis not found or access denied',
            'status': 'error'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in delete_user_analysis: {str(e)}")
        traceback.print_exc()
        return Response({
            'message': 'Failed to delete analysis',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_delete_user_analyses(request):
    """
    Delete multiple user analyses
    """
    try:
        analysis_ids = request.data.get('analysis_ids', [])
        if not analysis_ids:
            return Response({
                'message': 'No analysis IDs provided',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Parse analysis IDs (removing FP- prefix if present)
        actual_ids = []
        for aid in analysis_ids:
            if aid.startswith('FP-'):
                actual_ids.append(aid[3:])
            else:
                actual_ids.append(aid)
        
        deleted_count = FingerprintAnalysis.objects.filter(
            id__in=actual_ids, 
            image__user=request.user
        ).delete()[0]
        
        return Response({
            'message': f'{deleted_count} analyses deleted successfully',
            'deleted_count': deleted_count,
            'status': 'success'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in bulk_delete_user_analyses: {str(e)}")
        traceback.print_exc()
        return Response({
            'message': 'Failed to delete analyses',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)