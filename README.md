# DabaFing - Advanced Fingerprint Analysis System

A comprehensive fingerprint analysis system with multiple deployment targets: web application, desktop application, mobile app, and backend API.

## Project Structure

This project is organized into separate directories for different components:

```
daba-fing-project/
├── backend/                    # Django REST API backend
├── frontend-desktop/           # Electron desktop application
├── frontend-web-backup/        # Web application (backup)
├── frontend-mobile/            # React Native mobile app
├── .github/                    # GitHub workflows and templates
├── docker-compose.yml          # Docker configuration
├── QUICK_START_GUIDE.md        # Quick setup instructions
├── USER_GUIDE.md              # User documentation
├── FINAL_PROJECT_REPORT.md     # Project report
└── README.md                   # This file
```

## Components

### 🖥️ Desktop Application (`frontend-desktop/`)
- **Technology**: Next.js + Electron
- **Purpose**: Native desktop app for Windows, macOS, and Linux
- **Features**: Full offline functionality, native OS integration
- **Target Users**: Professional forensic analysts

### 📱 Mobile Application (`frontend-mobile/`)
- **Technology**: React Native + Expo
- **Purpose**: Mobile fingerprint capture and analysis
- **Features**: Camera integration, offline analysis, push notifications
- **Target Users**: Field investigators, mobile users

### 🌐 Web Application (`frontend-web-backup/`)
- **Technology**: Next.js
- **Purpose**: Browser-based access to the system
- **Features**: Cross-platform web access, responsive design
- **Target Users**: General users, remote access

### 🔧 Backend API (`backend/`)
- **Technology**: Django REST Framework
- **Purpose**: Central API for all client applications
- **Features**: User authentication, fingerprint processing, data storage
- **Database**: SQLite (development), PostgreSQL (production)

## Features

### 🔍 Core Functionality
- **Fingerprint Classification**: Advanced pattern recognition algorithms
- **Ridge Counting**: Automated ridge counting and analysis
- **Quality Assessment**: Image quality evaluation and enhancement
- **Batch Processing**: Multiple fingerprint analysis
- **Export Capabilities**: PDF reports, CSV data export

### 🔐 Security & Authentication
- **User Management**: Role-based access control
- **Secure Authentication**: JWT-based authentication
- **Data Encryption**: Secure data transmission and storage
- **Audit Logging**: Complete activity tracking

### 📊 Analytics & Reporting
- **Dashboard**: Comprehensive analytics and insights
- **Historical Data**: Analysis history and trends
- **Performance Metrics**: System performance monitoring
- **Custom Reports**: Configurable report generation

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Desktop App Setup
```bash
cd frontend-desktop
npm install
npm run dev
```

### Mobile App Setup
```bash
cd frontend-mobile
npm install
npm start
```

## Documentation

- **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get up and running quickly
- **[User Guide](USER_GUIDE.md)** - Comprehensive user documentation
- **[Final Project Report](FINAL_PROJECT_REPORT.md)** - Technical details and architecture
- **[Contributing Guide](CONTRIBUTING.md)** - Development guidelines

## Development

Each component has its own development environment and dependencies. See the individual README files in each directory for specific setup instructions.

## License

This project is private and proprietary to the DabaFing team.

## Support

For support and questions, please refer to the documentation or contact the development team.