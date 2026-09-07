import store from '../store/store';
import { not_logged_in } from "../../src/common/Constants";
import { ADD_PRODUCTS_FAILED, ADD_PRODUCTS_SUCCESS, ADD_USERS_FAILED, ADD_USERS_SUCCESS, CLEAR_PRODUCT_ERROR, EDIT_PRODUCTS_FAILED, EDIT_PRODUCTS_SUCCESS, FETCH_ALL_PRODUCTS, FETCH_ALL_PRODUCTS_FAILED, FETCH_ALL_PRODUCTS_SUCCESS, PRODUCT_DESC, PRODUCT_IMAGE, PRODUCT_IMAGE_BLOB, PRODUCT_QUANTITY_TYPE, PRODUCT_RESET, PRODUCT_SEARCH_DATA, PRODUCT_SEARCH_SEARCH_DATA, PRODUCT_TITLE, SHOW_LOADER_PRODUCT, USER_COMPANYNAME, USER_EMAIL, USER_FIRSTNAME, USER_GSTNUMBER, USER_LASTNAME, USER_MOBILENUMBER, USER_RESET, USER_SEARCH_DATA } from '../store/type';
import { getnumbertoken, uploadImagetoFirebase, validURL } from './Validation';

export const clearProductError = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_PRODUCT_ERROR,
    payload: null
  });
};

export const fetchProducts = (status = null) => (dispatch) => (firebase) => {
  const {
    productsCollection
  } = firebase;

  dispatch({
    type: FETCH_ALL_PRODUCTS,
    payload: null
  })

  try {
    const unsubscribe = productsCollection
      .where('isdeleted', '==', 'no')
      .onSnapshot(querySnapshot => {
        let products = []
        if (querySnapshot) {
          querySnapshot.forEach((documentSnapshot) => {
            let data = documentSnapshot.data();
            data.id = documentSnapshot.id
            if (status) {
              if (data.status === status) products.push(data)
            }
            else products.push(data)
          })
        }
        dispatch({
          type: FETCH_ALL_PRODUCTS_SUCCESS,
          payload: products
        });
      }, (error) => {
        dispatch({
          type: FETCH_ALL_PRODUCTS_FAILED,
          payload: error,
        });
      });
    return unsubscribe;
  } catch (error) {
    dispatch({
      type: FETCH_ALL_PRODUCTS_FAILED,
      payload: error,
    });
    return () => {};
  }

}

