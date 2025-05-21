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
    UserProfile, UserRole # Ensure all necessary models are imported
)
# Removed UserProfile, UserRole, User imports here as they are already imported above or from auth.models
from .serializers import FingerprintImageSerializer
from django.db import transaction # Import transaction



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