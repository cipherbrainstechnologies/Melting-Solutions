import { CLEAR_NB_ERROR, FETCH_NB_FAILED, FETCH_NB_SUCCESS, NB_NOTIFICATION_BODY, NB_NOTIFICATION_TITLE, NB_SEND_SUCCESS, SHOW_LOADER_NB, SHOW_NB_ERROR, UPDATE_NB_USER } from "../store/type";

export const INITIAL_STATE = {
    users: [],
    loading: false,
    success: null,
    success_status: null,
    error: {
        flag: false,
        msg: null
    },
    nb_notification_title: null,
    nb_notification_body: null
}

export const notificationbrodreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHOW_LOADER_NB:
            return {
                ...state,
                loading: action.payload
            };
        case CLEAR_NB_ERROR:
            return {
                ...state,
                success: null,
                success_status: null,
                error: {
                    flag: false,
                    msg: null
                },
                loading: false
            };
        case SHOW_NB_ERROR:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case FETCH_NB_SUCCESS:
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_NB_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };

        case UPDATE_NB_USER:
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case NB_NOTIFICATION_TITLE:
            return {
                ...state,
                nb_notification_title: action.payload
            };
        case NB_NOTIFICATION_BODY:
            return {
                ...state,
                nb_notification_body: action.payload
            };
        case NB_SEND_SUCCESS:
            return {
                ...state,
                success: "success",
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
                nb_notification_title: null,
                nb_notification_body: null,
            };
        default:
            return state;
    }
}