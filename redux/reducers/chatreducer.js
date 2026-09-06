import { ADD_CHATBOARD_DATA, CLEAR_CHATBOARD_DATA, CLEAR_CHAT_ERROR, CLEAR_ORDER_ERROR, FETCH_ORDER_CONFIRMED_PROCESSING_FAILED, FETCH_ORDER_CONFIRMED_PROCESSING_SUCCESS, FETCH_ORDER_CONFIRM_FAILED, FETCH_ORDER_CONFIRM_SUCCESS, FETCH_ORDER_FAILED, FETCH_ORDER_SUCCESS, FETCH_QUOTE_RECEIVED_FAILED, FETCH_QUOTE_RECEIVED_SUCCESS, FETCH_QUOTE_REQUEST_FAILED, FETCH_QUOTE_REQUEST_SUCCESS, FETCH_QUOTE_SEND_FAILED, FETCH_QUOTE_SEND_SUCCESS, ORDER_FROMDATE, ORDER_TODATE, QUOTE_CHANGE_SUCCESS, SHOW_LOADER_CHAT, SHOW_LOADER_ORDER, SHOW_ORDER_ERROR } from "../store/type";

export const INITIAL_STATE = {
    loading: false,
    success: null,
    success_status: null,
    chatBoardData: null,
    error: {
        flag: false,
        msg: null
    },
}

export const chatreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHOW_LOADER_CHAT:
            return {
                ...state,
                loading: action.payload
            };
        case CLEAR_CHAT_ERROR:
            return {
                ...state,
                success: null,
                error: {
                    flag: false,
                    msg: null
                },
                loading: false
            };
        case ADD_CHATBOARD_DATA:
            return {
                ...state,
                chatBoardData: action.payload,
                error: {
                    flag: false,
                    msg: null
                },
                loading: false
            };
        case CLEAR_CHATBOARD_DATA:
            return {
                ...state,
                chatBoardData: null,
                error: {
                    flag: false,
                    msg: null
                },
                loading: false
            };

        default:
            return state;
    }
}