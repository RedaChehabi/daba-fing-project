# File: backend/daba_fing_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from django.views.generic import RedirectView # <-- IMPORT THIS

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # This includes your main app's URLs from api/urls.py
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'), # Standard DRF token endpoint

    # Added from core/urls.py: Redirects the root path of the backend
    # You might want to redirect to your frontend's URL in production,
    # or just to the /api/ endpoint as a simple landing for the backend.
    path('', RedirectView.as_view(url='/api/', permanent=False), name='root_redirect'),

    # If you had other unique URL patterns from core/urls.py, add them here.
    # Example:
    # path('some_other_core_path/', include('some_other_app.urls')),
]

# Serve media files in development (this logic is fine and common)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # Also good to have for static files if not using whitenoise yet