import { FETCH_TOTAL_COMPLETE_ORDER, FETCH_TOTAL_PRODUCTS, FETCH_TOTAL_RECEIVED_QUOTES, FETCH_TOTAL_REPORTS, FETCH_TOTAL_SEND_QUOTES, FETCH_TOTAL_USERS, SHOW_LOADER_HOME } from "../store/type";

export const INITIAL_STATE = {
    totalUsers: 0,
    totalProducts: 0,
    totalReceivedQuotes: 0,
    totalSendQuotes: 0,
    totalCompleteOrders: 0,
    totalReport: 0,
    loading: false,
    error: {
        flag: false,
        msg: null
    },
    success: null,
    success_status: null,
}

export const homereducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHOW_LOADER_HOME:
            return {
                ...state,
                loading: true
            };
        case FETCH_TOTAL_USERS:
            return {
                ...state,
                totalUsers: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_TOTAL_PRODUCTS:
            return {
                ...state,
                totalProducts: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_TOTAL_RECEIVED_QUOTES:
            return {
                ...state,
                totalReceivedQuotes: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_TOTAL_SEND_QUOTES:
            return {
                ...state,
                totalSendQuotes: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_TOTAL_COMPLETE_ORDER:
            return {
                ...state,
                totalCompleteOrders: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_TOTAL_REPORTS:
            return {
                ...state,
                totalReport: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        default:
            return state;
    }
}