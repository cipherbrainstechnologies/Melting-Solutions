import { CLEAR_LOGIN_ERROR, FETCH_USER, FETCH_USER_FAILED, FETCH_USER_SUCCESS, LOGIN_EMAIL, LOGIN_PASSWORD, EMAIL_SIGN_IN, EMAIL_SIGN_IN_SUCCESS, EMAIL_SIGN_IN_FAILED, EMAIL_REGISTER, EMAIL_REGISTER_SUCCESS, EMAIL_REGISTER_FAILED, SEND_RESET_EMAIL, SEND_RESET_EMAIL_SUCCESS, SEND_RESET_EMAIL_FAILED, NEW_USER_PROFILE_ROUTE, SHOW_LOADER_LOGIN, UPDATE_USER_PROFILE, UPDATE_USER_PROFILE_FAILED, USER_NOT_REGISTERED, USER_SIGN_IN, USER_SIGN_IN_FAILED, USER_SIGN_OUT } from "../store/type";


const INITIAL_STATE = {
    info: null,
    loading: false,
    email: "",
    password: "",
    error: {
        flag: false,
        msg: null
    },
    success: ""
}

export const authreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_EMAIL:
            return {
                ...state,
                email: action.payload
            };
        case LOGIN_PASSWORD:
            return {
                ...state,
                password: action.payload
            };
        case EMAIL_SIGN_IN:
            return {
                ...state,
                loading: true
            };
        case EMAIL_SIGN_IN_SUCCESS:
            return {
                ...state,
                loading: false,
                error: { flag: false, msg: null }
            };
        case EMAIL_SIGN_IN_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case EMAIL_REGISTER:
            return {
                ...state,
                loading: true
            };
        case EMAIL_REGISTER_SUCCESS:
            return {
                ...state,
                info: action.payload,
                loading: false,
                error: { flag: false, msg: null }
            };
        case EMAIL_REGISTER_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case SEND_RESET_EMAIL:
            return {
                ...state,
                loading: true
            };
        case SEND_RESET_EMAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                error: { flag: false, msg: null },
                success: 'reset_sent'
            };
        case SEND_RESET_EMAIL_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case SHOW_LOADER_LOGIN:
            return { ...state, loading: action.payload }
        case USER_SIGN_IN:
            return {
                ...state,
                loading: true
            };
        case USER_SIGN_IN_FAILED:
            return {
                ...state,
                info: null,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case USER_SIGN_OUT:
            return INITIAL_STATE;
        case FETCH_USER:
            return {
                ...state,
                loading: true
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                info: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
                email: "",
                password: ""
            };
        case USER_NOT_REGISTERED:
            return {
                ...state,
                info: action.payload,
                verificationId: null,
                loading: false
            };
        case FETCH_USER_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                },
                info: null
            };
        case NEW_USER_PROFILE_ROUTE:
            return {
                ...state,
                info: { ...state.info, ...action.payload },
                loading: false,
                success: "success"
            };
        case UPDATE_USER_PROFILE:
            return {
                ...state,
                info: { ...state.info, ...action.payload },
                loading: false,
                success: ""
            };
        case UPDATE_USER_PROFILE_FAILED:
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
};