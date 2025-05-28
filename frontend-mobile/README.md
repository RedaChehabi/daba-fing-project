# DabaFing Mobile App

The DabaFing mobile application provides fingerprint analysis capabilities on iOS and Android devices with camera integration for real-time fingerprint capture.

## Features

### 📱 Core Functionality
- **Camera Integration**: Real-time fingerprint capture using device camera
- **Offline Analysis**: Local fingerprint processing capabilities
- **Cross-Platform**: iOS and Android support via Expo
- **Push Notifications**: Real-time analysis updates
- **Biometric Auth**: Device-level security integration

### 🔧 Technical Features
- **React Native**: Cross-platform mobile development
- **Expo**: Streamlined development and deployment
- **TypeScript**: Type-safe development
- **AsyncStorage**: Local data persistence
- **Axios**: HTTP client for API communication

## Getting Started

### Prerequisites
- Node.js 18.0+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RedaChehabi/daba-fing-project.git
   cd daba-fing-project/mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Development Commands

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web (for testing)
npm run web

# Build for production
npm run build

# Eject from Expo (if needed)
npm run eject
```

## App Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components
│   │   ├── forms/          # Form components
│   │   └── ui/             # UI library components
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx # Authentication context
│   │   └── HelpContext.tsx # Help and tutorial context
│   ├── navigation/         # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── AuthNavigator.tsx
│   ├── screens/            # App screens
│   │   ├── auth/          # Authentication screens
│   │   ├── dashboard/     # Dashboard screens
│   │   ├── upload/        # Upload screens
│   │   └── settings/      # Settings screens
│   ├── services/          # API services
│   │   ├── api.ts         # API client
│   │   └── auth.ts        # Authentication service
│   ├── types/             # TypeScript types
│   │   ├── api.ts         # API types
│   │   └── navigation.ts  # Navigation types
│   └── utils/             # Utility functions
│       ├── camera.ts      # Camera utilities
│       ├── storage.ts     # Storage utilities
│       └── validation.ts  # Form validation
├── assets/                # Static assets
│   ├── images/           # Image assets
│   ├── icons/            # Icon assets
│   └── fonts/            # Font assets
├── App.tsx               # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Key Components

### Camera Integration

The app uses Expo Camera for fingerprint capture:

```typescript
import { Camera } from 'expo-camera';

// Camera component for fingerprint capture
const FingerprintCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Camera implementation
};
```

### Offline Storage

Local data persistence using AsyncStorage:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store fingerprint data locally
const storeFingerprint = async (data) => {
  try {
    await AsyncStorage.setItem('fingerprint_data', JSON.stringify(data));
  } catch (error) {
    console.error('Storage error:', error);
  }
};
```

### Push Notifications

Real-time updates using Expo Notifications:

```typescript
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
```

## User Interface

### Design System
- **Material Design**: Android-native feel
- **iOS Human Interface**: iOS-native feel
- **Consistent Branding**: DabaFing brand colors and typography
- **Accessibility**: Full accessibility support
- **Dark Mode**: System-aware dark mode support

### Key Screens

1. **Authentication**
   - Login screen
   - Registration screen
   - Password reset

2. **Dashboard**
   - Upload history
   - Quick stats
   - Recent analyses

3. **Camera Capture**
   - Real-time camera view
   - Capture controls
   - Image preview

4. **Upload & Analysis**
   - Image selection
   - Metadata input
   - Analysis results

5. **Settings**
   - Profile management
   - Notification preferences
   - Security settings

## API Integration

The mobile app communicates with the Django backend:

```typescript
// API service configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Security Features

### Data Protection
- **Biometric Authentication**: Face ID, Touch ID, Fingerprint
- **Secure Storage**: Encrypted local storage
- **Certificate Pinning**: SSL certificate validation
- **Data Encryption**: End-to-end encryption

### Privacy
- **Permission Management**: Granular permission requests
- **Data Minimization**: Only collect necessary data
- **Local Processing**: Offline analysis capabilities
- **Secure Deletion**: Proper data cleanup

## Testing

### Unit Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

### E2E Testing
```bash
# Run end-to-end tests
npm run test:e2e
```

### Device Testing
- **iOS**: Test on various iPhone models
- **Android**: Test on different Android versions
- **Performance**: Memory and battery usage testing

## Deployment

### App Store (iOS)
1. Build production version
2. Upload to App Store Connect
3. Submit for review
4. Release to users

### Google Play (Android)
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Submit for review
4. Release to users

### Over-the-Air Updates
Using Expo Updates for seamless app updates:

```bash
# Publish update
expo publish

# Create release channel
expo publish --release-channel production
```

## Troubleshooting

### Common Issues

**Camera not working**
- Check camera permissions
- Verify device compatibility
- Test on physical device

**API connection issues**
- Verify network connectivity
- Check API endpoint configuration
- Review authentication tokens

**Build failures**
- Clear Expo cache: `expo r -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo CLI version

### Performance Optimization

1. **Image Optimization**
   - Compress images before upload
   - Use appropriate image formats
   - Implement lazy loading

2. **Memory Management**
   - Dispose of camera resources
   - Clear unused data
   - Monitor memory usage

3. **Battery Optimization**
   - Minimize background processing
   - Optimize camera usage
   - Reduce network requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow React Native best practices
- Use ESLint and Prettier
- Write comprehensive tests

## Support

For mobile app specific issues:
- **Email**: mobile-support@dabafing.com
- **Documentation**: See main project README
- **Issues**: GitHub Issues
- **Community**: Discord/Slack channel

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Last updated: [Current Date]*
*Version: 1.0* 