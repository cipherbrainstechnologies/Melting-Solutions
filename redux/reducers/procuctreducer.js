import { ADD_PRODUCTS_FAILED, ADD_PRODUCTS_SUCCESS, CLEAR_PRODUCT_ERROR, EDIT_PRODUCTS_FAILED, EDIT_PRODUCTS_SUCCESS, FETCH_ALL_PRODUCTS, FETCH_ALL_PRODUCTS_FAILED, FETCH_ALL_PRODUCTS_SUCCESS, FETCH_CART_COUNT, PRODUCT_DESC, PRODUCT_IMAGE, PRODUCT_IMAGE_BLOB, PRODUCT_QUANTITY_TYPE, PRODUCT_RESET, PRODUCT_SEARCH_DATA, PRODUCT_SEARCH_SEARCH_DATA, PRODUCT_TITLE, SHOW_LOADER_PRODUCT } from "../store/type";

export const INITIAL_STATE = {
    products: null,
    productsMirror: null,
    searchProducts: null,
    loading: false,
    cartCount: 0,
    error: {
        flag: false,
        msg: null
    },
    success: null,
    success_status: null,
    searchtext: "",
    product_title: "",
    product_desc: "",
    product_quantity_type: "",
    product_image: null,
    product_image_blob: null
}

export const procuctreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_ALL_PRODUCTS:
            return {
                ...state,
                loading: true
            };
        case CLEAR_PRODUCT_ERROR:
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
        case FETCH_ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: action.payload,
                productsMirror: action.payload,
                searchProducts: action.payload,
                loading: false,
                error: {
                    flag: false,
                    msg: null
                },
            };
        case FETCH_ALL_PRODUCTS_FAILED:
            return {
                ...state,
                products: null,
                productsMirror: null,
                searchProducts: null,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case PRODUCT_RESET:
            return {
                ...state,
                product_title: "",
                product_desc: "",
                product_quantity_type: "",
                product_image: null,
                product_image_blob: null,
                loading: false,
            };
        case ADD_PRODUCTS_SUCCESS:
            return {
                ...state,
                success: "success",
                success_status: action.payload,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case ADD_PRODUCTS_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case EDIT_PRODUCTS_SUCCESS:
            return {
                ...state,
                success: "success",
                success_status: action.payload,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case EDIT_PRODUCTS_FAILED:
            return {
                ...state,
                loading: false,
                error: {
                    flag: true,
                    msg: action.payload
                }
            };
        case PRODUCT_TITLE:
            return {
                ...state,
                product_title: action.payload
            };
        case PRODUCT_DESC:
            return {
                ...state,
                product_desc: action.payload
            };
        case PRODUCT_QUANTITY_TYPE:
            return {
                ...state,
                product_quantity_type: action.payload
            };
        case PRODUCT_IMAGE:
            return {
                ...state,
                product_image: action.payload
            };
        case PRODUCT_IMAGE_BLOB:
            return {
                ...state,
                product_image_blob: action.payload
            };
        case SHOW_LOADER_PRODUCT:
            return {
                ...state,
                loading: false
            };
        case PRODUCT_SEARCH_DATA:
            return {
                ...state,
                products: action.payload.users,
                searchtext: action.payload.searchtext
            };
        case PRODUCT_SEARCH_SEARCH_DATA:
            return {
                ...state,
                searchProducts: action.payload.users,
                searchtext: action.payload.searchtext
            };
        case FETCH_CART_COUNT:
            return {
                ...state,
                cartCount: action.payload
            };
        default:
            return state;
    }
}