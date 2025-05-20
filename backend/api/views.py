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
                    "message": "Fingerprint ID is required.",
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                fingerprint_image_instance = FingerprintImage.objects.get(id=fingerprint_id, user=request.user)
            except FingerprintImage.DoesNotExist:
                return Response({
                    "message": "Fingerprint not found or you do not have permission to access it.",
                    "status": "error"
                }, status=status.HTTP_404_NOT_FOUND)

            if not fingerprint_image_instance.image or not hasattr(fingerprint_image_instance.image, 'path'):
                return Response({
                    "message": "Fingerprint image file not found or path is invalid.",
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)

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
                analysis_status="completed_mock",
                processing_time=analysis_results_data.get("processing_time", "0s"),
                is_validated=False,
                analysis_results=analysis_results_data.get("analysis_details", {})
            )

            fingerprint_image_instance.is_processed = True
            fingerprint_image_instance.preprocessing_status = "analyzed_mock"
            fingerprint_image_instance.save()

            AnalysisHistory.objects.create(
                user=request.user,
                image=fingerprint_image_instance,
                analysis=analysis,
                action_performed="mock_analysis_completed",
                platform_used=request.META.get('HTTP_USER_AGENT', 'unknown'),
                device_info=request.META.get('REMOTE_ADDR', 'unknown')
            )

            return Response({
                "message": "Fingerprint analysis (mock) completed successfully.",
                "status": "success",
                "id": analysis.id,
                "fingerprint_id": fingerprint_image_instance.id,
                "classification": analysis.classification,
                "ridge_count": analysis.ridge_count,
                "confidence": analysis.confidence_score * 100, # Present as percentage
                "processing_time": analysis.processing_time,
                "additional_details": analysis.analysis_results
            }, status=status.HTTP_200_OK)

        except FingerprintImage.DoesNotExist:
            return Response({"message": "Fingerprint not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # It's good practice to log the full error on the server for debugging
            import traceback
            print(f"Error in FingerprintAnalysisView: {str(e)}")
            traceback.print_exc() # This will print the full stack trace to your server console
            return Response({
                "message": f"An unexpected error occurred during analysis. Please contact support if the issue persists.",
                "status": "error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FingerprintViewSet(viewsets.ModelViewSet):
    serializer_class = FingerprintImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FingerprintImage.objects.filter(user=self.request.user).order_by('-upload_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        mutable_data = request.data.copy()
        serializer = self.get_serializer(data=mutable_data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e: # Consider more specific exception handling
            error_detail = str(e)
            if hasattr(e, 'detail') and isinstance(e.detail, dict): # For DRF ValidationErrors
                error_detail = e.detail
            elif hasattr(e, 'detail') and isinstance(e.detail, list) and len(e.detail) > 0:
                 error_detail = e.detail[0] # Take the first error message
            return Response(
                {"error": error_detail, "status": "error"},
                status=status.HTTP_400_BAD_REQUEST
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
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role_name_from_request = request.data.get('role', UserRole.ROLE_REGULAR)

    valid_roles = [UserRole.ROLE_REGULAR, UserRole.ROLE_EXPERT, UserRole.ROLE_ADMIN]
    if role_name_from_request not in valid_roles:
        role_to_assign = UserRole.ROLE_REGULAR
    else:
        role_to_assign = role_name_from_request

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'username': ['User with this username already exists.']}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'email': ['User with this email already exists.']}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.is_active = True 
    user.save()

    # UserProfile should be created by the signal here
    user_profile = UserProfile.objects.get(user=user) # Re-fetch to ensure it's the one from DB
    role_instance, _ = UserRole.objects.get_or_create(role_name=role_to_assign)
    user_profile.role = role_instance
    user_profile.save()

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user_profile.role.role_name,
        'token': token.key
    }, status=status.HTTP_201_CREATED)


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