import { STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND } from '../../src/common/Constants';
import store from '../store/store';
import { ADD_TO_CART_FAIL, ADD_TO_CART_SUCCESS, CLEAR_CART_ERROR, FETCH_CART_COUNT, FETCH_CART_PRODUCT_FAILED, FETCH_CART_PRODUCT_SUCCESS, SHOW_LOADER_CART, SHOW_ORDER_ERROR, SUBMIT_FOR_QUOTE_FAILED, SUBMIT_FOR_QUOTE_SUCCESS } from '../store/type';
import { getordernumber, sendNotification } from './Validation';

export const addToCart = (data) => (dispatch) => (firebase) => {
  const {
    cartCollection
  } = firebase;
  const state = store.getState();
  dispatch({
    type: SHOW_LOADER_CART,
    payload: true
  })

  cartCollection.doc(state.auth.info.uid).collection('products').doc(data.id).set(data).then(async () => {
    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: "success"
    });

  }).catch(error => {
    dispatch({
      type: ADD_TO_CART_FAIL,
      payload: error.code + ": " + error.message,
    });
  });
}

export const clearCartError = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_CART_ERROR,
    payload: null
  });
};

export const fetchCartCount = () => (dispatch) => async (firebase) => {
  const {
    cartCollection
  } = firebase;
  const state = store.getState();

  try {
    cartCollection.doc(String(state.auth.info.uid))
      .collection('products')
      .onSnapshot(snapshot => {
        dispatch({
          type: FETCH_CART_COUNT,
          payload: snapshot ? (snapshot.docs || snapshot._docs || []).length : 0
        });
      })
  } catch (error) {
    // dispatch({
    //   type: FETCH_ALL_PRODUCTS_FAILED,
    //   payload: error,
    // });
    console.log("error", error);
  }
}

export const fetchCarts = () => (dispatch) => async (firebase) => {
  const {
    cartCollection,
    productsCollection
  } = firebase;
  const state = store.getState();

  try {
    cartCollection.doc(String(state.auth.info.uid))
      .collection('products')
      .onSnapshot(querySnapshot => {
        let carts = []
        var itemsProcessed = 0;
        if (querySnapshot) {
          const totalDocs = (querySnapshot.docs || querySnapshot._docs || []).length;
          if (totalDocs === 0) {
            dispatch({
              type: FETCH_CART_PRODUCT_SUCCESS,
              payload: []
            });
            return;
          }
          querySnapshot.forEach(async (documentSnapshot, index) => {
            let data = documentSnapshot.data();
            var product = await productsCollection.doc(String(data.id)).get()
            let obj = Object.assign(product._data || product.data() || {}, data)
            carts.push(obj)
            itemsProcessed++;
            if (itemsProcessed === totalDocs) {
              dispatch({
                type: FETCH_CART_PRODUCT_SUCCESS,
                payload: carts
              });
            }
          })
        }
      })
  } catch (error) {
    dispatch({
      type: FETCH_CART_PRODUCT_FAILED,
      payload: error,
    });
  }
}

export const submitForQuote = (data) => (dispatch) => (firebase) => {
  const {
    usersCollection,
    cartCollection,
    quotesCollection,
    firestore
  } = firebase;

  const state = store.getState();
  const userdata = state.auth.info;

  let batch = firestore.batch();

  dispatch({
    type: SHOW_LOADER_CART,
    payload: true
  })

  data.uid = state.auth.info.uid
  data.isdeleted = "no"
  data.status = STATUS_QUOTE_REQUESTED
  data.created = new Date()
  data.timeline = [{
    created: new Date(),
    status: STATUS_QUOTE_REQUESTED
  }]

  //id will create unique orderid
  let id = getordernumber()

  data.id = id

  quotesCollection.doc(id).set(data).then(async () => {
    cartCollection.doc(String(state.auth.info.uid))
      .collection('products')
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        batch.commit();
      })

    var userRef = await usersCollection
      .where('usertype', '==', "admin")
      .get()
    var docs = userRef.docs || userRef._docs || [];
    var token = (docs.length > 0) ? docs[0].data().token : null

    sendNotification({
      token: token,
      title: "Received new quote request",
      body: "Received quote request from " + userdata.firstname + " " + userdata.lastname,
      data: {
        item: data,
        status: STATUS_QUOTE_REQUESTED
      },
    })
    dispatch({
      type: SUBMIT_FOR_QUOTE_SUCCESS,
      payload: "success"
    });

  }).catch(error => {
    dispatch({
      type: SUBMIT_FOR_QUOTE_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}