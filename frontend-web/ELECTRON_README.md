# DabaFing Electron App Configuration

This document explains how the DabaFing application is configured to work differently in Electron vs Web environments.

## Overview

The DabaFing application has two deployment targets:
- **Web App**: Full application with all pages (home, about, contact, pricing, etc.)
- **Electron App**: Restricted to only authentication and dashboard pages

## Electron App Restrictions

### Allowed Pages in Electron
The electron app only allows access to:
- `/auth` - Authentication pages
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - Main dashboard
- `/dashboard/admin` - Admin dashboard
- `/dashboard/verify` - Verification page
- `/dashboard/settings` - Settings page
- `/dashboard/upload` - Upload page
- `/dashboard/profile` - User profile
- `/dashboard/history` - History page
- `/dashboard/scan` - Scan page

### Restricted Pages in Electron
The following pages are NOT available in the electron app:
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/help` - Help page
- `/pricing` - Pricing page
- `/features` - Features page
- `/blog` - Blog pages
- `/documentation` - Documentation pages
- `/download` - Download page
- `/privacy_policy` - Privacy policy
- `/terms_of_service` - Terms of service
- `/cookies` - Cookie policy

## How It Works

### 1. Route Protection
- **ElectronRouteGuard**: Component that redirects users to `/auth/login` if they try to access restricted routes
- **Middleware**: Server-side middleware that detects electron user agent and redirects unauthorized routes
- **Electron Config**: Centralized configuration defining allowed routes

### 2. Navigation
- **Web App**: Shows full site header with all navigation links
- **Electron App**: Shows simplified ElectronNavigation component with only auth/dashboard links

### 3. Build Configuration
- **Web Build**: `npm run build:web` - Standard Next.js build with all features
- **Electron Build**: `npm run build:electron_static` - Static export optimized for electron

## Development Commands

### Web Development
```bash
npm run dev
# Starts web development server at http://localhost:3000
```

### Electron Development
```bash
npm run electron-dev
# Starts Next.js dev server and launches electron app
```

### Production Builds

#### Web Build
```bash
npm run build:web
npm start
```

#### Electron Build
```bash
npm run electron-build
# Builds static export and launches electron app
```

## File Structure

```
src/
├── components/
│   ├── electron/
│   │   └── ElectronNavigation.tsx    # Electron-specific navigation
│   └── protection/
│       ├── ElectronRouteGuard.tsx    # Route protection for electron
│       ├── ElectronOnly.tsx          # Render only in electron
│       └── WebOnly.tsx               # Render only in web
├── lib/
│   ├── electron-config.ts            # Electron route configuration
│   └── is-electron.ts                # Electron detection utility
└── middleware.ts                     # Server-side route protection
```

## Configuration Files

### `electron-config.ts`
Defines which routes are allowed in the electron app and provides utility functions for route checking.

### `next.config.ts`
Handles different build configurations for web vs electron builds using the `BUILD_TARGET` environment variable.

### `middleware.ts`
Provides server-side route protection by detecting electron user agents and redirecting unauthorized routes.

## Environment Variables

- `BUILD_TARGET=electron` - Enables electron-specific build configuration
- `NODE_ENV=production` - Production mode for electron builds

## User Experience

### Web App Users
- Can access all pages and features
- Full navigation with marketing pages
- Standard web application experience

### Electron App Users
- Focused desktop application experience
- Only authentication and core dashboard functionality
- Simplified navigation
- Automatic redirection from restricted pages to login

This configuration ensures that the electron app provides a focused, desktop-optimized experience while the web app maintains full functionality for marketing and general use. 