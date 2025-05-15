from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'fingerprints', views.FingerprintViewSet, basename='fingerprint')

urlpatterns = [
    path('', include(router.urls)),
    path('userprofile/', views.profile, name='profile'),
    path('userprofile/update/', views.update_profile, name='update_profile'),  # Add this line
    path('register/', views.register_user, name='register'),
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('fingerprint/analyze/', views.FingerprintAnalysisView.as_view(), name='analyze_fingerprint'),
]
