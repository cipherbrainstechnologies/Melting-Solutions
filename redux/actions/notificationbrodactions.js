import store from '../store/store';
import { not_logged_in } from "../../src/common/Constants";
import { ADD_USERS_FAILED, ADD_USERS_SUCCESS, CLEAR_NB_ERROR, FETCH_ALL_USERS, FETCH_ALL_USERS_FAILED, FETCH_ALL_USERS_SUCCESS, FETCH_NB_FAILED, FETCH_NB_SUCCESS, NB_NOTIFICATION_BODY, NB_NOTIFICATION_TITLE, NB_SEND_SUCCESS, SHOW_LOADER_NB, USER_COMPANYNAME, USER_EMAIL, USER_FIRSTNAME, USER_GSTNUMBER, USER_LASTNAME, USER_MOBILENUMBER, USER_RESET, USER_SEARCH_DATA } from '../store/type';
import { sendNotification } from './Validation';

export const fetchNBUsers = () => (dispatch) => (firebase) => {
  const {
    usersCollection
  } = firebase;

  dispatch({
    type: SHOW_LOADER_NB,
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
          // Do not overwrite Firestore status; only include non-deleted users
          if (data.isdelete == 'no') users.push(data)
        })
        dispatch({
          type: FETCH_NB_SUCCESS,
          payload: users
        });
      });
  } catch (error) {
    dispatch({
      type: FETCH_NB_FAILED,
      payload: error,
    });
  }

}

export const clearNBError = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_NB_ERROR,
    payload: null
  });
};

export const sendBroadcastNotification = () => (dispatch) => (firebase) => {
  const state = store.getState();
  // console.log(state.notificationbrod.nb_notification_title);
  // console.log(state.notificationbrod.nb_notification_body);

  dispatch({
    type: SHOW_LOADER_NB,
    payload: null
  })
  
  state.notificationbrod.users.map(item => {
    if (item.token) {
      sendNotification({
        token: item.token,
        title: state.notificationbrod.nb_notification_title,
        body: state.notificationbrod.nb_notification_body,
        data: {},
      })
    }
  })

  dispatch({
    type: NB_SEND_SUCCESS,
    payload: null
  });

};



export const nbTitleChange = (data) => { return { type: NB_NOTIFICATION_TITLE, payload: data } };
export const nbBodyChange = (data) => { return { type: NB_NOTIFICATION_BODY, payload: data } };


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
