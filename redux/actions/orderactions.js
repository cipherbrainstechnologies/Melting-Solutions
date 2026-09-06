import { STATUS_ORDER_COMPLETED, STATUS_QUOTE_ACCEPT_PAYMENT, STATUS_QUOTE_CONFIRMED_PROCESSING, STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND } from '../../src/common/Constants';
import store from '../store/store';
import { ADD_TO_CART_FAIL, ADD_TO_CART_SUCCESS, CLEAR_CART_ERROR, CLEAR_ORDER_ERROR, FETCH_CART_COUNT, FETCH_CART_PRODUCT_FAILED, FETCH_CART_PRODUCT_SUCCESS, FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS, FETCH_ORDER_CONFIRM_SUCCESS, FETCH_ORDER_SUCCESS, FETCH_QUOTE_RECEIVED_SUCCESS, FETCH_QUOTE_REQUEST_FAILED, FETCH_QUOTE_REQUEST_SUCCESS, FETCH_QUOTE_SEND_SUCCESS, OPEN_CHAT_SUCCESS, ORDER_FROMDATE, ORDER_TODATE, QUOTE_CHANGE_SUCCESS, SHOW_LOADER_CART, SHOW_LOADER_ORDER, SHOW_ORDER_ERROR, SUBMIT_FOR_QUOTE_FAILED, SUBMIT_FOR_QUOTE_SUCCESS } from '../store/type';
import moment from 'moment';
import { convertDate, sendNotification } from './Validation';

export const clearOrderError = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_ORDER_ERROR,
    payload: null
  });
};

export const fetchQuoteData = (status) => (dispatch) => async (firebase) => {
  const {
    quotesCollection,
    usersCollection
  } = firebase;
  const state = store.getState();
  const usertype = state.auth.info.usertype;
  dispatch({
    type: SHOW_LOADER_ORDER,
    payload: true
  })

  var whereClauseField = 'status'
  var whereClauseCondition = '=='
  var whereClauseValue = status

  if (status == STATUS_QUOTE_CONFIRMED_PROCESSING) {
    whereClauseCondition = 'in'
    whereClauseValue = [status,STATUS_ORDER_COMPLETED]
  }

  try {
    quotesCollection
      .where(whereClauseField, whereClauseCondition, whereClauseValue)
      .onSnapshot(querySnapshot => {
        // console.log(doc._docs.length)
        let orders = []
        var itemsProcessed = 0;
        if (querySnapshot) {
          const docs = querySnapshot.docs || querySnapshot._docs || [];
          var queryLength = docs.length
          updateStateForOrderList(status, queryLength)(dispatch)

          querySnapshot.forEach(async (documentSnapshot, index) => {
            let data = documentSnapshot.data();
            data.id = documentSnapshot.id

            if (state.orderdata.fromDate && state.orderdata.toDate) {
              // console.log(new Date(state.orderdata.fromDate));
              // console.log(status, data.created);
              // console.log(moment(data.created.toDate()).format('YYYY-MM-DD'));
              // moment(new Date((data.created.seconds + data.created.nanoseconds * 10 ** -9) * 1000)).format("YYYY-MM-DD")
              
              // if (data.created.toDate() >= state.orderdata.fromDate && data.created.toDate() <= state.orderdata.toDate) {
              // if (moment(data.created.toDate()).format('YYYY-MM-DD') >= moment(state.orderdata.fromDate).format('YYYY-MM-DD') && moment(data.created.toDate()).format('YYYY-MM-DD') <= moment(state.orderdata.toDate).format('YYYY-MM-DD')) {
              if (moment(convertDate(data.created)).format('YYYY-MM-DD') >= moment(state.orderdata.fromDate).format('YYYY-MM-DD') && moment(convertDate(data.created)).format('YYYY-MM-DD') <= moment(state.orderdata.toDate).format('YYYY-MM-DD')) {
                if (usertype == "admin") {
                  var user = await usersCollection.doc(String(data.uid)).get()
                  let obj = Object.assign(user._data, data)
                  orders.push(obj)
                  itemsProcessed++;
                  // queryLength--;
                } else {
                  if (state.auth.info.uid == data.uid) {
                    orders.push(data)
                  }
                }
              } else {
                queryLength--;
              }
            } else {
              if (usertype == "admin") {
                var user = await usersCollection.doc(String(data.uid)).get()
                let obj = Object.assign(user._data || user.data(), data)
                orders.push(obj)
                itemsProcessed++;
              } else {
                if (state.auth.info.uid == data.uid) {
                  orders.push(data)
                }
              }
            }

            if (status == STATUS_QUOTE_REQUESTED) {

              if (usertype == "admin") {
                if (itemsProcessed === queryLength)
                  dispatch({
                    type: FETCH_QUOTE_REQUEST_SUCCESS,
                    payload: orders
                  });
              }
              else
                dispatch({
                  type: FETCH_QUOTE_REQUEST_SUCCESS,
                  payload: orders
                });

            } else if (status == STATUS_QUOTE_SEND) {

              if (usertype == "admin") {
                if (itemsProcessed === queryLength)
                  dispatch({
                    type: FETCH_QUOTE_SEND_SUCCESS,
                    payload: orders
                  });
              }
              else
                dispatch({
                  type: FETCH_QUOTE_RECEIVED_SUCCESS,
                  payload: orders
                });

            } else if (status == STATUS_QUOTE_ACCEPT_PAYMENT) {

              if (usertype == "admin") {
                if (itemsProcessed === queryLength)
                  dispatch({
                    type: FETCH_ORDER_SUCCESS,
                    payload: orders
                  });
              } else
                dispatch({
                  type: FETCH_ORDER_SUCCESS,
                  payload: orders
                });


            } else if (status == STATUS_QUOTE_CONFIRMED_PROCESSING) {

              if (usertype == "admin") {
                if (itemsProcessed === queryLength)
                  dispatch({
                    type: FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS,
                    payload: orders
                  });
              } else
                dispatch({
                  type: FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS,
                  payload: orders
                });

            } else if (status == STATUS_ORDER_COMPLETED) {

              if (usertype == "admin") {
                if (itemsProcessed === queryLength)
                  dispatch({
                    type: FETCH_ORDER_CONFIRM_SUCCESS,
                    payload: orders
                  });
              }
              else
                dispatch({
                  type: FETCH_ORDER_CONFIRM_SUCCESS,
                  payload: orders
                });

            }
          })


        }
      })
  } catch (error) {
    dispatch({
      type: FETCH_QUOTE_REQUEST_FAILED,
      payload: error,
    });
  }
}

