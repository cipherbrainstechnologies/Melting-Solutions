import { Alert, Platform } from 'react-native';
import NavigationService from '../navigation/NavigationService';
import { NavigationActions } from 'react-navigation';

const authEntryRoute = Platform.OS === 'web' ? 'Landing' : 'Login';

export function navigateToAuthRoot() {
  const navigator = NavigationService.getNavigator();
  const action = NavigationActions.navigate({
    routeName: 'AuthRoot',
    action: NavigationActions.navigate({ routeName: authEntryRoute }),
  });

  if (navigator) {
    navigator.dispatch(action);
  } else {
    NavigationService.navigate('AuthRoot');
  }
}

export function confirmSignOut(onConfirm) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to sign out?')) {
      onConfirm();
    }
    return;
  }

  Alert.alert(
    'Sign out',
    'Are you sure you want to sign out?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: onConfirm },
    ],
    { cancelable: true }
  );
}

export function performSignOut(dispatch, signOutAction) {
  dispatch(signOutAction());
  navigateToAuthRoot();
}
