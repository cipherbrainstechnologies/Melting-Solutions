import { createContext } from "react";
// import app from 'firebase/app';
// import 'firebase/database';
// import 'firebase/auth';
// import 'firebase/storage';
import store from './store/store';
import { clearLoginError, emailPasswordRegister, emailPasswordSignIn, fetchUser, sendPasswordResetEmail, signOut, updateProfile } from "./actions/authactions";
// Using Firebase Web SDK v8 (already installed in package.json)
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { adminCreateUser, clearUserError, editUser, fetchUsers, onDeleteUser, onUserStatusChange, resetUserForm, setEditUserDataToState } from "./actions/useractions";
import { addProduct, clearProductError, editProduct, fetchProducts, onDeleteProduct, onProductStatusChange, setEditProductDataToState } from "./actions/productactions";
import { addToCart, clearCartError, fetchCartCount, fetchCarts, submitForQuote } from "./actions/cartactions";
import { clearSaveAddressError, deleteSavedAddress, fetchSavedAddress, saveAddress, selectSavedAddress } from "./actions/searchlocationactions";
import { clearOrderError, doCompleteOrder, doQuoteAcceptAndPayment, doQuoteConfirmedAndProcessing, doQuoteSent, fetchQuoteData, onChatBoardClick } from "./actions/orderactions";
import { clearChatBoardData } from "./actions/chatactions";
import { fetchTotalProductCount, fetchTotalQuoteCount, fetchTotalUsersCount } from "./actions/homeactions";
import { clearNBError, fetchNBUsers, sendBroadcastNotification } from "./actions/notificationbrodactions";
import { clearReportError, fetchReportData } from "./actions/reportsactions";

const FirebaseContext = createContext(null);

