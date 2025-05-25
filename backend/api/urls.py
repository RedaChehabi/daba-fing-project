from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'fingerprints', views.FingerprintViewSet, basename='fingerprint')

from .views import (
    FingerprintAnalysisView, CustomAuthToken,
    profile, submit_expert_application, get_user_expert_application, 
    get_expert_applications, review_expert_application  # Updated imports
)

# Add these URLs to the existing urlpatterns
from django.urls import path, include
from . import views

urlpatterns = [
    path('', include(router.urls)),
    path('userprofile/', views.profile, name='profile'),
    path('userprofile/update/', views.update_profile, name='update_profile'),  # Add this line
    path('register/', views.register_user, name='register'),
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('fingerprint/analyze/', views.FingerprintAnalysisView.as_view(), name='analyze_fingerprint'),
    # Expert application URLs
    path('expert-application/submit/', views.submit_expert_application, name='submit_expert_application'),
    path('expert-application/status/', views.get_user_expert_application, name='get_user_expert_application'),
    path('expert-applications/', views.get_expert_applications, name='get_expert_applications'),
    path('expert-application/<int:application_id>/review/', views.review_expert_application, name='review_expert_application'),
]
