import store from '../store/store';
import { not_logged_in, STATUS_ORDER_COMPLETED, STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND } from "../../src/common/Constants";
import { ADD_PRODUCTS_FAILED, ADD_PRODUCTS_SUCCESS, ADD_USERS_FAILED, ADD_USERS_SUCCESS, CLEAR_PRODUCT_ERROR, EDIT_PRODUCTS_FAILED, EDIT_PRODUCTS_SUCCESS, FETCH_ALL_PRODUCTS, FETCH_ALL_PRODUCTS_FAILED, FETCH_ALL_PRODUCTS_SUCCESS, FETCH_TOTAL_COMPLETE_ORDER, FETCH_TOTAL_PRODUCTS, FETCH_TOTAL_RECEIVED_QUOTES, FETCH_TOTAL_SEND_QUOTES, FETCH_TOTAL_USERS, PRODUCT_DESC, PRODUCT_IMAGE, PRODUCT_IMAGE_BLOB, PRODUCT_QUANTITY_TYPE, PRODUCT_RESET, PRODUCT_SEARCH_DATA, PRODUCT_TITLE, SHOW_LOADER_HOME, SHOW_LOADER_PRODUCT, USER_COMPANYNAME, USER_EMAIL, USER_FIRSTNAME, USER_GSTNUMBER, USER_LASTNAME, USER_MOBILENUMBER, USER_RESET, USER_SEARCH_DATA } from '../store/type';
import { getnumbertoken, uploadImagetoFirebase, validURL } from './Validation';


export const fetchTotalUsersCount = (status = null) => (dispatch) => (firebase) => {
  const {
    usersCollection
  } = firebase;

  dispatch({
    type: SHOW_LOADER_HOME,
    payload: null
  })

  try {
    usersCollection
      .where('usertype', '!=', "admin")
      .onSnapshot(querySnapshot => {
        let users = 0
        if (querySnapshot) {
          querySnapshot.forEach(documentSnapshot => {
            let data = documentSnapshot.data();
            if (data.isdelete == 'no') users++
          })
        }
        dispatch({
          type: FETCH_TOTAL_USERS,
          payload: users
        });
      });
  } catch (error) {
    console.log("fetchTotalUsersCount", error);
    // dispatch({
    //   type: FETCH_ALL_USERS_FAILED,
    //   payload: error,
    // });
  }
}

export const fetchTotalProductCount = (status = null) => (dispatch) => (firebase) => {
  const {
    productsCollection
  } = firebase;

  dispatch({
    type: SHOW_LOADER_HOME,
    payload: null
  })

  try {
    productsCollection
      .where('isdeleted', '==', 'no')
      .onSnapshot(querySnapshot => {
        let products = 0
        if (querySnapshot) {
          querySnapshot.forEach((documentSnapshot) => {
            products++
          })
        }
        dispatch({
          type: FETCH_TOTAL_PRODUCTS,
          payload: products
        });
      });
  } catch (error) {
    console.log("fetchTotalProductCount", error);
  }
}

export const fetchTotalQuoteCount = (status) => (dispatch) => async (firebase) => {
  const {
    quotesCollection,
  } = firebase;
  dispatch({
    type: SHOW_LOADER_HOME,
    payload: true
  })

  try {
    quotesCollection
      .where('status', '==', status)
      .onSnapshot(querySnapshot => {
        let orders = 0
        if (querySnapshot) {
          querySnapshot.forEach(async (documentSnapshot, index) => {
            orders++
          })
        }
        if (status == STATUS_QUOTE_REQUESTED) {
          dispatch({
            type: FETCH_TOTAL_RECEIVED_QUOTES,
            payload: orders
          });
        } else if (status == STATUS_QUOTE_SEND) {
          dispatch({
            type: FETCH_TOTAL_SEND_QUOTES,
            payload: orders
          });
        } else if (status == STATUS_ORDER_COMPLETED) {
          dispatch({
            type: FETCH_TOTAL_COMPLETE_ORDER,
            payload: orders
          });
        }
      })
  } catch (error) {
    console.log("fetchTotalQuoteCount", error);
  }
}
