from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import FingerprintImage, UserProfile
from .serializers import FingerprintImageSerializer

class FingerprintAnalysisView(APIView):
    """
    API view for fingerprint analysis
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        try:
            # Get the fingerprint ID from the request
            fingerprint_id = request.data.get('fingerprint_id')
            
            if not fingerprint_id:
                return Response({
                    "message": "Fingerprint ID is required",
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the fingerprint image
            try:
                fingerprint = FingerprintImage.objects.get(id=fingerprint_id, user=request.user)
            except FingerprintImage.DoesNotExist:
                return Response({
                    "message": "Fingerprint not found",
                    "status": "error"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # TODO: Replace this with actual model integration
            # This is a placeholder for the fingerprint analysis model
            
            # Create a placeholder analysis result
            from .models import FingerprintAnalysis, ModelVersion
            
            # Get or create a placeholder model version
            model_version, _ = ModelVersion.objects.get_or_create(
                version_number="0.1-placeholder",
                defaults={
                    "release_date": timezone.now(),
                    "accuracy_score": 0.0,
                    "training_dataset": "placeholder",
                    "model_parameters": "{}",
                    "is_active": True,
                    "framework_used": "placeholder"
                }
            )
            
            # Create a placeholder analysis
            analysis = FingerprintAnalysis.objects.create(
                image=fingerprint,
                model_version=model_version,
                classification="Placeholder - Model not implemented yet",
                ridge_count=0,
                confidence_score=0.0,
                analysis_status="placeholder",
                processing_time="0s",
                is_validated=False,
                analysis_results={
                    "message": "This is a placeholder result. The actual model is not implemented yet."
                }
            )
            
            # Record the analysis in history
            from .models import AnalysisHistory
            AnalysisHistory.objects.create(
                user=request.user,
                image=fingerprint,
                analysis=analysis,
                action_performed="placeholder_analysis",
                platform_used=request.META.get('HTTP_USER_AGENT', 'unknown'),
                device_info=request.META.get('HTTP_USER_AGENT', 'unknown')
            )
            
            # Return a placeholder response
            return Response({
                "message": "Fingerprint analysis completed (placeholder)",
                "status": "success",
                "pattern_type": "Placeholder - Model not implemented yet",
                "minutiae_count": 0,
                "ridge_count": 0,
                "quality_score": 0.0,
                "additional_details": {
                    "note": "This is a placeholder result. The actual model is not implemented yet."
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "message": f"Error processing fingerprint: {str(e)}",
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)

class FingerprintViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for fingerprints
    """
    serializer_class = FingerprintImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FingerprintImage.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Save the user with the fingerprint
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Handle file upload
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

# Add these imports
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
# Remove the Profile import and use UserProfile instead

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    try:
        # Use the profile related_name
        profile = user.profile
    except UserProfile.DoesNotExist:
        # Create profile if it doesn't exist
        profile = UserProfile.objects.create(user=user)
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': profile.role.role_name if profile.role else 'Regular User',
        'profile': {
            'first_name': profile.first_name,
            'last_name': profile.last_name,
            'is_active': profile.is_active,
            'registration_date': profile.registration_date
        }
    })

# In your register_user function
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user and return a token
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role_name = request.data.get('role', 'Regular User')  # Default to 'Regular User' if not specified
    
    # Validate required fields
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response({'username': ['User with this username already exists']}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if email already exists (if provided)
    if email and User.objects.filter(email=email).exists():
        return Response({'email': ['User with this email already exists']}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create the user
    user = User.objects.create_user(username=username, email=email, password=password)
    
    # Set the user as active
    user.is_active = True
    user.save()
    
    # Get or create the role
    from .models import UserRole
    role, created = UserRole.objects.get_or_create(
        role_name=role_name,
        defaults={
            'description': f'Auto-created role for {role_name}',
            'access_level': 1,
            'can_provide_expert_feedback': False,
            'can_manage_users': False,
            'can_access_analytics': False
        }
    )
    
    # Set the user's role
    user.profile.role = role
    user.profile.save()
    
    # Create token for the new user
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.profile.role.role_name,
        'token': token.key
    }, status=status.HTTP_201_CREATED)

# Add this class
class CustomAuthToken(ObtainAuthToken):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Get user profile
        try:
            profile = user.profile
        except:
            from .models import UserProfile, UserRole
            default_role, _ = UserRole.objects.get_or_create(
                role_name="Regular User",
                defaults={
                    'description': 'Standard user with basic permissions',
                    'access_level': 1,
                }
            )
            profile = UserProfile.objects.create(user=user, role=default_role)
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'role': profile.role.role_name if profile.role else 'Regular User'
        })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update user profile information
    """
    user = request.user
    
    # Update username if provided
    if 'username' in request.data:
        # Check if username is already taken
        new_username = request.data['username']
        if new_username != user.username and User.objects.filter(username=new_username).exists():
            return Response({'detail': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        user.username = new_username
    
    # Update email if provided
    if 'email' in request.data:
        # Check if email is already taken
        new_email = request.data['email']
        if new_email != user.email and User.objects.filter(email=new_email).exists():
            return Response({'detail': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)
        user.email = new_email
    
    # Save user changes
    user.save()
    
    # Return updated user data
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.groups.first().name if user.groups.exists() else 'Regular'  # Adjust based on how you store roles
    })
