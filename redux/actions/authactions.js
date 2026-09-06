import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  EMAIL_SIGN_IN,
  EMAIL_SIGN_IN_SUCCESS,
  EMAIL_SIGN_IN_FAILED,
  EMAIL_REGISTER,
  EMAIL_REGISTER_SUCCESS,
  EMAIL_REGISTER_FAILED,
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILED,
  USER_SIGN_IN,
  USER_SIGN_IN_FAILED,
  USER_SIGN_OUT,
  CLEAR_LOGIN_ERROR,
  UPDATE_USER_PROFILE,
  SEND_RESET_EMAIL,
  SEND_RESET_EMAIL_SUCCESS,
  SEND_RESET_EMAIL_FAILED,
  USER_DELETED,
  SHOW_LOADER_LOGIN,
  UPDATE_USER_PROFILE_FAILED,
  NEW_USER_PROFILE_ROUTE
} from "../store/type";

import store from '../store/store';
import { not_logged_in } from "../../src/common/Constants";
import { showToastError, showToastSuccess, uploadImagetoFirebase, validURL } from "./Validation";

export const loginEmailChange = (email) => {
  return {
    type: LOGIN_EMAIL,
    payload: email
  };
};

export const loginPasswordChange = (password) => {
  return {
    type: LOGIN_PASSWORD,
    payload: password
  };
};

export const fetchProfile = () => (dispatch) => (firebase) => {
  const {
    auth,
    singleUserRef
  } = firebase;
  singleUserRef(auth.currentUser.uid).once('value', snapshot => {
    dispatch({
      type: UPDATE_USER_PROFILE,
      payload: snapshot.val()
    });
  });
}

// Email/Password Sign In
export const emailPasswordSignIn = (email, password) => (dispatch) => async (firebase) => {
  const { auth } = firebase;
  
  dispatch({ type: EMAIL_SIGN_IN, payload: null });
  dispatch({ type: SHOW_LOADER_LOGIN, payload: true });

  try {
    await auth.signInWithEmailAndPassword(email, password);
    // Wait a bit for Firebase to process, then fetch user data
    // fetchUser is already bound with firebase context in redux/index.js, so just dispatch the bound action
    setTimeout(() => {
      fetchUser()(dispatch)(firebase);
    }, 500);
    dispatch({ type: EMAIL_SIGN_IN_SUCCESS, payload: null });
  } catch (error) {
    const errorMsg = error.message || error.code || 'Login failed';
    dispatch({ 
      type: EMAIL_SIGN_IN_FAILED, 
      payload: String(errorMsg)
    });
  }
};

// Email/Password Registration
export const emailPasswordRegister = (email, password, userData) => (dispatch) => async (firebase) => {
  const { auth, usersCollection } = firebase;
  
  dispatch({ type: EMAIL_REGISTER, payload: null });
  dispatch({ type: SHOW_LOADER_LOGIN, payload: true });

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Create user document before listeners rely on it
    const newUserData = {
      uid: user.uid,
      email: user.email,
      ...userData,
      usertype: 'user',
      profileStatus: true,
      status: 'active',
      isdelete: 'no',
      createDate: new Date()
    };

    const token = await getPushNotificationsToken();
    if (token) newUserData.token = token;
    await usersCollection.doc(user.uid).set(newUserData);

    dispatch({ type: EMAIL_REGISTER_SUCCESS, payload: newUserData });
  } catch (error) {
    const errorMsg = error.message || error.code || 'Registration failed';
    dispatch({ 
      type: EMAIL_REGISTER_FAILED, 
      payload: String(errorMsg)
    });
  }
};

// Password Reset
export const sendPasswordResetEmail = (email) => (dispatch) => async (firebase) => {
  const { auth } = firebase;
  
  dispatch({ type: SEND_RESET_EMAIL, payload: null });
  
  try {
    await auth.sendPasswordResetEmail(email);
    dispatch({ type: SEND_RESET_EMAIL_SUCCESS, payload: 'Password reset email sent' });
  } catch (error) {
    const errorMsg = error.message || error.code || 'Failed to send reset email';
    dispatch({ 
      type: SEND_RESET_EMAIL_FAILED, 
      payload: String(errorMsg)
    });
  }
};

