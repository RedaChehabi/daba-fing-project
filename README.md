# DabaFing - Advanced Fingerprint Analysis System

<div align="center">

![DabaFing Logo](https://img.shields.io/badge/DabaFing-Fingerprint%20Analysis-blue?style=for-the-badge&logo=fingerprint)

**Version 0.1.0** | **Status: Active Development**

*Advanced fingerprint analysis and identification system with web and desktop applications*

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5.1.7-green?style=flat-square&logo=django)](https://djangoproject.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-47848F?style=flat-square&logo=electron)](https://electronjs.org/)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Electron App](#electron-app)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

DabaFing is a comprehensive fingerprint analysis and management system designed for forensic analysis, identity verification, and biometric authentication. The system provides both web-based and desktop applications with role-based access control for different user types.

### Key Capabilities
- **Fingerprint Upload & Analysis**: Advanced image processing and pattern recognition
- **Multi-Platform Support**: Web application and Electron desktop app
- **Role-Based Access**: Admin, Expert, and User roles with different permissions
- **Real-time Analytics**: Dashboard with system metrics and analysis reports
- **Expert Verification**: Professional fingerprint analysis workflow
- **Secure Authentication**: JWT-based authentication with role management

## ✨ Features

### 🌐 Web Application
- **Full Marketing Site**: Complete landing pages, about, contact, pricing
- **User Dashboard**: Upload, history, profile management
- **Expert Dashboard**: Verification tools, analysis workflow
- **Admin Panel**: User management, system analytics, expert applications
- **Responsive Design**: Mobile-first approach with modern UI/UX

### 🖥️ Desktop Application (Electron)
- **Focused Experience**: Auth and dashboard pages only
- **Offline Capability**: Local fingerprint processing
- **Native Integration**: OS-level file system access
- **Enhanced Security**: Desktop-grade security features

### 📱 Mobile Application (React Native)
- **Cross-Platform**: iOS and Android support via Expo
- **Camera Integration**: Real-time fingerprint capture
- **Offline Analysis**: Local fingerprint processing
- **Push Notifications**: Real-time analysis updates
- **Biometric Auth**: Device-level security integration

### 🔐 Authentication & Authorization
- **Multi-Role System**: Admin, Expert, User roles
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Role-based page access
- **Expert Applications**: Application workflow for expert status

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Multi-Platform)  │◄──►│   (Django)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Web App       │    │ • REST API      │    │ • User Data     │
│ • Electron App  │    │ • Auth System   │    │ • Fingerprints  │
│ • Mobile App    │    │ • File Upload   │    │ • Analytics     │
│ • Admin Panel   │    │ • Image Analysis│    │ • Audit Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend (v0.1.0)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.2.4 | React framework with SSR/SSG |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.0+ | Type safety |
| **Tailwind CSS** | 4.0 | Utility-first CSS |
| **Framer Motion** | 12.6.2 | Animations |
| **Radix UI** | Latest | Accessible components |
| **Electron** | Latest | Desktop app framework |
| **Lucide React** | 0.485.0 | Icon library |
| **Recharts** | 2.15.1 | Data visualization |

### Mobile (v0.1.0)
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.74+ | Mobile app framework |
| **Expo** | 53.0.0 | Development platform |
| **TypeScript** | 5.0+ | Type safety |
| **React Navigation** | 6.0+ | Mobile navigation |
| **Expo Camera** | Latest | Camera integration |
| **AsyncStorage** | Latest | Local storage |
| **Axios** | Latest | HTTP client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Django** | 5.1.7 | Web framework |
| **Django REST Framework** | 3.14.0 | API development |
| **PostgreSQL** | 17 | Primary database |
| **Pillow** | 11.2.1 | Image processing |
| **psycopg2** | 2.9.9 | PostgreSQL adapter |
| **python-dotenv** | 1.0.1 | Environment management |

### DevOps & Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Containerization |
| **Docker Compose** | Latest | Multi-container orchestration |
| **ESLint** | 9.0 | Code linting |
| **wait-on** | 8.0.3 | Process synchronization |

## 📁 Project Structure

