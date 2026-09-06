# Redux Patterns & State Management

## Redux Architecture Pattern

### 1. Action Creator Pattern
```javascript
// Standard action creator with thunk middleware
export const fetchProducts = (status) => (dispatch) => (firebase) => {
  const { productsCollection } = firebase;
  
  dispatch({ type: FETCH_PRODUCTS, payload: null });
  
  return productsCollection
    .where('status', '==', status)
    .onSnapshot(snapshot => {
      // Handle real-time updates
    });
};
```

**Key Characteristics:**
- Curried function: `(params) => (dispatch) => (firebase) => { ... }`
- Firebase context injection for API calls
- Real-time listeners with unsubscribe capability
- Error handling with try-catch blocks

### 2. Reducer Pattern
```javascript
const INITIAL_STATE = {
  products: [],
  loading: false,
  error: { flag: false, msg: null },
  searchtext: ""
};

export const productReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return { ...state, loading: true };
    case FETCH_PRODUCTS_SUCCESS:
      return { 
        ...state, 
        products: action.payload, 
        loading: false 
      };
    case FETCH_PRODUCTS_FAILED:
      return { 
        ...state, 
        loading: false, 
        error: { flag: true, msg: action.payload } 
      };
    default:
      return state;
  }
};
```

**Key Characteristics:**
- Immutable state updates using spread operator
- Consistent error state structure
- Loading state management
- Default case returns current state

### 3. Firebase Context Pattern
```javascript
const FirebaseContext = createContext(null);

const FirebaseProvider = ({ config, children }) => {
  let firebase = {
    auth: auth,
    firestore: firestore,
    usersCollection: firestore().collection('Users'),
    productsCollection: firestore().collection('Products'),
    api: {
      fetchUser: () => (dispatch) => fetchUser()(dispatch)(firebase),
      fetchProducts: (status) => (dispatch) => fetchProducts(status)(dispatch)(firebase),
      // ... other API methods
    }
  };
  
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};
```

**Key Characteristics:**
- Centralized Firebase configuration
- Pre-configured collection references
- API methods wrapped with dispatch and firebase injection
- Context provider for app-wide access

## State Management Patterns

### 1. Normalized State Structure
```javascript
// Products state
{
  products: [
    { id: '1', title: 'Product A', status: 'active' },
    { id: '2', title: 'Product B', status: 'inactive' }
  ],
  loading: false,
  error: { flag: false, msg: null },
  searchtext: "",
  cartCount: 5
}
```

### 2. Error Handling Pattern
```javascript
// Consistent error state structure
error: {
  flag: boolean,    // Whether error exists
  msg: string      // Error message
}

// Error handling in components
useEffect(() => {
  if (props.error && props.error.msg) {
    showToastError(props.error.msg);
  }
}, [props.error]);
```

### 3. Loading State Pattern
```javascript
// Loading state management
const showLoader = () => {
  if (props.loading === true) {
    return <Spinner />;
  }
};

// In component render
{showLoader()}
```

### 4. Real-time Data Pattern
```javascript
// Real-time Firestore listeners
useEffect(() => {
  unsubRef = dispatch(api.fetchProducts("active"));
  return () => unsubRef && unsubRef(); // Cleanup
}, [dispatch, api.fetchProducts]);
```

## Component Integration Patterns

### 1. Connect Pattern (Class Components)
```javascript
const mapStateToProps = (state) => ({
  products: state.productsdata.products,
  loading: state.productsdata.loading,
  error: state.productsdata.error
});

export default connect(mapStateToProps, actions)(Component);
```

### 2. Hooks Pattern (Functional Components)
```javascript
function Component() {
  const { api } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const products = useSelector(state => state.productsdata.products);
  
  // Component logic
}
```

### 3. Action Dispatch Pattern
```javascript
// Direct action dispatch
dispatch(api.fetchProducts("active"));

// Action with parameters
dispatch(api.addToCart(productData));

// Action with error handling
dispatch(api.updateProfile(userData))
  .catch(error => {
    showToastError(error.message);
  });
```

## Firebase Integration Patterns

### 1. Collection Reference Pattern
```javascript
// Pre-configured collection references
usersCollection: firestore().collection('Users'),
productsCollection: firestore().collection('Products'),
cartCollection: firestore().collection('Cart'),
quotesCollection: firestore().collection('Quotes'),
ordersCollection: firestore().collection('Orders')
```

### 2. Real-time Listener Pattern
```javascript
// Real-time data with cleanup
const fetchProducts = (status) => (dispatch) => (firebase) => {
  const { productsCollection } = firebase;
  
  return productsCollection
    .where('status', '==', status)
    .onSnapshot(
      snapshot => {
        // Success handler
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: products });
      },
      error => {
        // Error handler
        dispatch({ type: FETCH_PRODUCTS_FAILED, payload: error });
      }
    );
};
```

### 3. Authentication State Pattern
```javascript
// Auth state listener
auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    dispatch({ type: FETCH_USER_SUCCESS, payload: userData });
  } else {
    // User is signed out
    dispatch({ type: USER_SIGN_OUT, payload: null });
  }
});
```

## Data Flow Patterns

### 1. User Action → State Update Flow
```
User Action → Component → dispatch(action) → Action Creator → Firebase API → 
Response → Reducer → Store Update → Component Re-render
```

### 2. Real-time Update Flow
```
Firebase Change → onSnapshot → Action Creator → Reducer → Store Update → 
Component Re-render
```

### 3. Error Handling Flow
```
API Error → Action Creator → Error Action → Reducer → Error State → 
Component → Error Display
```

## Best Practices

### 1. Action Naming Convention
- `FETCH_*` for data fetching
- `ADD_*` for creating new items
- `UPDATE_*` for modifying existing items
- `DELETE_*` for removing items
- `CLEAR_*` for clearing state

### 2. State Structure Convention
- Always include `loading` and `error` states
- Use consistent error object structure
- Keep state flat when possible
- Use arrays for lists, objects for single items

### 3. Component Integration Convention
- Use `useSelector` for state access
- Use `useDispatch` for action dispatching
- Use `useContext` for Firebase API access
- Always cleanup real-time listeners

### 4. Error Handling Convention
- Show user-friendly error messages
- Clear errors after display
- Log errors for debugging
- Handle network errors gracefully

## Common Anti-Patterns to Avoid

1. **Mutating State**: Always use spread operator for updates
2. **Missing Cleanup**: Always cleanup real-time listeners
3. **Direct Firebase Calls**: Use action creators instead
4. **Inconsistent Error Handling**: Use standard error state structure
5. **Missing Loading States**: Always show loading indicators
6. **Hardcoded Values**: Use constants and configuration