const FirebaseProvider = ({ config, appcat, children }) => {
    // Initialize Firebase Web SDK v8
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    let firebaseContext = {
        app: firebase.app(),
        config: config,
        appcat: appcat,
        storage: firebase.storage(),
        firestore: firebase.firestore(),
        FieldValue: firebase.firestore.FieldValue,
        usersCollection: firebase.firestore().collection('Users'),
        productsCollection: firebase.firestore().collection('Products'),
        cartCollection: firebase.firestore().collection('Cart'),
        quotesCollection: firebase.firestore().collection('Quotes'),
        ordersCollection: firebase.firestore().collection('Orders'),
        settingsCollection: firebase.firestore().collection('Settings'),
        chatCollection: firebase.firestore().collection('Chats'),
        chatListCollection: firebase.firestore().collection('ChatList'),
        auth: firebase.auth(),
        api: {
            emailPasswordSignIn: (email, password) => (dispatch) => emailPasswordSignIn(email, password)(dispatch)(firebaseContext),
            emailPasswordRegister: (email, password, userData) => (dispatch) => emailPasswordRegister(email, password, userData)(dispatch)(firebaseContext),
            sendPasswordResetEmail: (email) => (dispatch) => sendPasswordResetEmail(email)(dispatch)(firebaseContext),
            fetchUser: () => (dispatch) => fetchUser()(dispatch)(firebaseContext),
            clearLoginError: () => (dispatch) => clearLoginError()(dispatch)(firebaseContext),
            signOut: () => (dispatch) => signOut()(dispatch)(firebaseContext),
            fetchUsers: () => (dispatch) => fetchUsers()(dispatch)(firebaseContext),
            adminCreateUser: (password) => (dispatch) => adminCreateUser(password)(dispatch)(firebaseContext),
            editUser: (uid) => (dispatch) => editUser(uid)(dispatch)(firebaseContext),
            setEditUserDataToState: (data) => (dispatch) => setEditUserDataToState(data)(dispatch),
            resetUserForm: () => (dispatch) => dispatch(resetUserForm()),
            clearUserError: () => (dispatch) => dispatch(clearUserError()),
            onDeleteUser: (uid) => (dispatch) => onDeleteUser(uid)(dispatch)(firebaseContext),
            onUserStatusChange: (uid, status) => (dispatch) => onUserStatusChange(uid, status)(dispatch)(firebaseContext),
            fetchProducts: (status) => (dispatch) => fetchProducts(status)(dispatch)(firebaseContext),
            addProduct: () => (dispatch) => addProduct()(dispatch)(firebaseContext),
            editProduct: (uid) => (dispatch) => editProduct(uid)(dispatch)(firebaseContext),
            onDeleteProduct: (uid) => (dispatch) => onDeleteProduct(uid)(dispatch)(firebaseContext),
            onProductStatusChange: (uid, status) => (dispatch) => onProductStatusChange(uid, status)(dispatch)(firebaseContext),
            setEditProductDataToState: (data) => (dispatch) => setEditProductDataToState(data)(dispatch),
            clearProductError: () => (dispatch) => clearProductError()(dispatch)(firebaseContext),
            updateProfile: (userdata) => (dispatch) => updateProfile(userdata)(dispatch)(firebaseContext),
            addToCart: (data) => (dispatch) => addToCart(data)(dispatch)(firebaseContext),
            clearCartError: () => (dispatch) => clearCartError()(dispatch)(firebaseContext),
            fetchCartCount: () => (dispatch) => fetchCartCount()(dispatch)(firebaseContext),
            fetchCarts: () => (dispatch) => fetchCarts()(dispatch)(firebaseContext),
            saveAddress: (data) => (dispatch) => saveAddress(data)(dispatch)(firebaseContext),
            clearSaveAddressError: () => (dispatch) => clearSaveAddressError()(dispatch)(firebaseContext),
            fetchSavedAddress: () => (dispatch) => fetchSavedAddress()(dispatch)(firebaseContext),
            deleteSavedAddress: (obj) => (dispatch) => deleteSavedAddress(obj)(dispatch)(firebaseContext),
            selectSavedAddress: (obj) => (dispatch) => selectSavedAddress(obj)(dispatch)(firebaseContext),
            submitForQuote: (obj) => (dispatch) => submitForQuote(obj)(dispatch)(firebaseContext),
            clearOrderError: () => (dispatch) => clearOrderError()(dispatch)(firebaseContext),
            fetchQuoteData: (status) => (dispatch) => fetchQuoteData(status)(dispatch)(firebaseContext),
            doQuoteSent: (obj) => (dispatch) => doQuoteSent(obj)(dispatch)(firebaseContext),
            doQuoteAcceptAndPayment: (obj) => (dispatch) => doQuoteAcceptAndPayment(obj)(dispatch)(firebaseContext),
            doQuoteConfirmedAndProcessing: (obj) => (dispatch) => doQuoteConfirmedAndProcessing(obj)(dispatch)(firebaseContext),
            doCompleteOrder: (obj) => (dispatch) => doCompleteOrder(obj)(dispatch)(firebaseContext),
            onChatBoardClick: (obj) => (dispatch) => onChatBoardClick(obj)(dispatch)(firebaseContext),
            clearChatBoardData: () => (dispatch) => clearChatBoardData()(dispatch)(firebaseContext),
            fetchNBUsers: () => (dispatch) => fetchNBUsers()(dispatch)(firebaseContext),
            clearNBError: () => (dispatch) => clearNBError()(dispatch)(firebaseContext),
            sendBroadcastNotification: () => (dispatch) => sendBroadcastNotification()(dispatch)(firebaseContext),
            fetchReportData: (status) => (dispatch) => fetchReportData(status)(dispatch)(firebaseContext),
            clearReportError: () => (dispatch) => clearReportError()(dispatch)(firebaseContext),

            //Home Admin
            fetchTotalUsersCount: () => (dispatch) => fetchTotalUsersCount()(dispatch)(firebaseContext),
            fetchTotalProductCount: () => (dispatch) => fetchTotalProductCount()(dispatch)(firebaseContext),
            fetchTotalQuoteCount: (status) => (dispatch) => fetchTotalQuoteCount(status)(dispatch)(firebaseContext),
        }
    }

    return (
        <FirebaseContext.Provider value={firebaseContext}>
            {children}
        </FirebaseContext.Provider>
    )
}

export {
    FirebaseContext,
    FirebaseProvider,
    store
}
