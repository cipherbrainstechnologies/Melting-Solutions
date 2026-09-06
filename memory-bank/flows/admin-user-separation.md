# Admin vs User App Separation

## Overview
The application has a dual-role architecture that serves both **Admin** and **User** (Buyer) personas within a single codebase. The differentiation is handled dynamically based on the `usertype` field in the Firestore user document.

## User Role Determination

### Firestore User Document Structure
```javascript
Users/{userId} {
  uid: string,
  email: string,
  usertype: 'user' | 'admin',  // CRITICAL: Determines app flow
  profileStatus: boolean,       // Whether profile is complete
  status: 'active' | 'deactivate',
  isdelete: 'yes' | 'no',
  firstname: string,
  lastname: string,
  companyname: string,
  // ... other fields
}
```

### Routing Logic (AuthLoadingScreen.js)

```49:62:src/screens/AuthLoadingScreen.js
        let role = auth.info.usertype;
        if (role === 'user') {
          if (auth.info.profileStatus) {
            props.navigation.navigate('UserRoot');
          } else {
            props.navigation.navigate('ProfileRoot');
          }
        } else if (role === 'admin') {
          if (auth.info.profileStatus) {
            props.navigation.navigate('AdminRoot');
          } else {
            props.navigation.navigate('ProfileRoot');
          }
        }
```

## Navigation Structure

### Admin Navigator
- **Tab Navigator** (`TabNavigatorAdmin`)
  - Home: `HomeAdmin` (Dashboard with statistics)
  - Users: `Users` (Manage users)
  - Products: `Products` (Manage products)
  - Order: `Orders` (View all orders)
  - Profile: `Profile`
  
- **Stack Screens** (Additional screens accessible via navigation)
  - ProductDetail
  - OrderDetails
  - ChatBoard
  - AddUser
  - ViewUser
  - AddProduct
  - ViewProduct
  - OrderManagement
  - NotificationBroadcast
  - Reports

### User Navigator  
- **Tab Navigator** (`TabNavigator`)
  - Home: `Home` (Product catalog)
  - Search: `SearchProduct`
  - Order: `Orders` (User's orders)
  - Profile: `Profile`

- **Stack Screens**
  - ProductDetail
  - OrderDetails
  - ChatBoard
  - Cart
  - ChooseDeliveryLocation

## Key Differences

| Feature | User App | Admin App |
|---------|----------|-----------|
| **Home Screen** | Product catalog/grid | Dashboard with statistics |
| **Products** | View-only, add to cart | Full CRUD operations |
| **Users** | No access | View/Manage all users |
| **Orders** | Own orders only | All orders system-wide |
| **Reports** | Not available | Full reporting access |
| **Cart** | Available | Not available |
| **Notifications** | Receive only | Can broadcast notifications |

## Registration Flow

### New User Registration
```158:158:redux/actions/authactions.js
            usertype: 'user',
```
- Default role is always `'user'`
- Must be manually promoted to admin in Firestore or via a separate admin interface
- Requires profile completion before accessing main app

### Admin Account
- Must be created manually in Firestore with `usertype: 'admin'`
- Or promoted through an existing admin account
- Can create products, manage users, send quotes

## Screen Components

### Home.js (User)
- Displays product catalog
- Shows cart badge
- Greets user by name
- Navigation to product details

### HomeAdmin.js (Admin)
- Shows statistics cards:
  - Total Users
  - Total Products
  - Send Quotes (pending quotes to respond to)
  - Completed Orders
- Drawer toggle for additional admin functions
- No cart functionality

## Drawer Navigation (Admin Only)
Accessed via toggle on HomeAdmin, provides access to:
- Dashboard
- Reports
- Settings
- User Management
- Product Management
- Order Management
- Logout

## Profile Management

### Profile Status
- Both user types must complete their profile before accessing main features
- `profileStatus: false` → Redirects to ProfileRoot
- `profileStatus: true` → Access to respective dashboard

### Profile Screen Behavior
```100:100:src/screens/Profile.js
                isRightIconHide={auth.info.usertype == "user" ? false : true}
```
- Regular users see logout button
- Admins don't (logout handled via drawer)

## Best Practices

1. **Role Checking**: Always check `auth.info.usertype` before rendering admin-only features
2. **Firestore Security Rules**: Enforce role-based access in Firestore rules
3. **Component Guarding**: Use conditional rendering based on user role
4. **Navigation**: Never allow users to access admin screens through URL manipulation

## Security Considerations

### Firestore Rules
```javascript
// Only allow users to read their own data
match /Users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Only admins can write to Products
match /Products/{productId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
    get(/databases/$(database)/documents/Users/$(request.auth.uid)).data.usertype == 'admin';
}
```

## Common Flows

### User Flow
1. Login/Register → AuthLoadingScreen
2. Check `usertype === 'user'`
3. Check `profileStatus === true`
4. If profile incomplete → Profile screen
5. If profile complete → UserRoot (TabNavigator)
6. Browse products, add to cart, request quotes

### Admin Flow
1. Login → AuthLoadingScreen
2. Check `usertype === 'admin'`
3. Check `profileStatus === true`
4. If profile incomplete → Profile screen
5. If profile complete → AdminRoot (TabNavigatorAdmin + Drawer)
6. Manage products, users, orders

## Testing
- Create test user with `usertype: 'user'`
- Create test admin with `usertype: 'admin'`
- Verify correct navigation and feature access
- Test profile completion requirement

