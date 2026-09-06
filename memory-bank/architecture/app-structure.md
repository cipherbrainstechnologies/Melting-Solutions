# Application Structure & Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native App                        │
├─────────────────────────────────────────────────────────────┤
│  Navigation Layer (React Navigation)                       │
│  ├── AuthStack (Login, Register, Verification)            │
│  ├── UserNavigator (Tab + Stack for Users)                │
│  └── AdminNavigator (Drawer + Stack for Admins)           │
├─────────────────────────────────────────────────────────────┤
│  State Management Layer (Redux)                            │
│  ├── Actions (API calls, business logic)                  │
│  ├── Reducers (State updates)                             │
│  └── Store (Centralized state)                            │
├─────────────────────────────────────────────────────────────┤
│  Firebase Context Layer                                    │
│  ├── Authentication (Phone OTP)                           │
│  ├── Firestore (Database)                                 │
│  ├── Storage (Files/Images)                               │
│  └── Notifications (Push)                                 │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (Native Base + Custom Components)               │
│  ├── Screens (Feature-specific views)                     │
│  ├── Components (Reusable UI elements)                    │
│  └── Common (Themes, Constants, Styles)                   │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Root Level
```
melting-solution/
├── App.js                    # Main app entry point
├── AppCommon.js              # Common app wrapper with auth
├── app.json                  # Expo configuration
├── package.json              # Dependencies and scripts
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler config
├── google-services.json      # Firebase Android config
└── index.js                  # App registration
```

### Source Code (`src/`)
```
src/
├── screens/                  # All application screens
│   ├── Auth/
│   │   ├── Login.js         # Phone number input
│   │   ├── Register.js      # User registration
│   │   └── Verification.js  # OTP verification
│   ├── User/
│   │   ├── Home.js          # Product catalog
│   │   ├── Cart.js          # Shopping cart
│   │   ├── Orders.js        # Order history
│   │   └── Profile.js       # User profile
│   ├── Admin/
│   │   ├── HomeAdmin.js     # Admin dashboard
│   │   ├── Users.js         # User management
│   │   ├── Products.js      # Product management
│   │   ├── AddProduct.js    # Add/edit products
│   │   ├── ViewProduct.js   # Product details
│   │   ├── OrderManagement.js # Order processing
│   │   ├── NotificationBroadcast.js # Send notifications
│   │   └── Reports.js       # Analytics and reports
│   └── Common/
│       ├── AuthLoadingScreen.js # Loading screen
│       ├── ProductDetail.js     # Product details
│       ├── OrderDetails.js      # Order details
│       ├── ChatBoard.js         # Real-time chat
│       ├── SearchProduct.js     # Product search
│       └── ChooseDeliveryLocation.js # Location picker
├── components/               # Reusable UI components
│   ├── Header.js            # Navigation header
│   ├── Drawer.js            # Admin side menu
│   ├── DrawerItem.js        # Drawer menu items
│   ├── InputCard.js         # Custom input component
│   ├── MaterialButtonDark.js # Primary button
│   ├── MaterialButtonLight.js # Secondary button
│   ├── ProfileComponent.js  # User profile display
│   ├── Spinner.js           # Loading indicator
│   └── CustomSwitch.js      # Toggle switch
├── navigation/               # Navigation configuration
│   ├── AppNavigator.js      # Main navigation setup
│   └── MainNavigator.js     # Screen definitions
└── common/                   # Shared utilities
    ├── Constants.js         # App constants
    ├── FirebaseConfig.js    # Firebase configuration
    ├── globleStyles.js      # Global styles
    ├── theme.js             # Color and typography
    └── GoogleMapApiConfig.js # Maps configuration
```

