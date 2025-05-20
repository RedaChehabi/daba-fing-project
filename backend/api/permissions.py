from rest_framework import permissions
from .models import UserRole # Import UserRole to access the constants

class IsUser(permissions.BasePermission):
    """
    Permission to allow only regular users.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.role is not None and # Ensure role is not None
            request.user.profile.role.role_name == UserRole.ROLE_REGULAR
        )

class IsExpert(permissions.BasePermission):
    """
    Permission to allow only experts.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.role is not None and # Ensure role is not None
            request.user.profile.role.role_name == UserRole.ROLE_EXPERT
        )

class IsAdmin(permissions.BasePermission):
    """
    Permission to allow only admins.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.role is not None and # Ensure role is not None
            request.user.profile.role.role_name == UserRole.ROLE_ADMIN
        )