from rest_framework import permissions

class IsUser(permissions.BasePermission):
    """
    Permission to allow only regular users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.role == 'user'

class IsExpert(permissions.BasePermission):
    """
    Permission to allow only experts.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.role == 'expert'

class IsAdmin(permissions.BasePermission):
    """
    Permission to allow only admins.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.role == 'admin'