const updateStateForOrderList = (status, count) => (dispatch) => {
  const state = store.getState();
  const usertype = state.auth.info.usertype;
  if (count == 0 && STATUS_QUOTE_REQUESTED == status) {
    dispatch({
      type: FETCH_QUOTE_REQUEST_SUCCESS,
      payload: []
    });
  } else if (count == 0 && STATUS_QUOTE_SEND == status) {
    if (usertype == "admin")
      dispatch({
        type: FETCH_QUOTE_SEND_SUCCESS,
        payload: []
      });
    else
      dispatch({
        type: FETCH_QUOTE_RECEIVED_SUCCESS,
        payload: []
      });
  } else if (count == 0 && STATUS_QUOTE_ACCEPT_PAYMENT == status) {
    dispatch({
      type: FETCH_ORDER_SUCCESS,
      payload: []
    });
  } else if (count == 0 && STATUS_QUOTE_CONFIRMED_PROCESSING == status) {
    dispatch({
      type: FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS,
      payload: []
    });
  } else if (count == 0 && STATUS_ORDER_COMPLETED == status) {
    dispatch({
      type: FETCH_ORDER_CONFIRM_SUCCESS,
      payload: []
    });
  }
}

export const submitForQuote = (data) => (dispatch) => (firebase) => {
  // Deprecated duplicate — use cartactionsctions.submitForQuote via FirebaseContext api.
  // Kept as a no-op redirect to avoid accidental use of the broken auto-id variant.
  const { submitForQuote: submitFromCart } = require('./cartactions');
  return submitFromCart(data)(dispatch)(firebase);
}

export const doQuoteSent = (data) => (dispatch) => (firebase) => {
  const {
    usersCollection,
    cartCollection,
    quotesCollection,
    firestore
  } = firebase;

  const state = store.getState();

  dispatch({
    type: SHOW_LOADER_ORDER,
    payload: true
  })

  data.status = STATUS_QUOTE_SEND
  data.timeline = [...data.timeline, {
    created: new Date(),
    status: STATUS_QUOTE_SEND
  }]

  quotesCollection.doc(data.id).update(data).then(async () => {

    /* Notification */
    var userRef = await usersCollection.doc(String(data.uid)).get()
    var token = (userRef._data || userRef.data() || {}).token
    sendNotification({
      token: token,
      title: "Quote received from admin ",
      body: "Quote received for order no. #" + data.id,
      data: { item: data, status: STATUS_QUOTE_SEND },
    })

    dispatch({
      type: QUOTE_CHANGE_SUCCESS,
      payload: STATUS_QUOTE_SEND
    });

  }).catch(error => {
    dispatch({
      type: SHOW_ORDER_ERROR,
      payload: error.code + ": " + error.message,
    });
  });
}

export const doQuoteAcceptAndPayment = (data) => (dispatch) => (firebase) => {
  const {
    usersCollection,
    cartCollection,
    quotesCollection,
    firestore
  } = firebase;

  const state = store.getState();
  const userdata = state.auth.info;

  dispatch({
    type: SHOW_LOADER_ORDER,
    payload: true
  })

  data.status = STATUS_QUOTE_ACCEPT_PAYMENT
  data.timeline = [...data.timeline, {
    created: new Date(),
    status: STATUS_QUOTE_ACCEPT_PAYMENT
  }]

  quotesCollection.doc(data.id).update(data).then(async () => {

    var userRef = await usersCollection
      .where('usertype', '==', "admin")
      .get()
    const docs = userRef.docs || userRef._docs || [];
    var token = (docs.length > 0) ? docs[0].data().token : null

    sendNotification({
      token: token,
      title: "Quote accepted",
      body: "Quote accepted from " + userdata.firstname + " " + userdata.lastname,
      data: { item: data, status: STATUS_QUOTE_ACCEPT_PAYMENT },
    })


    dispatch({
      type: QUOTE_CHANGE_SUCCESS,
      payload: STATUS_QUOTE_ACCEPT_PAYMENT
    });

  }).catch(error => {
    dispatch({
      type: SHOW_ORDER_ERROR,
      payload: error.code + ": " + error.message,
    });
  });
}

