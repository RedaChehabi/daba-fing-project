# DabaFing Electron Build Guide

This guide explains how to create distributable packages (DMG, EXE, AppImage, etc.) for the DabaFing Electron application.

## 📋 Prerequisites

- **Node.js** 18.0+ and npm
- **Python** 3.9+ (for native dependencies)
- **Platform-specific tools**:
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Visual Studio Build Tools or Visual Studio Community
  - **Linux**: build-essential package

## 🚀 Quick Start

### Build for Current Platform
```bash
# Build for your current platform (auto-detects)
npm run electron-pack

# Build unpacked version (for testing)
npm run electron-pack:dir
```

### Platform-Specific Builds
```bash
# macOS (DMG + ZIP)
npm run electron-pack:mac

# Windows (NSIS installer + Portable)
npm run electron-pack:win

# Linux (AppImage + DEB + RPM)
npm run electron-pack:linux
```

## 📦 Available Output Formats

### macOS
- **DMG**: `DabaFing-0.1.0.dmg` (Intel x64)
- **DMG**: `DabaFing-0.1.0-arm64.dmg` (Apple Silicon)
- **ZIP**: `DabaFing-0.1.0-mac.zip` (Intel x64)
- **ZIP**: `DabaFing-0.1.0-arm64-mac.zip` (Apple Silicon)

### Windows
- **NSIS Installer**: `DabaFing Setup 0.1.0.exe`
- **Portable**: `DabaFing 0.1.0.exe`
- **Both x64 and ia32 architectures**

### Linux
- **AppImage**: `DabaFing-0.1.0.AppImage`
- **DEB Package**: `dabafing_0.1.0_amd64.deb`
- **RPM Package**: `dabafing-0.1.0.x86_64.rpm`

## 🛠️ Build Process Details

### 1. Static Export Build
```bash
npm run build:electron_static
```
- Creates optimized Next.js static export
- Disables API routes and middleware
- Generates all static pages including dynamic routes

### 2. TypeScript Compilation
```bash
npm run electron-build-ts
```
- Compiles Electron main and preload scripts
- Uses `tsconfig.electron.json` configuration

### 3. Electron Builder Packaging
```bash
electron-builder --mac    # or --win, --linux
```
- Packages the application with Electron
- Creates platform-specific installers
- Handles code signing (if certificates available)

## 📁 Output Directory Structure

```
dist/
├── mac/                           # macOS x64 unpacked
├── mac-arm64/                     # macOS ARM64 unpacked
├── win-unpacked/                  # Windows unpacked
├── linux-unpacked/                # Linux unpacked
├── DabaFing-0.1.0.dmg            # macOS x64 installer
├── DabaFing-0.1.0-arm64.dmg      # macOS ARM64 installer
├── DabaFing-0.1.0-mac.zip        # macOS x64 archive
├── DabaFing-0.1.0-arm64-mac.zip  # macOS ARM64 archive
├── DabaFing Setup 0.1.0.exe      # Windows installer
├── DabaFing 0.1.0.exe            # Windows portable
├── DabaFing-0.1.0.AppImage       # Linux AppImage
├── dabafing_0.1.0_amd64.deb      # Debian package
└── dabafing-0.1.0.x86_64.rpm     # Red Hat package
```

## 🔧 Configuration

### Package.json Build Configuration
```json
{
  "build": {
    "appId": "com.dabafing.app",
    "productName": "DabaFing",
    "directories": {
      "output": "dist"
    },
    "files": [
      "out/**/*",
      "electron-dist/**/*",
      "node_modules/**/*"
    ]
  }
}
```

### Platform-Specific Settings

#### macOS
- **Category**: Productivity
- **Targets**: DMG, ZIP
- **Architectures**: x64, arm64
- **Code Signing**: Optional (requires Developer ID)

#### Windows
- **Targets**: NSIS installer, Portable
- **Architectures**: x64, ia32
- **Features**: Desktop shortcuts, Start menu shortcuts

#### Linux
- **Targets**: AppImage, DEB, RPM
- **Architecture**: x64
- **Category**: Office

## 🎨 Icons and Assets

### Icon Requirements
Place icons in the `assets/` directory:

- **macOS**: `icon.icns` (512x512)
- **Windows**: `icon.ico` (256x256)
- **Linux**: `icon.png` (512x512)

### Icon Generation Tools
- [Convertio](https://convertio.co/png-ico/) - PNG to ICO
- [Convertio](https://convertio.co/png-icns/) - PNG to ICNS
- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)

## 🔐 Code Signing

### macOS Code Signing
```bash
# Install Developer ID certificate
# Then build with signing
npm run electron-pack:mac
```

### Windows Code Signing
```bash
# Install code signing certificate
# Configure in package.json:
"win": {
  "certificateFile": "path/to/certificate.p12",
  "certificatePassword": "password"
}
```

## 🚀 Distribution

### File Sizes (Approximate)
- **macOS DMG**: ~190MB
- **Windows EXE**: ~150MB
- **Linux AppImage**: ~160MB

### Upload Platforms
- **GitHub Releases**: Automatic with CI/CD
- **Website**: Direct download links
- **App Stores**: Platform-specific stores

## 🔍 Testing Builds

### Test Unpacked Version
```bash
npm run electron-pack:dir
# Test the app in dist/mac-arm64/DabaFing.app
```

### Test Installer
1. Install the DMG/EXE/DEB package
2. Launch the application
3. Verify all features work correctly
4. Test auto-updater (if implemented)

## 🐛 Troubleshooting

### Common Issues

#### Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ./node_modules
```

#### Missing Dependencies
```bash
# Install sharp for image processing
npm install sharp

# Rebuild native dependencies
npm rebuild
```

#### Code Signing Issues
- Ensure valid certificates are installed
- Check certificate validity and permissions
- Use `--publish=never` to skip signing during development

#### Build Failures
```bash
# Clean build cache
rm -rf dist/
rm -rf .next/
rm -rf out/

# Rebuild everything
npm run electron-pack:dir
```

## 📊 Build Performance

### Optimization Tips
1. **Exclude unnecessary files** in `package.json` build config
2. **Use electron-builder cache** for faster rebuilds
3. **Parallel builds** for multiple architectures
4. **CI/CD automation** for consistent builds

### Build Times (Approximate)
- **First build**: 5-10 minutes
- **Incremental builds**: 2-5 minutes
- **CI/CD builds**: 10-15 minutes

## 🔄 Automated Builds

### GitHub Actions Example
```yaml
name: Build Electron App
on: [push, pull_request]
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run electron-pack
```

## 📝 Version Management

### Updating Version
```bash
# Update version in package.json
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0

# Rebuild with new version
npm run electron-pack
```

### Release Notes
- Update `CHANGELOG.md`
- Tag releases in Git
- Upload to GitHub Releases
- Update download links

---

## 🎉 Success!

After running the build commands, you'll have distributable packages ready for:

- **macOS users**: DMG files for easy installation
- **Windows users**: EXE installers and portable versions
- **Linux users**: AppImage, DEB, and RPM packages

The DabaFing Electron app is now ready for distribution! 🚀 