```
daba-fing-project/
├── 📁 backend/                    # Django REST API
│   ├── 📁 api/                   # API applications
│   ├── 📁 venv/                  # Python virtual environment
│   ├── 📄 manage.py              # Django management script
│   ├── 📄 requirements.txt       # Python dependencies
│   ├── 📄 env.example           # Environment variables template
│   └── 📄 Dockerfile            # Backend container config
│
├── 📁 frontend-web/              # Next.js application
│   ├── 📁 src/
│   │   ├── 📁 app/              # Next.js 13+ app directory
│   │   │   ├── 📁 auth/         # Authentication pages
│   │   │   ├── 📁 dashboard/    # Dashboard pages
│   │   │   ├── 📁 admin/        # Admin pages
│   │   │   └── 📄 layout.tsx    # Root layout
│   │   ├── 📁 components/       # React components
│   │   │   ├── 📁 ui/           # Base UI components
│   │   │   ├── 📁 dashboard/    # Dashboard components
│   │   │   ├── 📁 electron/     # Electron-specific components
│   │   │   └── 📁 protection/   # Route protection
│   │   ├── 📁 contexts/         # React contexts
│   │   ├── 📁 lib/              # Utility libraries
│   │   └── 📁 utils/            # Helper functions
│   ├── 📄 electron-main.ts      # Electron main process
│   ├── 📄 electron-preload.ts   # Electron preload script
│   ├── 📄 next.config.ts        # Next.js configuration
│   ├── 📄 package.json          # Frontend dependencies
│   ├── 📄 env.example           # Environment variables template
│   └── 📄 tsconfig.json         # TypeScript configuration
│
├── 📁 mobile-app/               # React Native application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   ├── 📁 contexts/         # React contexts (Auth)
│   │   ├── 📁 navigation/       # Navigation setup
│   │   ├── 📁 screens/          # App screens
│   │   ├── 📁 services/         # API services
│   │   ├── 📁 types/            # TypeScript types
│   │   └── 📁 utils/            # Utility functions
│   ├── 📁 assets/               # Static assets
│   ├── 📄 App.tsx               # Main app component
│   ├── 📄 package.json          # Mobile dependencies
│   ├── 📄 env.example           # Environment variables template
│   └── 📄 README.md             # Mobile app documentation
│
├── 📁 src/                       # Legacy source (if any)
├── 📄 docker-compose.yml         # Multi-service orchestration
├── 📄 SECURITY.md               # Security guidelines
├── 📄 ELECTRON_BUILD_GUIDE.md   # Electron distribution guide
├── 📄 README.md                  # This file
└── 📄 .gitignore                # Git ignore rules
```

## 🚀 Installation