### Redux Structure (`redux/`)
```
redux/
├── index.js                 # Firebase context provider
├── store/
│   ├── store.js            # Redux store configuration
│   └── type.js             # Action type constants
├── actions/                 # Redux actions
│   ├── authactions.js      # Authentication actions
│   ├── productactions.js   # Product management
│   ├── cartactions.js      # Shopping cart
│   ├── orderactions.js     # Order processing
│   ├── useractions.js      # User management
│   ├── chatactions.js      # Chat functionality
│   ├── homeactions.js      # Dashboard data
│   ├── reportsactions.js   # Reports and analytics
│   ├── notificationbrodactions.js # Push notifications
│   ├── searchlocationactions.js # Location services
│   └── Validation.js       # Utility functions
└── reducers/                # Redux reducers
    ├── authreducer.js      # Authentication state
    ├── procuctreducer.js   # Product state
    ├── cartreducer.js      # Cart state
    ├── orderreducer.js     # Order state
    ├── usersreducer.js     # User state
    ├── chatreducer.js      # Chat state
    ├── homereducer.js      # Dashboard state
    ├── reportsreducer.js   # Reports state
    ├── notificationbrodreducer.js # Notifications state
    └── searchlocationreducer.js # Location state
```

### Assets (`assets/`)
```
assets/
├── fonts/                   # Custom font files
│   ├── Sofia-Pro-Bold.otf
│   ├── Sofia-Pro-Semi-Bold.otf
│   ├── Sofia-Pro-Regular.otf
│   ├── Sofia-Pro-Medium.otf
│   └── Sofia-Pro-Light.otf
├── images/                  # App images and icons
│   ├── icon.png            # App icon
│   ├── splash.png          # Splash screen
│   ├── adaptive-icon.png   # Android adaptive icon
│   └── [various status icons]
└── [other assets]
```

## Navigation Architecture

### Authentication Flow
```
AuthLoadingScreen → AuthStack
├── Login (Phone input)
├── Register (User registration)
└── Verification (OTP verification)
```

### User Flow
```
UserNavigator → TabNavigator
├── Home (Product catalog)
├── Search (Product search)
├── Order (Order history)
└── Profile (User profile)

+ Stack Screens:
├── ProductDetail
├── OrderDetails
├── ChatBoard
├── Cart
└── ChooseDeliveryLocation
```

### Admin Flow
```
AdminNavigator → DrawerNavigator → AdminNavigation → TabNavigatorAdmin
├── Home (Dashboard)
├── Users (User management)
├── Products (Product management)
├── Order (Order management)
└── Profile (Admin profile)

+ Stack Screens:
├── AddProduct
├── ViewProduct
├── AddUser
├── ViewUser
├── OrderManagement
├── NotificationBroadcast
└── Reports
```

## State Management Architecture

### Redux Store Structure
```javascript
{
  auth: {
    info: userObject,
    loading: boolean,
    phonenumber: string,
    error: { flag: boolean, msg: string },
    verificationId: string
  },
  productsdata: {
    products: array,
    loading: boolean,
    error: object,
    cartCount: number,
    searchtext: string
  },
  cartdata: {
    carts: array,
    loading: boolean,
    error: object
  },
  orderdata: {
    quotes: array,
    orders: array,
    loading: boolean,
    error: object
  },
  // ... other reducers
}
```

### Firebase Context API
The Firebase context provides a centralized API for all Firebase operations:
- Authentication methods
- Firestore collection references
- Storage operations
- Push notification handling

## Component Architecture

### Screen Components
- **Functional Components**: All screens use React hooks
- **Redux Integration**: Connected via `connect()` HOC
- **Navigation Props**: Access to navigation methods
- **Context Usage**: Firebase context for API calls

### Reusable Components
- **InputCard**: Custom input with icons and validation
- **MaterialButton**: Styled buttons with variants
- **Header**: Navigation header with customizable options
- **Spinner**: Loading indicator component

### Styling Architecture
- **Global Styles**: Centralized in `globleStyles.js`
- **Theme System**: Colors and typography in `theme.js`
- **Component Styles**: Local StyleSheet objects
- **Native Base**: Utility-first component library

## Data Flow

1. **User Action** → Screen Component
2. **Screen** → Redux Action (via dispatch)
3. **Action** → Firebase API call
4. **Firebase** → Response data
5. **Action** → Reducer (state update)
6. **Reducer** → Store (new state)
7. **Store** → Component (re-render)

## Security Architecture

- **Authentication**: Phone-based OTP verification
- **Authorization**: Role-based access (User/Admin)
- **Data Security**: Firebase security rules
- **API Security**: Firebase authentication tokens
- **Storage Security**: Firebase Storage rules