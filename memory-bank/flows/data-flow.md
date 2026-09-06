# Data Flow & API Integration

## Firebase Data Structure

### 1. Firestore Collections
```javascript
// Users Collection
Users/{userId} {
  uid: string,
  phoneNumber: string,
  userName: string,
  usertype: 'user' | 'admin',
  profileStatus: boolean,
  status: 'active' | 'deactivate',
  isdelete: 'yes' | 'no',
  firstname: string,
  lastname: string,
  email: string,
  companyname: string,
  gstnumber: string,
  image: string,
  token: string, // Push notification token
  createDate: timestamp
}

// Products Collection
Products/{productId} {
  id: string,
  title: string,
  description: string,
  image: string,
  status: 'active' | 'inactive',
  price: number,
  category: string,
  specifications: object,
  createDate: timestamp,
  updateDate: timestamp
}

// Cart Collection
Cart/{cartId} {
  userId: string,
  productId: string,
  quantity: number,
  productData: object,
  createDate: timestamp
}

// Quotes Collection
Quotes/{quoteId} {
  userId: string,
  adminId: string,
  products: array,
  totalAmount: number,
  status: 'QUOTE_REQUESTED' | 'QUOTE_SEND' | 'QUOTE_ACCEPT_PAYMENT' | 'QUOTE_CONFIRMED_PROCESSING' | 'ORDER_COMPLETED',
  deliveryAddress: object,
  specialRequirements: string,
  createDate: timestamp,
  updateDate: timestamp
}

// Orders Collection
Orders/{orderId} {
  quoteId: string,
  userId: string,
  adminId: string,
  orderData: object,
  status: string,
  paymentStatus: string,
  deliveryStatus: string,
  createDate: timestamp,
  updateDate: timestamp
}

// Chats Collection
Chats/{chatId} {
  userId: string,
  adminId: string,
  messages: array,
  lastMessage: object,
  createDate: timestamp,
  updateDate: timestamp
}

// ChatList Collection
ChatList/{chatListId} {
  userId: string,
  adminId: string,
  lastMessage: object,
  unreadCount: number,
  createDate: timestamp,
  updateDate: timestamp
}
```

## Redux State Structure

### 1. Authentication State
```javascript
auth: {
  info: {
    uid: string,
    phoneNumber: string,
    usertype: 'user' | 'admin',
    profileStatus: boolean,
    firstname: string,
    lastname: string,
    email: string,
    companyname: string,
    gstnumber: string,
    image: string,
    token: string
  },
  loading: boolean,
  phonenumber: string,
  error: {
    flag: boolean,
    msg: string
  },
  success: string,
  verificationId: string
}
```

### 2. Products State
```javascript
productsdata: {
  products: [
    {
      id: string,
      title: string,
      description: string,
      image: string,
      status: 'active' | 'inactive',
      price: number,
      category: string
    }
  ],
  loading: boolean,
  error: {
    flag: boolean,
    msg: string
  },
  cartCount: number,
  searchtext: string
}
```

### 3. Cart State
```javascript
cartdata: {
  carts: [
    {
      id: string,
      userId: string,
      productId: string,
      quantity: number,
      productData: object
    }
  ],
  loading: boolean,
  error: {
    flag: boolean,
    msg: string
  }
}
```

### 4. Orders State
```javascript
orderdata: {
  quotes: [
    {
      id: string,
      userId: string,
      adminId: string,
      products: array,
      totalAmount: number,
      status: string,
      deliveryAddress: object
    }
  ],
  orders: [
    {
      id: string,
      quoteId: string,
      orderData: object,
      status: string,
      paymentStatus: string
    }
  ],
  loading: boolean,
  error: {
    flag: boolean,
    msg: string
  }
}
```

## API Integration Patterns

### 1. Firebase Authentication Flow
```javascript
// Phone Authentication
export const requestPhoneOtpDevice = (phoneNumber, appVerifier) => (dispatch) => async (firebase) => {
  const { auth } = firebase;
  
  dispatch({ type: REQUEST_OTP, payload: null });
  dispatch({ type: SHOW_LOADER_LOGIN, payload: true });

  try {
    const verificationId = await auth().signInWithPhoneNumber(phoneNumber);
    dispatch({ type: REQUEST_OTP_SUCCESS, payload: verificationId });
  } catch (error) {
    dispatch({ type: REQUEST_OTP_FAILED, payload: error });
  }
};

// OTP Verification
export const mobileSignIn = (verificationId, code) => (dispatch) => async (firebase) => {
  const { auth } = firebase;
  
  dispatch({ type: USER_SIGN_IN, payload: null });

  try {
    await verificationId.confirm(code);
    // User is now authenticated
  } catch (error) {
    dispatch({ type: USER_SIGN_IN_FAILED, payload: error });
  }
};
```

### 2. Firestore Data Operations
```javascript
// Fetch Products with Real-time Updates
export const fetchProducts = (status) => (dispatch) => (firebase) => {
  const { productsCollection } = firebase;
  
  dispatch({ type: FETCH_PRODUCTS, payload: null });
  
  return productsCollection
    .where('status', '==', status)
    .onSnapshot(
      snapshot => {
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: products });
      },
      error => {
        dispatch({ type: FETCH_PRODUCTS_FAILED, payload: error });
      }
    );
};

// Add Product
export const addProduct = (productData) => (dispatch) => (firebase) => {
  const { productsCollection, storage } = firebase;
  
  dispatch({ type: ADD_PRODUCT, payload: null });
  
  // Upload image if provided
  if (productData.image) {
    const imageRef = storage().ref(`products/${Date.now()}`);
    imageRef.put(productData.image).then(() => {
      imageRef.getDownloadURL().then(url => {
        const product = {
          ...productData,
          image: url,
          createDate: new Date()
        };
        
        productsCollection.add(product).then(() => {
          dispatch({ type: ADD_PRODUCT_SUCCESS, payload: product });
        });
      });
    });
  } else {
    const product = {
      ...productData,
      createDate: new Date()
    };
    
    productsCollection.add(product).then(() => {
      dispatch({ type: ADD_PRODUCT_SUCCESS, payload: product });
    });
  }
};
```

