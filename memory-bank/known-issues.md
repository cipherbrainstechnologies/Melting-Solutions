# Known Issues & Troubleshooting

## Recent Changes

### 1. Authentication Migration ✅ COMPLETED
- **Change**: Migrated from phone-based OTP authentication to email/password authentication
- **Date**: Current implementation
- **Impact**: 
  - Users can now register and login with email/password
  - Removed dependency on phone numbers
  - Simplified authentication flow
  - Added password reset functionality
- **Files Modified**:
  - `redux/store/type.js` - Updated action types
  - `redux/reducers/authreducer.js` - Updated reducer logic
  - `redux/actions/authactions.js` - Replaced phone auth with email/password
  - `redux/index.js` - Updated Firebase context API
  - `src/screens/Login.js` - Updated login form
  - `src/screens/Register.js` - Updated registration form
  - `src/screens/ForgotPassword.js` - New password reset screen
  - `src/navigation/MainNavigator.js` - Removed verification screen, added forgot password

## Current Issues

### Production audit (2026-09-06)
- Full register: see `SYSTEM_AUDIT.md` and `FIXES_SUMMARY.md` at repo root.
- Fixed: stale phone-auth imports, Platform crash on push token, register→AuthLoading, false password-reset success, empty cart hang, admin Reports/Broadcast entry points, reports date filter, null push tokens, selectSavedAddress deleting addresses.
- Open: live Firebase E2E, payment gateway vs manual verification, admin Auth user creation (needs Cloud Function), Maps key rotation.

### 1. Authentication Issues

#### Email Validation
- **Issue**: Email validation may not cover all edge cases
- **Location**: `src/screens/Login.js`, `src/screens/Register.js`, `redux/actions/Validation.js`
- **Status**: Basic validation implemented
- **Workaround**: Uses standard email regex validation

#### Password Reset
- **Issue**: Password reset flow needs thorough testing against live Firebase
- **Location**: `src/screens/ForgotPassword.js`, `redux/actions/authactions.js`
- **Status**: False-success UI fixed; live E2E still pending
- **Workaround**: Manual admin intervention if needed

### 2. Firebase Integration Issues

#### Real-time Listeners
- **Issue**: Real-time listeners may not cleanup properly
- **Location**: Multiple action files
- **Status**: Partially fixed
- **Workaround**: Ensure proper cleanup in useEffect return functions

#### Image Upload
- **Issue**: Image upload may fail for large files
- **Location**: `redux/actions/Validation.js`
- **Status**: Needs optimization
- **Workaround**: Compress images before upload

### 3. Navigation Issues

#### Deep Linking
- **Issue**: Deep linking not properly configured
- **Location**: `src/navigation/`
- **Status**: Not implemented
- **Workaround**: Use standard navigation methods

#### Back Button Handling
- **Issue**: Android back button may not work as expected
- **Location**: Navigation configuration
- **Status**: Needs review
- **Workaround**: Use hardware back button listener

### 4. Performance Issues

#### Image Loading
- **Issue**: Images may load slowly on slow connections
- **Location**: All image components
- **Status**: Needs optimization
- **Workaround**: Implement lazy loading and caching

#### List Performance
- **Issue**: Large lists may cause performance issues
- **Location**: FlatList components
- **Status**: Needs optimization
- **Workaround**: Implement pagination and virtualization

### 5. UI/UX Issues

#### Keyboard Handling
- **Issue**: Keyboard may cover input fields
- **Location**: Form screens
- **Status**: Needs improvement
- **Workaround**: Use KeyboardAvoidingView

#### Status Bar
- **Issue**: Status bar color may not match screen
- **Location**: Multiple screens
- **Status**: Inconsistent
- **Workaround**: Set status bar color per screen

## Common Problems and Solutions

### 1. Build Issues

#### Android Build Fails
```bash
# Problem: Android build fails with Gradle errors
# Solution:
cd android
./gradlew clean
cd ..
expo run:android
```

#### iOS Build Fails
```bash
# Problem: iOS build fails with Xcode errors
# Solution:
cd ios
xcodebuild clean
cd ..
expo run:ios
```

#### Metro Bundler Issues
```bash
# Problem: Metro bundler cache issues
# Solution:
expo start --clear
# or
npx react-native start --reset-cache
```

### 2. Firebase Issues

#### Authentication Not Working
```javascript
// Problem: Firebase auth not working
// Check Firebase configuration
// Ensure google-services.json is in correct location
// Verify Firebase project settings
```

#### Firestore Permission Denied
```javascript
// Problem: Firestore permission denied
// Check Firebase security rules
// Ensure user is authenticated
// Verify user permissions
```

#### Storage Upload Fails
```javascript
// Problem: Firebase storage upload fails
// Check storage security rules
// Verify file size limits
// Ensure proper file format
```

### 3. Navigation Issues

#### Screen Not Navigating
```javascript
// Problem: Navigation not working
// Check navigation configuration
// Ensure screen is registered
// Verify navigation props
```