export const doQuoteConfirmedAndProcessing = (data) => (dispatch) => (firebase) => {
  const {
    usersCollection,
    quotesCollection,
    firestore
  } = firebase;

  const state = store.getState();

  dispatch({
    type: SHOW_LOADER_ORDER,
    payload: true
  })

  data.status = STATUS_QUOTE_CONFIRMED_PROCESSING
  data.timeline = [...data.timeline, {
    created: new Date(),
    status: STATUS_QUOTE_CONFIRMED_PROCESSING
  }]

  quotesCollection.doc(data.id).update(data).then(async () => {

    /* Notification */
    var userRef = await usersCollection.doc(String(data.uid)).get()
    var token = (userRef._data || userRef.data() || {}).token
    sendNotification({
      token: token,
      title: "Order in processing",
      body: "Your order no. #" + data.id + " is confirmed and under processing",
      data: { item: data, status: STATUS_QUOTE_CONFIRMED_PROCESSING },
    })


    dispatch({
      type: QUOTE_CHANGE_SUCCESS,
      payload: STATUS_QUOTE_CONFIRMED_PROCESSING
    });

  }).catch(error => {
    dispatch({
      type: SHOW_ORDER_ERROR,
      payload: error.code + ": " + error.message,
    });
  });
}

export const doCompleteOrder = (data) => (dispatch) => (firebase) => {
  const {
    usersCollection,
    quotesCollection,
    firestore
  } = firebase;

  const state = store.getState();

  dispatch({
    type: SHOW_LOADER_ORDER,
    payload: true
  })

  // data.status = STATUS_ORDER_COMPLETED
  // data.timeline = [...data.timeline, {
  //   created: new Date(),
  //   status: STATUS_ORDER_COMPLETED
  // }]

  var mainData = {
    status: STATUS_ORDER_COMPLETED,
    timeline: [...data.timeline, {
      created: new Date(),
      status: STATUS_ORDER_COMPLETED
    }]
  }

  quotesCollection.doc(data.id).update(mainData).then(async () => {

    /* Notification */
    var userRef = await usersCollection.doc(String(data.uid)).get()
    var token = (userRef._data || userRef.data() || {}).token
    sendNotification({
      token: token,
      title: "Order is delivered",
      body: "Your order no. #" + data.id + " is delivered",
      data: { item: data, status: STATUS_ORDER_COMPLETED },
    })

    dispatch({
      type: QUOTE_CHANGE_SUCCESS,
      payload: STATUS_ORDER_COMPLETED
    });

  }).catch(error => {
    dispatch({
      type: SHOW_ORDER_ERROR,
      payload: error.code + ": " + error.message,
    });
  });
}

export const fromDateOrderChange = (data) => { return { type: ORDER_FROMDATE, payload: data } };
export const toDateOrderChange = (data) => { return { type: ORDER_TODATE, payload: data } };

export const onChatBoardClick = (data = null) => (dispatch) => async (firebase) => {
  //data is holding Order data

  const {
    usersCollection,
    chatCollection,
    chatListCollection
  } = firebase;
  const state = store.getState();
  const userdata = state.auth.info;

  let user = data.uid; // receiver
  let receiverUserdata = null;
  //if usertype = user then receiver = admin
  if (userdata.usertype == "user") {
    var userRef = await usersCollection
      .where('usertype', '==', "admin")
      .get()
    const adminDocs = userRef.docs || userRef._docs || [];
    if (adminDocs.length > 0) {
      user = adminDocs[0].data().uid
      receiverUserdata = adminDocs[0].data()
    }
  } else {
    //if usertype = admin then receiver = user
    var userRef = await usersCollection.doc(String(data.uid)).get()
    const userData = userRef._data || userRef.data() || {};
    user = userData.uid
    receiverUserdata = userData
  }

  let currentUser = userdata.uid; // current uid
  var usersChatId = (user < currentUser ? user + '_' + currentUser : currentUser + '_' + user);
  var userChatRef = chatCollection.doc(usersChatId);
  var chatListRef = chatListCollection.doc(usersChatId);

  const isUserChatExists = await userChatRef.get();
  const isChatListExists = await chatListRef.get();

  if (!isUserChatExists.exists) {
    userChatRef.set({});
  }

  if (!isChatListExists.exists) {
    chatListRef.set({});
  }

  if (!receiverUserdata || !receiverUserdata.uid) {
    dispatch({
      type: SHOW_ORDER_ERROR,
      payload: 'Chat recipient not found. Ensure an admin user exists.',
    });
    return;
  }

  dispatch({
    type: OPEN_CHAT_SUCCESS,
    payload: { usersChatId, receiverData: receiverUserdata, orderData: data }
  });
}
