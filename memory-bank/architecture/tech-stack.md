# Technology Stack & Architecture

## Frontend Framework
- **React Native**: 0.64.3 (Core mobile framework)
- **Expo SDK**: ~44.0.0 (Development platform and tooling)
- **React**: 17.0.1 (UI library)
- **JavaScript**: ES6+ with Babel transpilation

## State Management
- **Redux**: 4.1.2 (Predictable state container)
- **React Redux**: 7.2.8 (React bindings for Redux)
- **Redux Thunk**: 2.4.1 (Async action middleware)
- **Custom Firebase Context**: Centralized Firebase API management

## Backend & Database
- **Firebase Authentication**: Phone-based OTP authentication
- **Cloud Firestore**: NoSQL document database
- **Firebase Storage**: Image and file storage
- **Firebase Cloud Functions**: Server-side logic (referenced in auth)

## UI & Styling
- **Native Base**: 3.4.1 (Cross-platform UI component library)
- **Custom Theme System**: Centralized color and styling constants
- **Sofia Pro Font Family**: Custom typography (5 weights)
- **React Native Vector Icons**: Icon library (Entypo, Ionicons)

## Navigation
- **React Navigation**: 4.4.4 (Navigation library)
  - Stack Navigator: Screen transitions
  - Tab Navigator: Bottom tab navigation
  - Drawer Navigator: Admin side menu
  - Switch Navigator: Authentication flow

## Maps & Location
- **React Native Maps**: 0.31.1 (Google Maps integration)
- **Expo Location**: ~14.0.1 (Location services)
- **Google Maps API**: Integrated for location features

## Notifications & Communication
- **Expo Notifications**: 0.14.0 (Push notifications)
- **Real-time Chat**: Firestore-based chat system
- **Push Token Management**: Device-specific notification tokens

## Image & Media Handling
- **Expo Image Picker**: ~12.0.1 (Image selection and capture)
- **React Native Image Zoom Viewer**: 3.0.1 (Image viewing)
- **Expo File System**: ~13.1.4 (File operations)

## Development Tools
- **Babel**: 7.12.9 (JavaScript transpiler)
- **Metro**: Default React Native bundler
- **Expo CLI**: Development and build tools
- **Android Studio**: Android development environment

## Key Libraries & Utilities
- **Moment.js**: 2.29.3 (Date manipulation)
- **XLSX**: 0.18.5 (Excel file handling for reports)
- **React Native Reanimated**: 2.2.0 (Advanced animations)
- **React Native Gesture Handler**: ~2.1.0 (Touch gestures)
- **React Native Safe Area Context**: 3.3.2 (Safe area handling)

## Platform Support
- **Android**: Primary platform (com.meltingsolution package); Expo Go + emulator supported
- **iOS**: Supported with tablet compatibility
- **Web**: Expo web export (`web-build/`) + Express server; Railway-ready (`Dockerfile`, `railway.toml`)

## Deployment
- **Web / Railway**: See `RAILWAY.md` — `npm run build:web` + `node server.js`
- **Expo Build Service**: Cloud-based builds
- **Google Play Store**: Android app distribution
- **App Store**: iOS app distribution (if needed)

## Code Quality & Standards
- **ESLint**: Code linting (configured via Babel)
- **Prettier**: Code formatting (if configured)
- **TypeScript**: Not currently used (JavaScript only)
- **Testing**: No test framework currently configured

## API Integration
- **Firebase REST API**: Direct Firestore queries
- **Google Maps API**: Location and mapping services
- **Custom Cloud Functions**: Server-side business logic
- **Push Notification Services**: Expo push notification service