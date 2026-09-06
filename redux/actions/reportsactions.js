import { STATUS_ORDER_COMPLETED, STATUS_QUOTE_ACCEPT_PAYMENT, STATUS_QUOTE_CONFIRMED_PROCESSING, STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND } from '../../src/common/Constants';
import store from '../store/store';
import { ADD_TO_CART_FAIL, ADD_TO_CART_SUCCESS, CLEAR_CART_ERROR, CLEAR_ORDER_ERROR, CLEAR_REPORTS_ERROR, FETCH_CART_COUNT, FETCH_CART_PRODUCT_FAILED, FETCH_CART_PRODUCT_SUCCESS, FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS, FETCH_ORDER_CONFIRM_SUCCESS, FETCH_ORDER_SUCCESS, FETCH_QUOTE_RECEIVED_SUCCESS, FETCH_QUOTE_REQUEST_FAILED, FETCH_QUOTE_REQUEST_SUCCESS, FETCH_QUOTE_SEND_SUCCESS, FETCH_REPORT_FAILED, FETCH_REPORT_SUCCESS, OPEN_CHAT_SUCCESS, ORDER_FROMDATE, ORDER_TODATE, QUOTE_CHANGE_SUCCESS, REPORTS_PRODUCT_ID, SHOW_LOADER_CART, SHOW_LOADER_ORDER, SHOW_ORDER_ERROR, SUBMIT_FOR_QUOTE_FAILED, SUBMIT_FOR_QUOTE_SUCCESS } from '../store/type';
import moment from 'moment';
import { convertDate, sendNotification } from './Validation';

export const clearReportError = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_REPORTS_ERROR,
    payload: null
  });
};

export const fetchReportData = (status) => (dispatch) => async (firebase) => {
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
    whereClauseValue = [status, STATUS_ORDER_COMPLETED]
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
          // updateStateForOrderList(status, queryLength)(dispatch)

          //empty state
          dispatch({
            type: FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS,
            payload: []
          });

          querySnapshot.forEach(async (documentSnapshot, index) => {
            let data = documentSnapshot.data();
            data.id = documentSnapshot.id

            var hasproduct = false
            data.cart.map(item => {
              if (item.id == state.reportsdata.productId) {
                hasproduct = true
              }
            })

            if (state.reportsdata.fromDate && state.reportsdata.toDate) {
              if (moment(convertDate(data.created)).format('YYYY-MM-DD') >= moment(state.reportsdata.fromDate).format('YYYY-MM-DD') && moment(convertDate(data.created)).format('YYYY-MM-DD') <= moment(state.reportsdata.toDate).format('YYYY-MM-DD')) {

                if (state.reportsdata.productId != null && state.reportsdata.productId != "0") {
                  if (hasproduct) {
                    var user = await usersCollection.doc(String(data.uid)).get()
                    let obj = Object.assign(user._data, data)
                    orders.push(obj)
                    itemsProcessed++;
                  } else {
                    queryLength--;
                  }
                } else {
                  var user = await usersCollection.doc(String(data.uid)).get()
                  let obj = Object.assign(user._data || user.data(), data)
                  orders.push(obj)
                  itemsProcessed++;
                }

                // queryLength--;
              } else {
                queryLength--;
              }
            } else {
              // var user = await usersCollection.doc(String(data.uid)).get()
              // let obj = Object.assign(user._data, data)
              // orders.push(obj)
              // itemsProcessed++;

              if (state.reportsdata.productId != null && state.reportsdata.productId != "0") {
                if (hasproduct) {
                  var user = await usersCollection.doc(String(data.uid)).get()
                  let obj = Object.assign(user._data || user.data(), data)
                  orders.push(obj)
                  itemsProcessed++;
                } else {
                  queryLength--;
                }
              } else {
                var user = await usersCollection.doc(String(data.uid)).get()
                let obj = Object.assign(user._data, data)
                orders.push(obj)
                itemsProcessed++;
              }
            }
            // if (status == STATUS_QUOTE_CONFIRMED_PROCESSING) {

            //   if (itemsProcessed === queryLength)
            //     dispatch({
            //       type: FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS,
            //       payload: orders
            //     });

            // } else 
            if (status == STATUS_ORDER_COMPLETED) {

              console.log(itemsProcessed, queryLength);
              if (itemsProcessed === queryLength)
                dispatch({
                  type: FETCH_REPORT_SUCCESS,
                  payload: orders
                });
            }
          })
        }
      })
  } catch (error) {
    dispatch({
      type: FETCH_REPORT_FAILED,
      payload: error,
    });
  }
}

export const fromDateOrderChange = (data) => { return { type: ORDER_FROMDATE, payload: data } };
export const toDateOrderChange = (data) => { return { type: ORDER_TODATE, payload: data } };
export const productIdChange = (data) => { return { type: REPORTS_PRODUCT_ID, payload: data } };