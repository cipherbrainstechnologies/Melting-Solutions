import { CLEAR_ORDER_ERROR, FETCH_ORDER_CONFIRMED_PROCESSING_FAILED, FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS, FETCH_ORDER_CONFIRM_FAILED, FETCH_ORDER_CONFIRM_SUCCESS, FETCH_ORDER_FAILED, FETCH_ORDER_SUCCESS, FETCH_QUOTE_RECEIVED_FAILED, FETCH_QUOTE_RECEIVED_SUCCESS, FETCH_QUOTE_REQUEST_FAILED, FETCH_QUOTE_REQUEST_SUCCESS, FETCH_QUOTE_SEND_FAILED, FETCH_QUOTE_SEND_SUCCESS, FETCH_REPORT_FAILED, FETCH_REPORT_SUCCESS, OPEN_CHAT_SUCCESS, ORDER_FROMDATE, ORDER_TODATE, QUOTE_CHANGE_SUCCESS, REPORTS_PRODUCT_ID, SHOW_LOADER_ORDER, SHOW_ORDER_ERROR } from "../store/type";

export const INITIAL_STATE = {
    order_confirm: [],
    loading: false,
    success: null,
    success_status: null,
    fromDate: null,
    toDate: null,
    productId: null,
    data: null,
    error: {
        flag: false,
        msg: null
    },
}

export const reportsreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHOW_LOADER_ORDER:
            return {
                ...state,
                loading: action.payload
            };
        case CLEAR_ORDER_ERROR:
            return {
                ...state,
                success: null,
                success_status: null,
                data: null,
                error: {
                    flag: false,
                    msg: null
                },
                loading: false
            };
        case SHOW_ORDER_ERROR:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case QUOTE_CHANGE_SUCCESS:
            return {
                ...state,
                success: "success",
                success_status: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_REPORT_SUCCESS:
            return {
                ...state,
                order_confirm: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_REPORT_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case ORDER_FROMDATE:
            return {
                ...state,
                fromDate: action.payload
            };
        case ORDER_TODATE:
            return {
                ...state,
                toDate: action.payload
            };
        case REPORTS_PRODUCT_ID:
            return {
                ...state,
                productId: action.payload
            };
        case OPEN_CHAT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: "success",
                success_status: "chat",
                data: action.payload,
                error: {
                    flag: false,
                    msg: null
                }
            };
        default:
            return state;
    }
}