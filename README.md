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

### 🔐 Authentication & Authorization
- **Multi-Role System**: Admin, Expert, User roles
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Role-based page access
- **Expert Applications**: Application workflow for expert status

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Django)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Web App       │    │ • REST API      │    │ • User Data     │
│ • Electron App  │    │ • Auth System   │    │ • Fingerprints  │
│ • Admin Panel   │    │ • File Upload   │    │ • Analytics     │
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
│   └── 📄 tsconfig.json         # TypeScript configuration
│
├── 📁 src/                       # Legacy source (if any)
├── 📄 docker-compose.yml         # Multi-service orchestration
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

### Manual Installation

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

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

# Start development server
npm run dev

# For Electron development
npm run electron-dev
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

#### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5433/dabafing
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BUILD_TARGET=web  # or 'electron' for Electron builds
```

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
# Build Electron app
npm run electron-build

# Package for distribution (requires electron-builder)
npm run electron-pack
```

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

## 🆘 Support

### Documentation
- [Electron Configuration](frontend-web/ELECTRON_README.md)
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