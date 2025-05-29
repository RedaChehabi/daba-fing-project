from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'fingerprints', views.FingerprintViewSet, basename='fingerprint')

from .views import (
    FingerprintAnalysisView, CustomAuthToken,
    profile, submit_expert_application, get_user_expert_application, 
    get_expert_applications, review_expert_application,
    admin_list_users, admin_create_user, admin_update_user, 
    admin_delete_user, admin_bulk_delete_users, admin_get_user,
    admin_list_roles, admin_create_role, admin_update_role, admin_delete_role,
    admin_get_permissions, admin_get_user_groups,
    get_user_analysis_history, get_analysis_detail, delete_user_analysis, bulk_delete_user_analyses,
    get_analytics_data, get_dashboard_stats
)

# Add these URLs to the existing urlpatterns
from django.urls import path, include
from . import views

urlpatterns = [
    path('', include(router.urls)),
    path('userprofile/', views.profile, name='profile'),
    path('userprofile/update/', views.update_profile, name='update_profile'),
    path('register/', views.register_user, name='register'),
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('fingerprint/analyze/', views.FingerprintAnalysisView.as_view(), name='analyze_fingerprint'),
    # Expert application URLs
    path('expert-application/submit/', views.submit_expert_application, name='submit_expert_application'),
    path('expert-application/status/', views.get_user_expert_application, name='get_user_expert_application'),
    path('expert-applications/', views.get_expert_applications, name='get_expert_applications'),
    path('expert-application/<int:application_id>/review/', views.review_expert_application, name='review_expert_application'),
    # Admin user management URLs
    path('admin/users/', admin_list_users, name='admin_list_users'),
    path('admin/users/create/', admin_create_user, name='admin_create_user'),
    path('admin/users/<int:user_id>/', admin_get_user, name='admin_get_user'),
    path('admin/users/<int:user_id>/update/', admin_update_user, name='admin_update_user'),
    path('admin/users/<int:user_id>/delete/', admin_delete_user, name='admin_delete_user'),
    path('admin/users/bulk-delete/', admin_bulk_delete_users, name='admin_bulk_delete_users'),
    # Admin role management URLs
    path('admin/roles/', admin_list_roles, name='admin_list_roles'),
    path('admin/roles/create/', admin_create_role, name='admin_create_role'),
    path('admin/roles/<int:role_id>/update/', admin_update_role, name='admin_update_role'),
    path('admin/roles/<int:role_id>/delete/', admin_delete_role, name='admin_delete_role'),
    # Admin permission and group URLs
    path('admin/permissions/', admin_get_permissions, name='admin_get_permissions'),
    path('admin/user-groups/', admin_get_user_groups, name='admin_get_user_groups'),
    # User analysis history URLs
    path('user/analysis-history/', get_user_analysis_history, name='get_user_analysis_history'),
    path('analysis/<str:analysis_id>/', get_analysis_detail, name='get_analysis_detail'),
    path('analysis/<str:analysis_id>/delete/', delete_user_analysis, name='delete_user_analysis'),
    path('user/analysis/bulk-delete/', bulk_delete_user_analyses, name='bulk_delete_user_analyses'),
    # Analytics and dashboard URLs
    path('admin/analytics/', get_analytics_data, name='get_analytics_data'),
    path('dashboard/stats/', get_dashboard_stats, name='get_dashboard_stats'),
]