### Prerequisites
- **Node.js** 18.0+ and npm
- **Python** 3.9+
- **Docker** and Docker Compose
- **PostgreSQL** 17 (or use Docker)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daba-fing-project
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - **Web App**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **Database**: localhost:5433
   - **Mobile App**: See [Mobile App Setup](#mobile-app-setup)

### Manual Installation

#### 🔒 Security Setup (IMPORTANT)
Before starting, set up environment variables to protect sensitive information:

```bash
# Backend environment setup
cp backend/env.example backend/.env
# Edit backend/.env with your actual values

# Frontend environment setup  
cp frontend-web/env.example frontend-web/.env.local
# Edit frontend-web/.env.local with your actual values
```

**⚠️ Security Requirements:**
- Generate a new `SECRET_KEY` for production
- Use strong passwords for database access
- Never commit `.env` files to version control
- Set `DEBUG=False` in production

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables (REQUIRED)
cp env.example .env
# Edit .env with your actual configuration:
# - SECRET_KEY (generate new for production)
# - DB_PASSWORD (strong password)
# - DEBUG=False (for production)

# Generate production secret key
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend-web

# Install dependencies
npm install

# Setup environment variables (REQUIRED)
cp env.example .env.local
# Edit .env.local with your configuration:
# - NEXT_PUBLIC_API_URL (backend API URL)

# Start development server
npm run dev

# For Electron development
npm run electron-dev
```

#### Mobile App Setup
```bash
cd mobile-app

# Install dependencies
npm install

# Setup environment variables (REQUIRED)
cp env.example .env
# Edit .env with your configuration:
# - EXPO_PUBLIC_API_URL (backend API URL)

# Start Expo development server
npm start

# Run on specific platforms
npm run android    # Android device/emulator
npm run ios        # iOS device/simulator
npm run web        # Web browser
```

## 💻 Development

### Available Scripts

#### Frontend Scripts
```bash
# Development
npm run dev                    # Start Next.js dev server
npm run electron-dev          # Start Electron app in development

# Building
npm run build                 # Build for production
npm run build:web            # Build web version
npm run build:electron_static # Build for Electron

# Electron
npm run electron-build-ts    # Compile Electron TypeScript
npm run electron-build       # Build and run Electron app
```

#### Backend Scripts
```bash
# Development
python manage.py runserver   # Start Django dev server
python manage.py shell       # Django shell
python manage.py migrate     # Run database migrations

# Database
python manage.py makemigrations  # Create new migrations
python manage.py dbshell         # Database shell
```

### Environment Variables

⚠️ **Security Notice**: Never commit actual `.env` files to version control. Use the provided example files as templates.

#### Backend (.env)
```env
# Copy from backend/env.example
DEBUG=True
SECRET_KEY=your-super-secret-django-key-here-change-this-in-production
DB_NAME=dabafing
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

#### Frontend (.env.local)
```env
# Copy from frontend-web/env.example
NEXT_PUBLIC_API_URL=http://localhost:8000/api
BUILD_TARGET=web  # or 'electron' for Electron builds
```

#### Production Security
- Generate new `SECRET_KEY`: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`
- Set `DEBUG=False`
- Use HTTPS URLs
- Restrict `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`

## 🌐 Deployment

### Production Deployment

#### Using Docker Compose
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale backend=3
```

#### Manual Deployment

**Backend (Django)**
```bash
# Install production dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

**Frontend (Next.js)**
```bash
# Build for production
npm run build

# Start production server
npm start

# Or export static files
npm run export
```

### Electron App Distribution
```bash
# Build for current platform
npm run electron-pack

# Platform-specific builds
npm run electron-pack:mac     # macOS (DMG + ZIP)
npm run electron-pack:win     # Windows (EXE + NSIS)
npm run electron-pack:linux   # Linux (AppImage + DEB + RPM)

# Development testing
npm run electron-pack:dir     # Unpacked version for testing
```

**Output Files:**
- **macOS**: `DabaFing-0.1.0.dmg`, `DabaFing-0.1.0-arm64.dmg`
- **Windows**: `DabaFing Setup 0.1.0.exe`, `DabaFing 0.1.0.exe`
- **Linux**: `DabaFing-0.1.0.AppImage`, `dabafing_0.1.0_amd64.deb`

For detailed build instructions, see [ELECTRON_BUILD_GUIDE.md](./ELECTRON_BUILD_GUIDE.md)

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/login/          # User login
POST /api/auth/register/       # User registration
POST /api/auth/logout/         # User logout
GET  /api/auth/user/           # Get current user
```

### Fingerprint Endpoints
```
POST /api/fingerprints/        # Upload fingerprint
GET  /api/fingerprints/        # List user fingerprints
GET  /api/fingerprints/{id}/   # Get fingerprint details
PUT  /api/fingerprints/{id}/   # Update fingerprint
DELETE /api/fingerprints/{id}/ # Delete fingerprint
```

### Admin Endpoints
```
GET  /api/admin/users/         # List all users
GET  /api/admin/analytics/     # System analytics
GET  /api/admin/reports/       # Generate reports
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "errors": null
}
```

## 🖥️ Electron App

The DabaFing Electron app provides a focused desktop experience with restricted page access.

### Allowed Pages in Electron
- `/auth/login` - User authentication
- `/auth/register` - User registration
- `/dashboard/*` - All dashboard pages
- `/dashboard/admin/*` - Admin pages (for admin users)

### Restricted Pages in Electron
- `/` - Landing page
- `/about` - About page
- `/contact` - Contact page
- `/pricing` - Pricing page
- `/help` - Help pages
- Marketing and informational pages

### Electron Features
- **Native File Access**: Direct file system integration
- **Offline Mode**: Local fingerprint processing
- **Auto-Updates**: Seamless application updates
- **System Integration**: OS-level notifications and shortcuts

### Building Electron App
```bash
# Development
npm run electron-dev

# Production build
npm run electron-build

# Create installer (requires additional setup)
npm run electron-pack
```

## 🔧 Configuration

### Route Protection
The application uses multiple layers of route protection:

1. **Middleware**: Server-side route filtering
2. **Route Guards**: Client-side protection components
3. **Role-Based Access**: User role verification
4. **Electron Restrictions**: Platform-specific limitations

### Theme Configuration
- **Light/Dark Mode**: Automatic system detection
- **Custom Themes**: Tailwind CSS customization
- **Responsive Design**: Mobile-first approach

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd frontend-web
npm test

# Backend tests
cd backend
python manage.py test

# E2E tests (if configured)
npm run test:e2e
```

### Test Coverage
- Unit tests for components and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

### Important Security Information
This project handles sensitive data and requires proper security configuration:

- **Environment Variables**: All sensitive configuration is stored in `.env` files
- **Never Commit**: `.env` files are excluded from version control
- **Example Files**: Use `env.example` files as templates
- **Production Security**: Generate new secrets and use HTTPS

For detailed security guidelines, see [SECURITY.md](./SECURITY.md)

## 🆘 Support

### Documentation
- [Security Guidelines](SECURITY.md)
- [Electron Configuration](frontend-web/ELECTRON_README.md)
- [Electron Build Guide](ELECTRON_BUILD_GUIDE.md)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment)

### Getting Help
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Email**: [support@dabafing.com](mailto:support@dabafing.com)

### System Requirements
- **Minimum**: 4GB RAM, 2GB storage
- **Recommended**: 8GB RAM, 5GB storage
- **OS Support**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

---

<div align="center">

**Built with ❤️ by the DabaFing Team**

[Website](https://dabafing.com) • [Documentation](docs/) • [Support](mailto:support@dabafing.com)

</div>