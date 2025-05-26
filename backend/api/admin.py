from django.contrib import admin
from .models import (
    UserRole, UserProfile, ImageSource, FingerprintImage, 
    ModelVersion, FingerprintAnalysis, UserFeedback,
    UserSession, UserNotification, AnalysisHistory,
    ExportLog, MergedFingerprint, ExpertApplication  # Add ExpertApplication
)

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('role_name', 'access_level', 'can_provide_expert_feedback', 'can_manage_users')
    search_fields = ('role_name', 'description')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'first_name', 'last_name', 'is_active', 'registration_date')
    list_filter = ('is_active', 'role', 'registration_date')
    search_fields = ('user__username', 'first_name', 'last_name')

@admin.register(ImageSource)
class ImageSourceAdmin(admin.ModelAdmin):
    list_display = ('source_type', 'device_name', 'device_model', 'is_active')
    list_filter = ('source_type', 'is_active')
    search_fields = ('source_type', 'device_name', 'device_model')

@admin.register(FingerprintImage)
class FingerprintImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'hand_type', 'finger_position', 'upload_date', 'is_processed')
    list_filter = ('hand_type', 'finger_position', 'is_processed', 'upload_date')
    search_fields = ('title', 'user__username', 'description')
    date_hierarchy = 'upload_date'

@admin.register(ModelVersion)
class ModelVersionAdmin(admin.ModelAdmin):
    list_display = ('version_number', 'release_date', 'accuracy_score', 'is_active', 'framework_used')
    list_filter = ('is_active', 'release_date', 'framework_used')
    search_fields = ('version_number', 'training_dataset')

@admin.register(FingerprintAnalysis)
class FingerprintAnalysisAdmin(admin.ModelAdmin):
    list_display = ('image', 'classification', 'ridge_count', 'confidence_score', 'analysis_date', 'is_validated')
    list_filter = ('classification', 'is_validated', 'analysis_date')
    search_fields = ('image__title', 'classification')
    date_hierarchy = 'analysis_date'

@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ('analysis', 'user', 'feedback_type', 'feedback_date', 'is_expert_feedback')
    list_filter = ('feedback_type', 'is_expert_feedback', 'feedback_date')
    search_fields = ('user__username', 'correction_details')
    date_hierarchy = 'feedback_date'

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_time', 'expiry_time', 'is_active', 'platform')
    list_filter = ('is_active', 'login_time', 'platform')
    search_fields = ('user__username', 'ip_address')
    date_hierarchy = 'login_time'

@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_type', 'creation_date', 'is_read')
    list_filter = ('notification_type', 'is_read', 'creation_date')
    search_fields = ('user__username', 'message')
    date_hierarchy = 'creation_date'

@admin.register(AnalysisHistory)
class AnalysisHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'image', 'action_performed', 'timestamp')
    list_filter = ('action_performed', 'timestamp')
    search_fields = ('user__username', 'image__title', 'action_performed')
    date_hierarchy = 'timestamp'

@admin.register(ExportLog)
class ExportLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'analysis', 'export_format', 'export_date', 'is_successful')
    list_filter = ('export_format', 'is_successful', 'export_date')
    search_fields = ('user__username', 'file_path')
    date_hierarchy = 'export_date'

@admin.register(MergedFingerprint)
class MergedFingerprintAdmin(admin.ModelAdmin):
    list_display = ('user', 'left_image', 'right_image', 'merge_date', 'is_processed')
    list_filter = ('is_processed', 'merge_date')
    search_fields = ('user__username',)
    date_hierarchy = 'merge_date'

# Add this import and admin registration
from .models import ExpertApplication

@admin.register(ExpertApplication)
class ExpertApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'application_date', 'status', 'reviewed_by', 'review_date')
    list_filter = ('status', 'application_date', 'review_date')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('application_date',)
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status != 'pending':
            return self.readonly_fields + ('user', 'motivation', 'experience', 'qualifications')
        return self.readonly_fields
    
    fieldsets = (
        ('Application Info', {
            'fields': ('user', 'status', 'application_date')
        }),
        ('Application Details', {
            'fields': ('motivation', 'experience', 'qualifications')
        }),
        ('Review', {
            'fields': ('reviewed_by', 'review_date', 'review_notes')
        }),
    )
