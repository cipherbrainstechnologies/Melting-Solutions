# Setup Guide & Getting Started

## Prerequisites

### System Requirements
- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher (or Yarn)
- **Expo CLI**: Latest version
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **Git**: For version control

### Development Environment
- **Code Editor**: VS Code (recommended)
- **React Native Tools**: VS Code extensions
- **Firebase Account**: For backend services
- **Google Cloud Console**: For Maps API

## Installation Steps

### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd melting-solution

# Install dependencies
yarn install
# or
npm install

# Install Expo CLI globally (if not already installed)
npm install -g @expo/cli
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "melting-solution"
3. Enable Authentication, Firestore, and Storage
4. Download configuration files

#### Configure Firebase
1. **Android Configuration**:
   - Download `google-services.json`
   - Place it in the root directory
   - Update `android/app/google-services.json` if needed

2. **iOS Configuration** (if developing for iOS):
   - Download `GoogleService-Info.plist`
   - Add to iOS project

3. **Web Configuration**:
   - Copy Firebase config to `src/common/FirebaseConfig.js`

#### Enable Firebase Services
```javascript
// In Firebase Console, enable:
- Authentication (Phone provider)
- Firestore Database
- Cloud Storage
- Cloud Functions (if using)
```

### 3. Google Maps Setup

#### Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Maps SDK for Android/iOS
4. Create API key with restrictions

#### Configure API Key
```javascript
// In app.json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

### 4. Environment Configuration

#### Create Environment Files
```bash
# Create .env file in root directory
touch .env
```

```env
# .env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### 5. Development Setup

#### Start Development Server
```bash
# Start Expo development server
expo start

# Or with specific options
expo start --dev-client
expo start --tunnel
expo start --lan
```

#### Run on Devices
```bash
# Android
expo run:android

# iOS (macOS only)
expo run:ios

# Web
expo start --web
```

## Configuration Files

### 1. Expo Configuration (app.json)
```json
{
  "expo": {
    "name": "Melting Solution",
    "slug": "melting-solution",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.meltingsolution",
      "versionCode": 1,
      "googleServicesFile": "./google-services.json",
      "useNextNotificationsApi": true,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA_ROLL",
        "FOREGROUND_SERVICE"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 2. Babel Configuration (babel.config.js)
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-reanimated/plugin'],
      ['@babel/plugin-transform-flow-strip-types'],
      [
        "@babel/plugin-proposal-decorators",
        { "legacy": true }
      ],
      [
        "@babel/plugin-proposal-class-properties",
        { "loose": false }
      ]
    ],
  };
};
```

### 3. Metro Configuration (metro.config.js)
```javascript
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
```

## Firebase Security Rules

### 1. Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /Users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /Products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/Users/$(request.auth.uid)).data.usertype == 'admin';
    }
    
    // Cart collection
    match /Cart/{cartId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Quotes collection
    match /Quotes/{quoteId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.adminId == request.auth.uid);
    }
    
    // Orders collection
    match /Orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.adminId == request.auth.uid);
    }
    
    // Chats collection
    match /Chats/{chatId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.adminId == request.auth.uid);
    }
  }
}
```

### 2. Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images
    match /products/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/Users/$(request.auth.uid)).data.usertype == 'admin';
    }
    
    // User profile images
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Development Workflow

### 1. Daily Development
```bash
# Start development server
expo start

# Run on Android device/emulator
expo run:android

# Run on iOS device/simulator
expo run:ios

# Run on web
expo start --web
```

### 2. Code Quality
```bash
# Lint code (if ESLint is configured)
npm run lint

# Format code (if Prettier is configured)
npm run format

# Type check (if TypeScript is used)
npm run type-check
```

### 3. Testing
```bash
# Run tests (if test framework is configured)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Build and Deployment

### 1. Development Build
```bash
# Create development build
expo build:android --type apk
expo build:ios --type simulator

# Or with EAS Build
eas build --platform android --profile development
eas build --platform ios --profile development
```

### 2. Production Build
```bash
# Create production build
expo build:android --type app-bundle
expo build:ios --type archive

# Or with EAS Build
eas build --platform android --profile production
eas build --platform ios --profile production
```

### 3. App Store Deployment
```bash
# Submit to Google Play Store
expo upload:android

# Submit to Apple App Store
expo upload:ios

# Or with EAS Submit
eas submit --platform android
eas submit --platform ios
```

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues
```bash
# Clear Metro cache
expo start --clear

# Reset Metro cache
npx react-native start --reset-cache
```

#### 2. Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Rebuild
expo run:android
```

#### 3. iOS Build Issues
```bash
# Clean iOS build
cd ios
xcodebuild clean
cd ..

# Rebuild
expo run:ios
```

#### 4. Firebase Issues
- Check Firebase configuration files
- Verify API keys and project settings
- Check Firebase security rules
- Ensure proper authentication setup

#### 5. Google Maps Issues
- Verify API key configuration
- Check API key restrictions
- Ensure Maps SDK is enabled
- Verify billing is enabled

### Debug Tools

#### 1. React Native Debugger
- Install React Native Debugger
- Connect to Metro bundler
- Debug Redux state and actions

#### 2. Flipper
- Install Flipper
- Connect to device/emulator
- Debug network requests and state

#### 3. Expo Dev Tools
- Access via browser at http://localhost:19002
- View logs and errors
- Test on different devices

## Project Structure Overview

```
melting-solution/
├── src/                    # Source code
│   ├── screens/           # Application screens
│   ├── components/        # Reusable components
│   ├── navigation/        # Navigation configuration
│   └── common/           # Shared utilities
├── redux/                 # State management
│   ├── actions/          # Redux actions
│   ├── reducers/         # Redux reducers
│   └── store/            # Store configuration
├── assets/               # Images, fonts, icons
├── android/              # Android-specific code
├── memory-bank/          # Project documentation
├── App.js               # Main app component
├── package.json         # Dependencies
└── app.json            # Expo configuration
```

## Next Steps

1. **Complete Setup**: Follow all installation steps
2. **Test Basic Functionality**: Run the app and test core features
3. **Configure Firebase**: Set up authentication and database
4. **Test on Devices**: Run on physical devices
5. **Customize Configuration**: Update settings for your environment
6. **Start Development**: Begin implementing new features

## Support and Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/
- **Firebase Documentation**: https://firebase.google.com/docs
- **Native Base Documentation**: https://docs.nativebase.io/
- **React Navigation Documentation**: https://reactnavigation.org/