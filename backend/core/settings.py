# Add this import at the top if it's not already there
import os

# Find the existing settings section and add the media configuration

# Media files (User uploaded files)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ... rest of settings ...