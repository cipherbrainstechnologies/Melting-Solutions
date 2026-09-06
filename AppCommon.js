import { useContext, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FirebaseContext } from './redux';
import NavigationService from './src/navigation/NavigationService';
import {
  STATUS_ORDER_COMPLETED,
  STATUS_QUOTE_ACCEPT_PAYMENT,
  STATUS_QUOTE_CONFIRMED_PROCESSING,
  STATUS_QUOTE_REQUESTED,
  STATUS_QUOTE_SEND,
} from './src/common/Constants';

function parseMaybeJson(value) {
  if (value == null) return value;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function normalizeNotificationData(raw = {}) {
  const data = { ...raw };
  Object.keys(data).forEach((key) => {
    data[key] = parseMaybeJson(data[key]);
  });
  return data;
}

function openChatFromNotification(nData, authInfo) {
  const chatId = nData.chatId;
  const receiver = nData.sender || nData.receiver;
  const orderData = nData.orderData || nData.item;

  if (!chatId || !receiver || !receiver.uid) {
    if (orderData) {
      NavigationService.navigate('OrderDetails', {
        item: orderData,
        screentype: authInfo.usertype === 'admin' ? 'admin_quote_confirm' : 'user_quote_confirm',
      });
    }
    return;
  }

  const root = authInfo.usertype === 'admin' ? 'AdminRoot' : 'UserRoot';
  NavigationService.navigate(root);
  setTimeout(() => {
    NavigationService.navigate('ChatBoard', {
      chatId,
      receiver,
      title: `${receiver.firstname || ''} ${authInfo.usertype === 'admin' ? (receiver.lastname || '') : ''}`.trim(),
      profileImage: receiver.image || null,
      orderData: orderData || null,
    });
  }, 300);
}

function handleNotificationNavigation(nData, authInfo) {
  if (!nData || !authInfo || !authInfo.uid) return;

  if (nData.status === 'chat') {
    openChatFromNotification(nData, authInfo);
    return;
  }

  if (nData.status === STATUS_QUOTE_REQUESTED) {
    NavigationService.navigate('AdminRoot');
    setTimeout(() => {
      NavigationService.navigate('OrderDetails', { item: nData.item, screentype: 'admin_quote_request' });
    }, 300);
  } else if (nData.status === STATUS_QUOTE_SEND) {
    NavigationService.navigate('UserRoot');
    setTimeout(() => {
      NavigationService.navigate('OrderDetails', { item: nData.item, screentype: 'user_quote_received' });
    }, 300);
  } else if (nData.status === STATUS_QUOTE_ACCEPT_PAYMENT) {
    NavigationService.navigate('AdminRoot');
    setTimeout(() => {
      NavigationService.navigate('OrderDetails', { item: nData.item, screentype: 'admin_quote_order' });
    }, 300);
  } else if (nData.status === STATUS_QUOTE_CONFIRMED_PROCESSING) {
    NavigationService.navigate('UserRoot');
    setTimeout(() => {
      NavigationService.navigate('OrderDetails', { item: nData.item, screentype: 'user_quote_confirm' });
    }, 300);
  } else if (nData.status === STATUS_ORDER_COMPLETED) {
    const root = authInfo.usertype === 'admin' ? 'AdminRoot' : 'UserRoot';
    NavigationService.navigate(root);
    setTimeout(() => {
      NavigationService.navigate('OrderDetails', { item: nData.item, screentype: 'user_quote_confirm' });
    }, 300);
  }
}

export default function AppCommon({ children }) {
  const { api } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const notificationListener = useRef();
  const responseListener = useRef();
  const pendingNotification = useRef(null);
  const authRef = useRef(auth);

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  useEffect(() => {
    try {
      dispatch(api.fetchUser());
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [dispatch, api]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return undefined;
    }

    let Notifications;
    try {
      Notifications = require('expo-notifications');
    } catch (e) {
      return undefined;
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {});

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const nData = normalizeNotificationData(response?.notification?.request?.content?.data || {});
      const currentAuth = authRef.current;
      if (currentAuth?.info?.uid) {
        handleNotificationNavigation(nData, currentAuth.info);
      } else {
        pendingNotification.current = nData;
      }
    });

    Notifications.getLastNotificationResponseAsync?.().then((response) => {
      if (!response) return;
      const nData = normalizeNotificationData(response?.notification?.request?.content?.data || {});
      pendingNotification.current = nData;
    }).catch(() => {});

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    if (auth.info?.uid && pendingNotification.current) {
      handleNotificationNavigation(pendingNotification.current, auth.info);
      pendingNotification.current = null;
    }
  }, [auth.info]);

  return children;
}
