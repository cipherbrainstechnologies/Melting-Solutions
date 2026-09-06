import { ADD_USERS_DATA, ADD_USERS_FAILED, ADD_USERS_SUCCESS, FETCH_ALL_USERS, FETCH_ALL_USERS_FAILED, FETCH_ALL_USERS_SUCCESS, USER_COMPANYNAME, USER_EMAIL, USER_FIRSTNAME, USER_GSTNUMBER, USER_LASTNAME, USER_MOBILENUMBER, USER_RESET, USER_SEARCH_DATA } from "../store/type";

export const INITIAL_STATE = {
    users: null,
    usersMirror: null,
    loading: false,
    error: {
        flag: false,
        msg: null
    },
    searchtext: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    company_name: "",
    gst_number: "",
}

export const usersreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_ALL_USERS:
            return {
                ...state,
                loading: true
            };
        case FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload,
                usersMirror: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_ALL_USERS_FAILED:
            return {
                ...state,
                users: null,
                usersMirror: null,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case ADD_USERS_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case ADD_USERS_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        // case ADD_USERS_DATA:
        //     return {
        //         ...state,
        //         userData: {action.payload}
        //     };
        case USER_RESET:
            return {
                ...state,
                first_name: "",
                last_name: "",
                email: "",
                mobile_number: "",
                company_name: "",
                gst_number: "",
                loading: false,
            };
        case USER_FIRSTNAME:
            return {
                ...state,
                first_name: action.payload
            };
        case USER_LASTNAME:
            return {
                ...state,
                last_name: action.payload
            };
        case USER_EMAIL:
            return {
                ...state,
                email: action.payload
            };
        case USER_MOBILENUMBER:
            return {
                ...state,
                mobile_number: action.payload
            };
        case USER_COMPANYNAME:
            return {
                ...state,
                company_name: action.payload
            };
        case USER_GSTNUMBER:
            return {
                ...state,
                gst_number: action.payload
            };
        case USER_SEARCH_DATA:
            return {
                ...state,
                users: action.payload.users,
                searchtext: action.payload.searchtext
            };
        default:
            return state;
    }
}