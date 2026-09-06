import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { FirebaseContext } from '../../redux';

export default function AuthLoadingScreen(props) {
  const { api } = useContext(FirebaseContext);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Notification deep-links are handled in AppCommon (stays mounted).
  useEffect(() => {
    if (auth.info && auth.info.uid) {
      let role = auth.info.usertype;
      if (role === 'user') {
        if (auth.info.profileStatus) {
          props.navigation.navigate('UserRoot');
        } else {
          props.navigation.navigate('ProfileRoot');
        }
      } else if (role === 'admin') {
        if (auth.info.profileStatus) {
          props.navigation.navigate('AdminRoot');
        } else {
          props.navigation.navigate('ProfileRoot');
        }
      } else {
        dispatch(api.signOut());
        props.navigation.navigate('AuthRoot');
      }
    }
  }, [auth.info]);

  useEffect(() => {
    if (api && auth.error && auth.error.msg && !auth.info) {
      dispatch(api.clearLoginError());
      props.navigation.navigate('AuthRoot');
    }
  }, [auth.error]);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Text style={{ paddingBottom: 100 }}>Fetching Data...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  imagebg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: "flex-end",
    alignItems: 'center'
  }
});
