import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { authreducer as auth } from "../reducers/authreducer";
import { homereducer as homedata } from "../reducers/homereducer";
import { usersreducer as usersdata } from "../reducers/usersreducer";
import { procuctreducer as productsdata } from "../reducers/procuctreducer";
import { cartreducer as cartdata } from "../reducers/cartreducer";
import { searchlocationreducer as gpsdata } from "../reducers/searchlocationreducer";
import { orderreducer as orderdata } from "../reducers/orderreducer";
import { notificationbrodreducer as notificationbrod } from "../reducers/notificationbrodreducer";
import { chatreducer as chatdata } from "../reducers/chatreducer";
import { reportsreducer as reportsdata } from "../reducers/reportsreducer";

const reducers = combineReducers({
    auth,
    homedata,
    usersdata,
    productsdata,
    cartdata,
    gpsdata,
    orderdata,
    chatdata,
    notificationbrod,
    reportsdata
})

let middleware = [thunk];

export default createStore(reducers, {}, applyMiddleware(...middleware));