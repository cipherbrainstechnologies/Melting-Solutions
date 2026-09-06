import store from '../store/store';
import { CLEAR_SAVE_ADDRESS_ERROR, DELETE_SAVED_ADDRESS_SUCCESS, FETCH_SAVE_ADDRESS_FAILED, FETCH_SAVE_ADDRESS_SUCCESS, SAVE_ADDRESS_FAIL, SAVE_ADDRESS_SUCCESS, SHOW_LOADER_CART, SHOW_LOADER_SEARCH_LOCATION } from '../store/type';

export const saveAddress = (data) => (dispatch) => (firebase) => {
  const {
    usersCollection,
    FieldValue
  } = firebase;
  const state = store.getState();

  dispatch({
    type: SHOW_LOADER_SEARCH_LOCATION,
    payload: true
  })

  usersCollection.doc(state.auth.info.uid).update({
    address: FieldValue.arrayUnion(data)
  }).then(async () => {
    dispatch({
      type: SAVE_ADDRESS_SUCCESS,
      payload: "success"
    });

  }).catch(error => {
    dispatch({
      type: SAVE_ADDRESS_FAIL,
      payload: error.code + ": " + error.message,
    });
  });
}

export const fetchSavedAddress = () => (dispatch) => async (firebase) => {
  const {
    usersCollection
  } = firebase;
  const state = store.getState();

  dispatch({
    type: SHOW_LOADER_CART,
    payload: true
  })

  try {
    usersCollection.doc(String(state.auth.info.uid))
      .onSnapshot(snapshot => {
        const data = snapshot._data || snapshot.data();
        dispatch({
          type: FETCH_SAVE_ADDRESS_SUCCESS,
          payload: data ? data.address : null
        });
      })
  } catch (error) {
    dispatch({
      type: FETCH_SAVE_ADDRESS_FAILED,
      payload: error,
    });
  }
}

export const deleteSavedAddress = (index) => (dispatch) => async (firebase) => {
  const {
    usersCollection,
    FieldValue
  } = firebase;
  const state = store.getState();

  dispatch({
    type: SHOW_LOADER_CART,
    payload: true
  })

  try {
    usersCollection.doc(String(state.auth.info.uid))
      .update({ address: FieldValue.arrayRemove(index) })
      .then(() => {
        console.log("Document successfully updated!");
        // dispatch({
        //   type: DELETE_SAVED_ADDRESS_SUCCESS,
        //   payload: "success"
        // })
        dispatch({
          type: SHOW_LOADER_CART,
          payload: false
        })
      }).catch((error) => {
        console.log(error);
        dispatch({
          type: SHOW_LOADER_CART,
          payload: false
        })
      });
  } catch (error) {
    // dispatch({
    //   type: FETCH_SAVE_ADDRESS_FAILED,
    //   payload: error,
    // });
    console.log(error);
  }
}

// Selection is handled in local UI state (Cart.js). Do not mutate saved addresses.
export const selectSavedAddress = (obj) => (dispatch) => async (firebase) => {
  dispatch({
    type: SHOW_LOADER_CART,
    payload: false
  });
  return obj;
}

export const clearSaveAddressError = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_SAVE_ADDRESS_ERROR,
    payload: null
  });
};
