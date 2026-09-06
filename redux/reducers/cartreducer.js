import { ADD_TO_CART_FAIL, ADD_TO_CART_SUCCESS, CLEAR_CART, CLEAR_CART_ERROR, DELETE_SAVED_ADDRESS_SUCCESS, FETCH_CART_PRODUCT, FETCH_CART_PRODUCT_FAILED, FETCH_CART_PRODUCT_SUCCESS, FETCH_SAVE_ADDRESS_FAILED, FETCH_SAVE_ADDRESS_SUCCESS, SHOW_LOADER_CART, SUBMIT_FOR_QUOTE_FAILED, SUBMIT_FOR_QUOTE_SUCCESS } from "../store/type";

export const INITIAL_STATE = {
    cart: [],
    address: [],
    loading: false,
    success: null,
    error: {
        flag: false,
        msg: null
    },
}

export const cartreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TO_CART_SUCCESS:
            return {
                ...state,
                success: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case ADD_TO_CART_FAIL:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case SHOW_LOADER_CART:
            return {
                ...state,
                loading: action.payload
            };
        case CLEAR_CART_ERROR:
            return {
                ...state,
                success: null,
                error: {
                    flag: false,
                    msg: null
                },
                loading: false
            };
        case CLEAR_CART:
            return {
                ...state,
                cart: [],
                success: null,
                error: {
                    flag: false,
                    msg: null
                },
                loading: false
            };
        case FETCH_CART_PRODUCT:
            return {
                ...state,
                success: null,
                error: {
                    flag: false,
                    msg: null
                },
                loading: false
            };
        case FETCH_CART_PRODUCT_SUCCESS:
            return {
                ...state,
                cart: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_CART_PRODUCT_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case FETCH_SAVE_ADDRESS_SUCCESS:
            return {
                ...state,
                address: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_SAVE_ADDRESS_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case DELETE_SAVED_ADDRESS_SUCCESS:
            return {
                ...state,
                success: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case SUBMIT_FOR_QUOTE_SUCCESS:
            return {
                ...state,
                success: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case SUBMIT_FOR_QUOTE_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        default:
            return state;
    }
}