#### Tab Navigation Issues
```javascript
// Problem: Tab navigation not working
// Check tab navigator configuration
// Ensure proper screen names
// Verify tab bar options
```

### 4. State Management Issues

#### Redux State Not Updating
```javascript
// Problem: Redux state not updating
// Check action types
// Verify reducer logic
// Ensure proper dispatch
```

#### Firebase Context Issues
```javascript
// Problem: Firebase context not available
// Check Firebase provider setup
// Ensure proper context usage
// Verify Firebase configuration
```

## Performance Issues

### 1. Memory Leaks

#### Real-time Listeners
```javascript
// Problem: Memory leaks from listeners
// Solution: Proper cleanup
useEffect(() => {
  const unsubscribe = dispatch(api.fetchData());
  return () => unsubscribe && unsubscribe();
}, []);
```

#### Image Memory
```javascript
// Problem: Images causing memory issues
// Solution: Optimize image loading
const ImageComponent = ({ source, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <Image
      source={source}
      onLoad={() => setLoaded(true)}
      style={[props.style, { opacity: loaded ? 1 : 0 }]}
      {...props}
    />
  );
};
```

### 2. Slow Rendering

#### Large Lists
```javascript
// Problem: Slow rendering of large lists
// Solution: Implement pagination
const [page, setPage] = useState(0);
const [data, setData] = useState([]);

const loadMore = () => {
  setPage(prev => prev + 1);
  // Load more data
};
```

#### Heavy Components
```javascript
// Problem: Heavy components causing slow rendering
// Solution: Use React.memo
const HeavyComponent = React.memo(({ data }) => {
  // Component logic
});
```

## Security Issues

### 1. Data Validation

#### Input Validation
```javascript
// Problem: Insufficient input validation
// Solution: Implement proper validation
const validateInput = (input) => {
  if (!input || input.trim() === '') {
    return 'Input is required';
  }
  if (input.length < 3) {
    return 'Input must be at least 3 characters';
  }
  return null;
};
```

#### API Security
```javascript
// Problem: API calls not properly secured
// Solution: Implement proper authentication
const secureApiCall = async (data) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const token = await user.getIdToken();
  // Make API call with token
};
```

### 2. Firebase Security

#### Security Rules
```javascript
// Problem: Insecure Firebase rules
// Solution: Implement proper security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing Issues

### 1. Unit Testing

#### Component Testing
```javascript
// Problem: Components not properly tested
// Solution: Implement unit tests
import { render, fireEvent } from '@testing-library/react-native';

test('renders correctly', () => {
  const { getByText } = render(<Component />);
  expect(getByText('Expected Text')).toBeTruthy();
});
```

#### Redux Testing
```javascript
// Problem: Redux actions not tested
// Solution: Test actions and reducers
import { fetchProducts } from '../actions/productactions';

test('fetchProducts action', () => {
  const action = fetchProducts('active');
  expect(action.type).toBe('FETCH_PRODUCTS');
});
```

### 2. Integration Testing

#### Navigation Testing
```javascript
// Problem: Navigation not tested
// Solution: Test navigation flows
import { NavigationContainer } from '@react-navigation/native';

test('navigates to product detail', () => {
  const { getByText } = render(
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
  
  fireEvent.press(getByText('Product'));
  expect(getByText('Product Detail')).toBeTruthy();
});
```

## Monitoring and Debugging

### 1. Error Tracking

#### Crash Reporting
```javascript
// Problem: Crashes not tracked
// Solution: Implement crash reporting
import crashlytics from '@react-native-firebase/crashlytics';

// Track errors
crashlytics().recordError(error);
```

#### Performance Monitoring
```javascript
// Problem: Performance not monitored
// Solution: Implement performance monitoring
import perf from '@react-native-firebase/perf';

// Track performance
const trace = perf().newTrace('screen_load');
trace.start();
// ... screen logic
trace.stop();
```

### 2. Debugging Tools

#### Redux DevTools
```javascript
// Problem: Redux state not debuggable
// Solution: Use Redux DevTools
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
```

#### Network Debugging
```javascript
// Problem: Network requests not debuggable
// Solution: Use network debugging tools
// Enable network inspection in development
```

## Recommendations

### 1. Immediate Fixes
- Fix phone number validation for international formats
- Implement proper error boundaries
- Add loading states for all async operations
- Optimize image loading and caching

### 2. Short-term Improvements
- Implement proper testing framework
- Add performance monitoring
- Improve error handling and user feedback
- Optimize list rendering performance

### 3. Long-term Enhancements
- Implement TypeScript for better type safety
- Add comprehensive testing suite
- Implement offline support
- Add analytics and monitoring
- Improve accessibility features

## Getting Help

### 1. Documentation
- Check project documentation in `memory-bank/`
- Review Firebase documentation
- Consult React Native and Expo docs

### 2. Community Support
- React Native Community
- Expo Community
- Firebase Community
- Stack Overflow

### 3. Professional Support
- Consider hiring React Native developers
- Consult with Firebase experts
- Use professional debugging services