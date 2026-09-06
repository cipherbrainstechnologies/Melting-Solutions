import { NavigationActions } from 'react-navigation';

let _navigator = null;
let _pendingAction = null;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
  if (_navigator && _pendingAction) {
    _navigator.dispatch(_pendingAction);
    _pendingAction = null;
  }
}

function navigate(routeName, params) {
  const action = NavigationActions.navigate({
    routeName,
    params,
  });

  if (_navigator) {
    _navigator.dispatch(action);
  } else {
    _pendingAction = action;
  }
}

function getNavigator() {
  return _navigator;
}

export default {
  navigate,
  setTopLevelNavigator,
  getNavigator,
};
