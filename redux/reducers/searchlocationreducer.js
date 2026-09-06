import { CLEAR_SAVE_ADDRESS_ERROR, SAVE_ADDRESS_FAIL, SAVE_ADDRESS_SUCCESS, SHOW_LOADER_SEARCH_LOCATION, UPDATE_GPS_LOCATION } from "../store/type";

export const INITIAL_STATE = {
    location: [],
    loading: false,
    success: null,
    error: {
        flag: false,
        msg: null
    },
}

export const searchlocationreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_GPS_LOCATION:
            return {
                ...state,
                location: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case SAVE_ADDRESS_SUCCESS:
            return {
                ...state,
                success: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case SAVE_ADDRESS_FAIL:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case SHOW_LOADER_SEARCH_LOCATION:
            return {
                ...state,
                loading: action.payload
            };
        case CLEAR_SAVE_ADDRESS_ERROR:
            return {
                ...state,
                success: null,
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