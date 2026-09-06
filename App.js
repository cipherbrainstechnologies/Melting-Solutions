import 'react-native-gesture-handler';
import { StyleSheet, View, LogBox, ActivityIndicator, Platform, Image, Text } from 'react-native';
import { Provider } from 'react-redux'
import { FirebaseProvider, store } from './redux';
import AppContainer from './src/navigation/AppNavigator';
import * as Font from 'expo-font';
import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { FirebaseConfig } from './src/common/FirebaseConfig';
import { NativeBaseProvider } from 'native-base';
import AppCommon from './AppCommon';
import NavigationService from './src/navigation/NavigationService';
import { colors, typography } from './src/common/theme';

if (Platform.OS !== 'web') {
  try {
    const Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {
    // Notifications unavailable
  }
}

export default function App() {

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      LogBox.ignoreAllLogs(true);
      LogBox.ignoreLogs(['Warning: ...']);
      LogBox.ignoreLogs(['Setting a timer']);
      LogBox.ignoreLogs(['It appears that']);
    }
    onLoad();
  }, []);

  const _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        'Sofia-Pro-Bold': require('./assets/fonts/Sofia-Pro-Bold.otf'),
        'Sofia-Pro-SemiBold': require('./assets/fonts/Sofia-Pro-Semi-Bold.otf'),
        'Sofia-Pro-Regular': require('./assets/fonts/Sofia-Pro-Regular.otf'),
        'Sofia-Pro-Medium': require('./assets/fonts/Sofia-Pro-Medium.otf'),
        'Sofia-Pro-Light': require('./assets/fonts/Sofia-Pro-Light.otf'),
      }),
    ]);
  };

  const onLoad = async () => {
    const loadingMsg = 'Loading';
    if (__DEV__ || Platform.OS === 'web') {
      setUpdateMsg(loadingMsg + '...');
      _loadResourcesAsync()
        .then(() => setAssetsLoaded(true))
        .catch(() => setAssetsLoaded(true));
      return;
    }

    try {
      setUpdateMsg(loadingMsg + '.');
      Updates.checkForUpdateAsync().then((update) => {
        if (update.isAvailable) {
          setUpdateMsg(loadingMsg + '..');
          Updates.fetchUpdateAsync().then((fetchResult) => {
            if (fetchResult.isNew) {
              Updates.reloadAsync().catch(() => {
                setUpdateMsg(loadingMsg + '...');
                _loadResourcesAsync().then(() => setAssetsLoaded(true));
              })
            } else {
              setUpdateMsg(loadingMsg + '...');
              _loadResourcesAsync().then(() => setAssetsLoaded(true));
            }
          }).catch(() => {
            setUpdateMsg(loadingMsg + '...');
            _loadResourcesAsync().then(() => setAssetsLoaded(true));
          });
        } else {
          setUpdateMsg(loadingMsg + '...');
          _loadResourcesAsync().then(() => setAssetsLoaded(true));
        }
      }).catch(() => {
        setUpdateMsg(loadingMsg + '...');
        _loadResourcesAsync().then(() => setAssetsLoaded(true));
      });
    } catch (error) {
      setUpdateMsg(loadingMsg + '...');
      _loadResourcesAsync().then(() => setAssetsLoaded(true));
    }
  }


  return (
    assetsLoaded ?
      <Provider store={store}>
        <FirebaseProvider config={FirebaseConfig}>
          <NativeBaseProvider>
            <AppCommon>
              <AppContainer
                ref={(navigatorRef) => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}
              />
            </AppCommon>
          </NativeBaseProvider>
        </FirebaseProvider>
      </Provider >
      :
      <View style={styles.container}>
        <Image source={require('./assets/icon.png')} style={styles.logo} />
        <Text style={styles.brand}>Melting Solution</Text>
        <ActivityIndicator size="large" color={colors.PRIMARY_DARK} style={styles.loader} />
        <Text style={styles.loadingText}>{updateMsg}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginBottom: 16,
  },
  brand: {
    ...typography.title,
    marginBottom: 24,
  },
  loader: {
    marginBottom: 12,
  },
  loadingText: {
    ...typography.caption,
  },
});
