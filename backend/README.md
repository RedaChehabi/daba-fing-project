# DabaFing Backend API

The DabaFing backend is a Django REST Framework-based API that provides fingerprint analysis services, user authentication, and data management for all client applications (desktop, web, and mobile).

## Features

### 🔐 Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **User Management**: Registration, login, profile management
- **Role-Based Access**: Admin and user role permissions
- **Session Management**: Secure session handling

### 🔍 Fingerprint Analysis
- **Image Processing**: Advanced fingerprint image analysis
- **Pattern Recognition**: Automated fingerprint classification
- **Ridge Counting**: Precise ridge counting algorithms
- **Quality Assessment**: Image quality evaluation
- **Batch Processing**: Multiple fingerprint analysis

### 📊 Data Management
- **SQLite Database**: Development database (easily switchable to PostgreSQL)
- **File Storage**: Secure fingerprint image storage
- **Data Export**: CSV and JSON export capabilities
- **Audit Logging**: Complete activity tracking

### 🚀 API Features
- **RESTful API**: Clean, consistent API design
- **CORS Support**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting and throttling
- **Documentation**: Auto-generated API documentation
- **Error Handling**: Comprehensive error responses

## Tech Stack

- **Framework**: Django 4.2+ with Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT tokens
- **File Storage**: Local filesystem (configurable to cloud storage)
- **Image Processing**: Pillow, OpenCV
- **API Documentation**: DRF Spectacular (OpenAPI/Swagger)

## Getting Started

### Prerequisites
- Python 3.9+
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

### Available Commands

```bash
# Start development server
python manage.py runserver

# Run database migrations
python manage.py migrate

# Create new migrations
python manage.py makemigrations

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Run tests
python manage.py test

# Shell access
python manage.py shell
```

## Project Structure

```
backend/
├── api/                        # Main API application
│   ├── models.py              # Database models
│   ├── views.py               # API views
│   ├── serializers.py         # Data serializers
│   ├── urls.py                # URL routing
│   ├── admin.py               # Django admin configuration
│   ├── permissions.py         # Custom permissions
│   ├── signals.py             # Django signals
│   └── migrations/            # Database migrations
├── daba_fing_backend/         # Django project settings
│   ├── settings.py            # Main settings
│   ├── urls.py                # Root URL configuration
│   └── wsgi.py                # WSGI configuration
├── media/                     # User uploaded files
├── staticfiles/               # Static files
├── requirements.txt           # Python dependencies
├── manage.py                  # Django management script
├── Dockerfile                 # Docker configuration
└── README.md                  # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/user/` - Get current user info

### Fingerprint Analysis
- `POST /api/fingerprints/upload/` - Upload fingerprint image
- `GET /api/fingerprints/` - List user's fingerprints
- `GET /api/fingerprints/{id}/` - Get specific fingerprint
- `POST /api/fingerprints/{id}/analyze/` - Analyze fingerprint
- `DELETE /api/fingerprints/{id}/` - Delete fingerprint

### User Management
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile
- `GET /api/users/history/` - Get analysis history

### Admin (Admin users only)
- `GET /api/admin/users/` - List all users
- `GET /api/admin/analytics/` - System analytics
- `GET /api/admin/logs/` - System logs

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (for production)
DATABASE_URL=postgresql://user:password@localhost:5432/dabafing

# File Storage
MEDIA_ROOT=/path/to/media/files
STATIC_ROOT=/path/to/static/files

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_EXPIRATION_HOURS=24
```

### Database Configuration

#### Development (SQLite)
The default configuration uses SQLite for development. No additional setup required.

#### Production (PostgreSQL)
For production, update `settings.py` to use PostgreSQL:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'dabafing',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t dabafing-backend .
```

### Run with Docker Compose
```bash
docker-compose up -d
```

## API Documentation

When the server is running, API documentation is available at:
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

## Testing

Run the test suite:
```bash
python manage.py test
```

Run with coverage:
```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generates HTML coverage report
```

## Security

The backend implements several security measures:
- **CORS Configuration**: Proper cross-origin resource sharing
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **SQL Injection Protection**: Django ORM prevents SQL injection
- **XSS Protection**: Built-in XSS protection

## Performance

- **Database Optimization**: Efficient database queries with proper indexing
- **Caching**: Redis caching for frequently accessed data (configurable)
- **File Compression**: Image compression for storage optimization
- **Pagination**: Paginated API responses for large datasets

## Monitoring & Logging

- **Django Logging**: Comprehensive logging configuration
- **Error Tracking**: Detailed error logging and tracking
- **Performance Monitoring**: Request/response time monitoring
- **Health Checks**: API health check endpoints

## Contributing

1. Follow Django best practices
2. Write tests for new features
3. Update API documentation
4. Follow PEP 8 style guidelines
5. Use meaningful commit messages

## License

This project is private and proprietary to the DabaFing team. 