### 3. Real-time Data Synchronization
```javascript
// User Authentication State Listener
export const fetchUser = () => (dispatch) => (firebase) => {
  const { auth, usersCollection } = firebase;
  
  dispatch({ type: FETCH_USER, payload: null });
  
  auth().onAuthStateChanged(user => {
    if (user) {
      usersCollection.doc(user.uid).get().then(doc => {
        if (doc.exists) {
          dispatch({ type: FETCH_USER_SUCCESS, payload: doc.data() });
        } else {
          // Create new user
          const userData = {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            usertype: 'user',
            profileStatus: false,
            status: 'deactivate',
            createDate: new Date()
          };
          
          usersCollection.doc(user.uid).set(userData).then(() => {
            dispatch({ type: FETCH_USER_SUCCESS, payload: userData });
          });
        }
      });
    } else {
      dispatch({ type: FETCH_USER_FAILED, payload: { message: 'Not logged in' } });
    }
  });
};
```

## Data Flow Patterns

### 1. User Action → State Update Flow
```
User Action (e.g., Add to Cart)
    ↓
Component dispatches action
    ↓
Action Creator executes
    ↓
Firebase API call
    ↓
Response received
    ↓
Reducer updates state
    ↓
Component re-renders with new state
```

### 2. Real-time Update Flow
```
Firebase Data Change
    ↓
onSnapshot listener triggers
    ↓
Action Creator processes data
    ↓
Reducer updates state
    ↓
All connected components re-render
```

### 3. Error Handling Flow
```
API Error Occurs
    ↓
Action Creator catches error
    ↓
Error action dispatched
    ↓
Reducer updates error state
    ↓
Component shows error message
    ↓
User can retry action
```

## Component Data Integration

### 1. Screen Component Pattern
```javascript
function ProductScreen(props) {
  const { api } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const products = useSelector(state => state.productsdata.products);
  const loading = useSelector(state => state.productsdata.loading);
  const error = useSelector(state => state.productsdata.error);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(api.fetchProducts('active'));
  }, [dispatch, api.fetchProducts]);

  // Handle errors
  useEffect(() => {
    if (error && error.msg) {
      showToastError(error.msg);
    }
  }, [error]);

  // Render component
  return (
    <View>
      {loading && <Spinner />}
      <FlatList data={products} renderItem={renderProduct} />
    </View>
  );
}
```

### 2. Action Dispatch Pattern
```javascript
// Direct action dispatch
const handleAddToCart = (product) => {
  dispatch(api.addToCart({
    userId: auth.info.uid,
    productId: product.id,
    quantity: 1,
    productData: product
  }));
};

// Action with error handling
const handleSubmitQuote = (quoteData) => {
  dispatch(api.submitForQuote(quoteData))
    .then(() => {
      showToastSuccess('Quote submitted successfully');
      navigation.navigate('Orders');
    })
    .catch(error => {
      showToastError('Failed to submit quote');
    });
};
```

## Firebase Security Rules

### 1. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /Users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all authenticated users
    match /Products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/Users/$(request.auth.uid)).data.usertype == 'admin';
    }
    
    // Cart items are user-specific
    match /Cart/{cartId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Quotes are accessible by involved users
    match /Quotes/{quoteId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.adminId == request.auth.uid);
    }
  }
}
```

### 2. Storage Security Rules
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

## Performance Optimization

### 1. Data Pagination
```javascript
// Paginated product loading
export const fetchProductsPaginated = (lastDoc, limit = 10) => (dispatch) => (firebase) => {
  const { productsCollection } = firebase;
  
  let query = productsCollection
    .where('status', '==', 'active')
    .orderBy('createDate', 'desc')
    .limit(limit);
  
  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }
  
  return query.get().then(snapshot => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: products });
    return snapshot.docs[snapshot.docs.length - 1];
  });
};
```

### 2. Image Optimization
```javascript
// Optimized image loading
const ImageComponent = ({ source, style, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  return (
    <View style={style}>
      {loading && <ActivityIndicator />}
      <Image
        source={source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        {...props}
      />
      {error && <Image source={require('./placeholder.png')} style={style} />}
    </View>
  );
};
```

## Error Handling Patterns

### 1. API Error Handling
```javascript
// Centralized error handling
export const handleApiError = (error, dispatch) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred';
  
  if (error.code === 'permission-denied') {
    errorMessage = 'You do not have permission to perform this action';
  } else if (error.code === 'unavailable') {
    errorMessage = 'Service is temporarily unavailable';
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  dispatch({ type: API_ERROR, payload: errorMessage });
  showToastError(errorMessage);
};
```

### 2. Network Error Handling
```javascript
// Network status monitoring
import NetInfo from '@react-native-community/netinfo';

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (!state.isConnected) {
      showToastError('No internet connection');
    }
  });
  
  return unsubscribe;
}, []);
```