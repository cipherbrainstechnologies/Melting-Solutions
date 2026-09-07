import { Toast } from 'native-base';
import { colors } from '../../src/common/theme';

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const checkDecimal = (num = 0) => {
  return num % 1 != 0;
}

export const showToastError = (msg) => {

  Toast.show({
    title: msg,
    type: 'danger',
    duration: 3000,
    style: {
      backgroundColor: colors.RED,
      // borderColor: "#fff",
      // borderWidth: 0.7
    },
  });
}

export const showToastSuccess = (msg) => {

  Toast.show({
    title: msg,
    type: 'danger',
    duration: 3000,
    style: {
      backgroundColor: colors.GREEN,
      // borderColor: "#fff",
      // borderWidth: 0.7
    }
  });
}


export const validateEmail = (str) => {
  var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(str);
}
export const validatePhonenumber = (str) => {
  var pattern = /(0|91)?[7-9][0-9]{9}/;
  return pattern.test(str);
}

export const getordernumber = () => {
  return `MS${new Date().getFullYear()}${("0" + (new Date().getMonth() + 1)).slice(-2)}${getnumbertoken("5", "number")}`
}

export const getnumbertoken = (length, stringType) => {
  var result = '', characters = '';
  if (stringType == "number") {
    characters = '0123456789';
  } else {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

export const uploadImagetoFirebase = async (path, id, firebaseStorage) => {
  try {
    console.log('Starting image upload for:', id, 'from path:', path);
    
    // Create reference to Firebase Storage - use ref() directly with full path
    const storageRef = firebaseStorage.ref(`images/products/${id}`);
    console.log('Storage ref created');
    
    // For React Native, we need to convert the local URI to a blob
    // Use XMLHttpRequest instead of fetch for better React Native compatibility
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        console.log('XHR error occurred');
        reject(new Error('Failed to fetch image'));
      };
      xhr.onabort = function() {
        console.log('XHR aborted');
        reject(new Error('Image fetch aborted'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', path);
      xhr.send();
    });
    
    console.log('Blob created successfully, size:', blob.size);
    
    // Upload the blob using put() method
    console.log('Starting upload...');
    const uploadTask = storageRef.put(blob);
    
    // Wait for upload to complete
    await new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress + '%');
        },
        (error) => {
          console.log('Upload error:', error);
          reject(error);
        },
        () => {
          console.log('Upload complete successfully');
          resolve();
        }
      );
    });
    
    // Get download URL
    const downloadURL = await storageRef.getDownloadURL();
    console.log('Download URL obtained:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.log("Image upload error:", error);
    console.error("Full error details:", error.message, error.stack);
    return null;
  }
}

export const sendNotification = async (data) => {
  if (!data || !data.token) {
    console.log('sendNotification skipped: missing Expo push token');
    return;
  }

  // Expo/Android FCM requires all `data` values to be strings
  const normalizedData = {};
  const raw = data.data || {};
  Object.keys(raw).forEach((key) => {
    const value = raw[key];
    if (value === undefined || value === null) return;
    normalizedData[key] = typeof value === 'string' ? value : JSON.stringify(value);
  });

  const message = {
    to: data.token,
    sound: "default",
    title: data.title,
    body: data.body,
    data: normalizedData,
    priority: 'high',
    channelId: 'default',
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    const result = await response.json().catch(() => null);
    if (result?.data?.status === 'error' || result?.errors) {
      console.log('Expo push error:', JSON.stringify(result));
    }
  } catch (e) {
    console.log(e);
  }
}

export const validURL = string => {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(string);
}

export const convertDate = (date) => {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (typeof date.toDate === 'function') return date.toDate();
  if (date.seconds !== undefined) {
    return new Date((date.seconds + date.nanoseconds * 10 ** -9) * 1000);
  }
  if (typeof date === 'string' || typeof date === 'number') {
    return new Date(date);
  }
  return null;
};

export const toJsDate = (value) => convertDate(value);

export const formatFirestoreDate = (value, format = 'D MMMM YYYY') => {
  const date = toJsDate(value);
  if (!date || Number.isNaN(date.getTime())) return '—';
  const moment = require('moment');
  return moment(date).format(format);
};

export const STATUS = [
  {
    status: 'Order Placed',
    icon: require('../../assets/order-placed-status-icon.png')
  },
  {
    status: 'Order Send',
    icon: require('../../assets/order-send.png')
  },
  {
    status: 'Order Accept and Payment',
    icon: require('../../assets/order-accept-payment.png')
  },
  {
    status: 'Order Confirmed',
    icon: require('../../assets/order-confirmed-status-icon.png')
  },
  {
    status: 'Order Processing',
    icon: require('../../assets/order-processing-status-icon.png')
  },
  {
    status: 'On The Way',
    icon: require('../../assets/ontheway-status-icon.png')
  },
  {
    status: 'Delivered',
    icon: require('../../assets/delivered-status-icon.png')
  },
]