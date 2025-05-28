# DabaFing Desktop Application

The DabaFing desktop application is an Electron-based native desktop app that provides advanced fingerprint analysis capabilities for Windows, macOS, and Linux.

## Features

### 🖥️ Desktop-Specific Features
- **Native OS Integration**: Full desktop application experience
- **Offline Functionality**: Complete analysis capabilities without internet
- **File System Access**: Direct access to local files and folders
- **System Notifications**: Native desktop notifications
- **Multi-Window Support**: Multiple analysis windows
- **Keyboard Shortcuts**: Full keyboard navigation support

### 🔍 Analysis Capabilities
- **Fingerprint Classification**: Advanced pattern recognition
- **Ridge Counting**: Automated ridge counting algorithms
- **Quality Assessment**: Image quality evaluation
- **Batch Processing**: Multiple fingerprint analysis
- **Export Options**: PDF reports, CSV data, image exports

### 🎨 User Interface
- **Modern UI**: Built with Next.js and Radix UI components
- **Dark/Light Themes**: System-aware theme switching
- **Responsive Design**: Adapts to different window sizes
- **Accessibility**: Full keyboard and screen reader support

## Tech Stack

- **Framework**: Next.js 15.2.4 + Electron
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to the desktop app directory**
   ```bash
   cd frontend-desktop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development mode**
   ```bash
   npm run electron-dev
   ```

### Available Scripts

#### Development
- `npm run dev` - Start Next.js development server only
- `npm run electron-dev` - Start full Electron development environment

#### Building
- `npm run build:web` - Build web version
- `npm run build:electron_static` - Build static version for Electron
- `npm run electron-build` - Build and run Electron app
- `npm run electron-pack` - Package Electron app for distribution

#### Platform-Specific Builds
- `npm run electron-pack:win` - Build for Windows
- `npm run electron-pack:mac` - Build for macOS
- `npm run electron-pack:linux` - Build for Linux

## Project Structure

```
frontend-desktop/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── ...                # Other pages
│   ├── components/
│   │   ├── electron/          # Electron-specific components
│   │   ├── protection/        # Route protection
│   │   ├── ui/               # UI components
│   │   └── ...               # Other components
│   ├── lib/
│   │   ├── electron-config.ts # Electron configuration
│   │   └── is-electron.ts     # Electron detection
│   └── ...                   # Other source files
├── electron-main.ts           # Electron main process
├── electron-preload.ts        # Electron preload script
├── tsconfig.electron.json     # TypeScript config for Electron
└── package.json              # Dependencies and scripts
```

## Electron Configuration

### Route Protection
The desktop app restricts access to certain routes for a focused experience:

**Allowed Routes:**
- `/auth/*` - Authentication pages
- `/dashboard/*` - All dashboard functionality

**Restricted Routes:**
- `/` - Home/landing page
- `/about`, `/contact`, `/pricing` - Marketing pages
- `/blog`, `/documentation` - Content pages

### Build Targets
The app supports two build targets:
- **Web Build**: Standard Next.js build for browser deployment
- **Electron Build**: Static export optimized for Electron packaging

## Development

### Electron Development Mode
```bash
npm run electron-dev
```
This command:
1. Starts the Next.js development server
2. Waits for the server to be ready
3. Compiles Electron TypeScript files
4. Launches the Electron app

### Production Build
```bash
npm run electron-pack
```
This creates a distributable Electron app for your current platform.

## Distribution

The app can be packaged for multiple platforms:

- **Windows**: NSIS installer and portable executable
- **macOS**: DMG and ZIP archives (supports both Intel and Apple Silicon)
- **Linux**: AppImage, DEB, and RPM packages

## API Integration

The desktop app connects to the Django backend API running on `http://localhost:8000`. All API calls are proxied through Next.js rewrites for seamless integration.

## Security

The Electron app implements security best practices:
- Context isolation enabled
- Node.js integration disabled in renderer
- Secure preload scripts
- Content Security Policy (CSP)

## Documentation

- **[Electron Build Guide](ELECTRON_BUILD_GUIDE.md)** - Detailed build instructions
- **[Electron README](ELECTRON_README.md)** - Electron-specific configuration details

## License

This project is private and proprietary to the DabaFing team.
