import { CLEAR_ORDER_ERROR, FETCH_ORDER_CONFIRMED_PROCESSING_FAILED, FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS, FETCH_ORDER_CONFIRM_FAILED, FETCH_ORDER_CONFIRM_SUCCESS, FETCH_ORDER_FAILED, FETCH_ORDER_SUCCESS, FETCH_QUOTE_RECEIVED_FAILED, FETCH_QUOTE_RECEIVED_SUCCESS, FETCH_QUOTE_REQUEST_FAILED, FETCH_QUOTE_REQUEST_SUCCESS, FETCH_QUOTE_SEND_FAILED, FETCH_QUOTE_SEND_SUCCESS, OPEN_CHAT_SUCCESS, ORDER_FROMDATE, ORDER_TODATE, QUOTE_CHANGE_SUCCESS, SHOW_LOADER_ORDER, SHOW_ORDER_ERROR } from "../store/type";

export const INITIAL_STATE = {
    quote_request: [],
    quote_send: [],
    quote_received: [],
    order: [],
    order_confirm: [],
    loading: false,
    success: null,
    success_status: null,
    fromDate: null,
    toDate: null,
    data: null,
    error: {
        flag: false,
        msg: null
    },
}

export const orderreducer = (state = INITIAL_STATE, action) => {
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
        case FETCH_QUOTE_REQUEST_SUCCESS:
            return {
                ...state,
                quote_request: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_QUOTE_REQUEST_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case FETCH_QUOTE_SEND_SUCCESS:
            return {
                ...state,
                quote_send: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_QUOTE_SEND_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case FETCH_QUOTE_RECEIVED_SUCCESS:
            return {
                ...state,
                quote_received: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_QUOTE_RECEIVED_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case FETCH_ORDER_SUCCESS:
            return {
                ...state,
                order: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_ORDER_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS:
            return {
                ...state,
                order_confirm: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_ORDER_CONFIRMED_PROCESSING_FAILED:
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