import store from '../store/store';
import firebase from 'firebase/app';
import 'firebase/auth';
import { ADD_USERS_FAILED, ADD_USERS_SUCCESS, CLEAR_USER_ERROR, FETCH_ALL_USERS, FETCH_ALL_USERS_FAILED, FETCH_ALL_USERS_SUCCESS, USER_COMPANYNAME, USER_EMAIL, USER_FIRSTNAME, USER_GSTNUMBER, USER_LASTNAME, USER_MOBILENUMBER, USER_RESET, USER_SEARCH_DATA } from '../store/type';



export const fetchUsers = () => (dispatch) => (firebase) => {
  const {
    usersCollection
  } = firebase;

  dispatch({
    type: FETCH_ALL_USERS,
    payload: null
  })

  try {
    usersCollection
      .where('usertype', '!=', 'admin')
      // .where('isdelete', '==', 'no')
      .onSnapshot(querySnapshot => {
        let users = []
        querySnapshot.forEach(documentSnapshot => {
          let data = documentSnapshot.data();
          if (data.isdelete == 'no') users.push(data)
        })
        dispatch({
          type: FETCH_ALL_USERS_SUCCESS,
          payload: users
        });
      });
  } catch (error) {
    dispatch({
      type: FETCH_ALL_USERS_FAILED,
      payload: error,
    });
  }

}

export const editUser = (uid) => (dispatch) => (firebase) => {
  const {
    usersCollection
  } = firebase;
  const state = store.getState();

  dispatch({
    type: FETCH_ALL_USERS,
    payload: null
  })

  usersCollection.doc(uid).update({
    firstname: state.usersdata.first_name,
    lastname: state.usersdata.last_name,
    email: state.usersdata.email,
    phoneNumber: state.usersdata.mobile_number,
    companyname: state.usersdata.company_name,
    gstnumber: state.usersdata.gst_number
  }).then(() => {
    dispatch({
      type: ADD_USERS_SUCCESS,
      payload: 'edit_success'
    });
  }).catch(error => {
    dispatch({
      type: ADD_USERS_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}

const getSecondaryAuth = (config) => {
  let secondaryApp;
  try {
    secondaryApp = firebase.app('AdminSecondary');
  } catch (error) {
    secondaryApp = firebase.initializeApp(config, 'AdminSecondary');
  }
  return secondaryApp.auth();
};

export const adminCreateUser = (password) => (dispatch) => async (firebaseContext) => {
  const { usersCollection, config } = firebaseContext;
  const state = store.getState();
  const { email, first_name, last_name, mobile_number, company_name, gst_number } = state.usersdata;

  dispatch({
    type: FETCH_ALL_USERS,
    payload: null
  });

  try {
    const secondaryAuth = getSecondaryAuth(config);
    const userCredential = await secondaryAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const newUserData = {
      uid: user.uid,
      email,
      firstname: first_name,
      lastname: last_name,
      phoneNumber: mobile_number,
      companyname: company_name,
      gstnumber: gst_number,
      usertype: 'user',
      profileStatus: true,
      status: 'active',
      isdelete: 'no',
      createDate: new Date()
    };

    await usersCollection.doc(user.uid).set(newUserData);
    await secondaryAuth.signOut();

    dispatch({
      type: ADD_USERS_SUCCESS,
      payload: 'create_success'
    });
    dispatch({
      type: USER_RESET,
      payload: null
    });
  } catch (error) {
    dispatch({
      type: ADD_USERS_FAILED,
      payload: error.code ? `${error.code}: ${error.message}` : error.message,
    });
  }
};

export const resetUserForm = () => ({ type: USER_RESET, payload: null });

export const clearUserError = () => ({ type: CLEAR_USER_ERROR, payload: null });

export const userFirstnameChange = (data) => { return { type: USER_FIRSTNAME, payload: data } };
export const userLastnameChange = (data) => { return { type: USER_LASTNAME, payload: data } };
export const userEmailChange = (data) => { return { type: USER_EMAIL, payload: data } };
export const userPhonenumberChange = (data) => { return { type: USER_MOBILENUMBER, payload: data } };
export const userCompanyNameChange = (data) => { return { type: USER_COMPANYNAME, payload: data } };
export const userGSTNumberChange = (data) => { return { type: USER_GSTNUMBER, payload: data } };

export const setEditUserDataToState = (data) => (dispatch) => {
  dispatch({ type: USER_FIRSTNAME, payload: data.firstname })
  dispatch({ type: USER_LASTNAME, payload: data.lastname })
  dispatch({ type: USER_EMAIL, payload: data.email })
  dispatch({ type: USER_MOBILENUMBER, payload: data.phoneNumber })
  dispatch({ type: USER_COMPANYNAME, payload: data.companyname })
  dispatch({ type: USER_GSTNUMBER, payload: data.gstnumber })
};

export const searchFilterFunction = (text) => {
  //passing the inserted text in textinput
  const state = store.getState();

  const newData = state.usersdata.usersMirror.filter((item) => {
    //applying filter for the inserted text in search bar

    const textName = text.toUpperCase();

    const firstname = item.firstname ? item.firstname.toUpperCase() : ''.toUpperCase();
    const lastname = item.lastname ? item.lastname.toUpperCase() : ''.toUpperCase();
    const phoneNumber = item.phoneNumber ? item.phoneNumber.toUpperCase() : ''.toUpperCase();
    const email = item.email ? item.email.toUpperCase() : ''.toUpperCase();

    return firstname.indexOf(textName) > -1 || lastname.indexOf(textName) > -1 || phoneNumber.indexOf(textName) > -1 || email.indexOf(textName) > -1;
  });

  return {
    type: USER_SEARCH_DATA, payload: {
      users: newData,
      searchtext: text
    }
  }
}

export const onDeleteUser = (uid) => (dispatch) => (firebase) => {
  const {
    usersCollection
  } = firebase;

  dispatch({
    type: FETCH_ALL_USERS,
    payload: null
  })

  usersCollection.doc(uid).update({
    isdelete: "yes"
  }).then(() => {
    dispatch({
      type: ADD_USERS_SUCCESS,
      payload: null
    });
  }).catch(error => {
    dispatch({
      type: ADD_USERS_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}

export const onUserStatusChange = (uid, status) => (dispatch) => (firebase) => {
  const {
    usersCollection
  } = firebase;

  usersCollection.doc(uid).update({
    status: status ? "active" : "deactivate"
  }).catch(error => {
    dispatch({
      type: ADD_USERS_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}
