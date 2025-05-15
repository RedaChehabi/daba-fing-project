from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView  # Add this import

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # Add a root URL pattern that redirects to your frontend or API
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    # ... other URL patterns ...
]

# Add this to serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)