export const fetchUser = () => (dispatch) => (firebase) => {
  const {
    auth,
    config,
    usersCollection
  } = firebase;

  console.log("fetchUser called");
  dispatch({
    type: FETCH_USER,
    payload: null
  });
  auth.onAuthStateChanged(async (user) => {
    console.log("onAuthStateChanged - user:", user ? user.uid : "null");
    if (user) {
      try {
        // Skip cloud function check and directly fetch user data
        let userNodeData = await usersCollection.doc(String(user.uid)).get()
        let userData = userNodeData._data || userNodeData.data();

        // Registration may still be writing the user document — retry once
        if (userData == undefined) {
          await new Promise(resolve => setTimeout(resolve, 800));
          userNodeData = await usersCollection.doc(String(user.uid)).get();
          userData = userNodeData._data || userNodeData.data();
        }

        if (userData == undefined) {
          // Incomplete profile — do not write a conflicting "deactivate" stub
          const incompleteUser = {
            uid: user.uid,
            email: user.email,
            userName: null,
            usertype: 'user',
            profileStatus: false,
            status: "active",
            isdelete: "no",
            createDate: new Date()
          };
          const token = await getPushNotificationsToken();
          if (token) incompleteUser.token = token;
          await usersCollection.doc(user.uid).set(incompleteUser, { merge: true });
          dispatch({
            type: FETCH_USER_SUCCESS,
            payload: incompleteUser
          });
        } else {
          const token = await getPushNotificationsToken();
          if (token) await usersCollection.doc(user.uid).update({ token });
          dispatch({
            type: FETCH_USER_SUCCESS,
            payload: userData
          });
        }
      } catch (error) {
        console.log("Error fetching user:", error);
        dispatch({
          type: FETCH_USER_FAILED,
          payload: error.message || 'Failed to fetch user'
        });
      }
    } else {
      dispatch({
        type: FETCH_USER_FAILED,
        payload: not_logged_in
      });
    }
  });
};

const getPushNotificationsToken = async () => {
  let token = null;
  try {
    if (Platform.OS === 'web' || !Device.isDevice) {
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (error) {
    console.log("Push notification not available:", error);
    return null;
  }

  return token;
}

export const signOut = () => (dispatch) => (firebase) => {

  const {
    auth,
  } = firebase;

  auth.signOut()
    .then(() => {
      dispatch({
        type: USER_SIGN_OUT,
        payload: null
      });
    })
    .catch(error => {
      dispatch({
        type: USER_SIGN_OUT,
        payload: null
      });
      console.log("signOut error:", error);
    });
};

export const deleteUser = (uid) => (dispatch) => (firebase) => {
  const {
    singleUserRef,
    auth
  } = firebase;

  singleUserRef(uid).remove().then(() => {
    if (auth.currentUser.uid == uid) {
      auth.signOut();
      dispatch({
        type: USER_DELETED,
        payload: null
      });
    }
  });
};

// export const updateProfile = (userAuthData, updateData) => (dispatch) => (firebase) => {

//   const {
//     singleUserRef,
//     driverDocsRef
//   } = firebase;

//   let profile = userAuthData.profile;

//   if (updateData.licenseImage) {
//     let timestamp = new Date().toISOString();
//     driverDocsRef(timestamp).put(updateData.licenseImage);
//     updateData.licenseImage = driverDocsRef(timestamp).getDownloadURL();
//   }

//   profile = { ...profile, ...updateData }
//   dispatch({
//     type: UPDATE_USER_PROFILE,
//     payload: profile
//   });
//   singleUserRef(userAuthData.uid).update(updateData);
// };

export const updateProfile = (userdata) => (dispatch) => (firebase) => {
  const {
    usersCollection,
    storage
  } = firebase;

  dispatch({
    type: SHOW_LOADER_LOGIN,
    payload: true
  })

  var data = {
    firstname: userdata.firstname,
    lastname: userdata.lastname,
    email: userdata.email,
    profileStatus: true,
    companyname: userdata.companyname || "",
    gstnumber: userdata.gstnumber || "",
    phonenumber: userdata.phonenumber || userdata.phoneNumber || ""
  }

  usersCollection.doc(userdata.uid).update(data).then(async () => {

    if (userdata.image) {
      if (!validURL(userdata.image)) {
        let url = await uploadImagetoFirebase(userdata.image, userdata.uid, storage);
        await usersCollection.doc(userdata.uid).update({
          image: url
        });
      }
    } else {
      await usersCollection.doc(userdata.uid).update({
        image: null
      });
    }

    if (!userdata.profileStatus) {
      dispatch({
        type: NEW_USER_PROFILE_ROUTE,
        payload: data
      });
    } else {
      dispatch({
        type: UPDATE_USER_PROFILE,
        payload: data
      });
    }


  }).catch(error => {
    dispatch({
      type: UPDATE_USER_PROFILE_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}

// export const updateProfileImage = (userAuthData, imageBlob) => (dispatch) => (firebase) => {

//   const {
//     singleUserRef,
//     profileImageRef,
//   } = firebase;

//   profileImageRef(userAuthData.uid).put(imageBlob).then(() => {
//     imageBlob.close()
//     return profileImageRef(userAuthData.uid).getDownloadURL()
//   }).then((url) => {
//     let profile = userAuthData.profile;
//     profile.profile_image = url;
//     singleUserRef(userAuthData.uid).update({
//       profile_image: url
//     });
//     dispatch({
//       type: UPDATE_USER_PROFILE,
//       payload: profile
//     });
//   })
// };

export const updatePushToken = (userAuthData, token, platform) => (dispatch) => (firebase) => {

  const {
    singleUserRef,
  } = firebase;

  let profile = userAuthData.profile;
  profile.pushToken = token;
  profile.userPlatform = platform;
  dispatch({
    type: UPDATE_USER_PROFILE,
    payload: profile
  });
  singleUserRef(userAuthData.uid).update({
    pushToken: token,
    userPlatform: platform
  });
};

export const clearLoginError = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_LOGIN_ERROR,
    payload: null
  });
};