export const addProduct = () => (dispatch) => async (firebase) => {
  const {
    productsCollection,
    storage
  } = firebase;

  const state = store.getState();
  dispatch({
    type: FETCH_ALL_PRODUCTS,
    payload: null
  })
  let id = getnumbertoken(20, "")
  productsCollection.doc(id).set({
    title: state.productsdata.product_title,
    description: state.productsdata.product_desc,
    quantity_type: state.productsdata.product_quantity_type,
    created: new Date(),
    status: "active",
    isdeleted: "no"
  }).then(async () => {
    console.log('Product document created, uploading image...');
    let url = await uploadImagetoFirebase(state.productsdata.product_image, id, storage);
    console.log('Image upload result URL:', url);
    
    if (url) {
      await productsCollection.doc(id).update({
        image: url
      });
      console.log('Product image updated in Firestore');
    } else {
      console.log('Warning: Image upload failed or returned null URL');
    }
    
    dispatch({
      type: ADD_PRODUCTS_SUCCESS,
      payload: "add_success"
    });
    dispatch({
      type: PRODUCT_RESET,
      payload: null
    });
  }).catch(error => {
    console.log('Product creation error:', error);
    dispatch({
      type: ADD_PRODUCTS_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}

export const editProduct = (uid) => (dispatch) => (firebase) => {
  const {
    productsCollection,
    storage
  } = firebase;
  const state = store.getState();

  dispatch({
    type: FETCH_ALL_PRODUCTS,
    payload: null
  })

  productsCollection.doc(uid).update({
    title: state.productsdata.product_title,
    description: state.productsdata.product_desc,
    quantity_type: state.productsdata.product_quantity_type,
  }).then(async () => {
    if (state.productsdata.product_image) {
      if (!validURL(state.productsdata.product_image)) {
        let url = await uploadImagetoFirebase(state.productsdata.product_image, uid, storage);
        await productsCollection.doc(uid).update({
          image: url
        });
      }
    } else {
      await productsCollection.doc(uid).update({
        image: null
      });
    }
    dispatch({
      type: EDIT_PRODUCTS_SUCCESS,
      payload: "edit_success"
    });
    dispatch({
      type: PRODUCT_RESET,
      payload: null
    });
  }).catch(error => {
    console.log("error", error);

    dispatch({
      type: EDIT_PRODUCTS_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}

export const productTitleChange = (data) => { return { type: PRODUCT_TITLE, payload: data } };
export const productDescChange = (data) => { return { type: PRODUCT_DESC, payload: data } };
export const productQuantityTypeChange = (data) => { return { type: PRODUCT_QUANTITY_TYPE, payload: data } };
export const productImageChange = (data) => { return { type: PRODUCT_IMAGE, payload: data } };
export const productImageBlobChange = (data) => { return { type: PRODUCT_IMAGE_BLOB, payload: data } };

export const setEditProductDataToState = (data) => (dispatch) => {
  dispatch({ type: PRODUCT_TITLE, payload: data.title })
  dispatch({ type: PRODUCT_DESC, payload: data.description })
  dispatch({ type: PRODUCT_QUANTITY_TYPE, payload: data.quantity_type })
  dispatch({ type: PRODUCT_IMAGE, payload: data.image })
};

export const searchFilterFunction = (text) => {
  //passing the inserted text in textinput
  const state = store.getState();

  const newData = state.productsdata.productsMirror.filter((item) => {
    //applying filter for the inserted text in search bar

    const textName = text.toUpperCase();

    const title = item.title ? item.title.toUpperCase() : ''.toUpperCase();
    const quantity_type = item.quantity_type ? item.quantity_type.toUpperCase() : ''.toUpperCase()

    return title.indexOf(textName) > -1 || quantity_type.indexOf(textName) > -1;
  });

  return {
    type: PRODUCT_SEARCH_DATA,
    payload: {
      products: newData,
      searchtext: text
    }
  }
}

export const searchFilterFunction2 = (text) => {
  //passing the inserted text in textinput
  const state = store.getState();

  const newData = state.productsdata.productsMirror.filter((item) => {
    //applying filter for the inserted text in search bar

    const textName = text.toUpperCase();

    const title = item.title ? item.title.toUpperCase() : ''.toUpperCase();
    const quantity_type = item.quantity_type ? item.quantity_type.toUpperCase() : ''.toUpperCase()

    return title.indexOf(textName) > -1 || quantity_type.indexOf(textName) > -1;
  });

  return {
    type: PRODUCT_SEARCH_SEARCH_DATA,
    payload: {
      products: newData,
      searchtext: text
    }
  }
}

export const onDeleteProduct = (uid) => (dispatch) => (firebase) => {
  const {
    productsCollection
  } = firebase;

  dispatch({
    type: FETCH_ALL_PRODUCTS,
    payload: null
  })

  productsCollection.doc(uid).update({
    isdeleted: "yes"
  }).then(() => {
    dispatch({
      type: SHOW_LOADER_PRODUCT,
      payload: null
    });
  }).catch(error => {
    dispatch({
      type: ADD_PRODUCTS_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}

export const onProductStatusChange = (uid, status) => (dispatch) => (firebase) => {
  const {
    productsCollection
  } = firebase;

  productsCollection.doc(uid).update({
    status: status ? "active" : "deactivate"
  }).catch(error => {
    dispatch({
      type: ADD_PRODUCTS_FAILED,
      payload: error.code + ": " + error.message,
    });
  });
}