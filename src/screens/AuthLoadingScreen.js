import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FirebaseContext } from '../../redux';
import FadeInView from '../components/FadeInView';
import { colors, typography } from '../common/theme';

export default function AuthLoadingScreen(props) {
  const { api } = useContext(FirebaseContext);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.info && auth.info.uid) {
      const role = auth.info.usertype;
      if (role === 'user') {
        props.navigation.navigate(auth.info.profileStatus ? 'UserRoot' : 'ProfileRoot');
      } else if (role === 'admin') {
        props.navigation.navigate(auth.info.profileStatus ? 'AdminRoot' : 'ProfileRoot');
      } else {
        dispatch(api.signOut());
        props.navigation.navigate('AuthRoot');
      }
    }
  }, [auth.info, api.signOut, dispatch, props.navigation]);

  useEffect(() => {
    if (api && auth.error && auth.error.msg && !auth.info) {
      dispatch(api.clearLoginError());
      props.navigation.navigate('AuthRoot');
    }
  }, [api, auth.error, auth.info, dispatch, props.navigation]);

  return (
    <View style={styles.container}>
      <FadeInView style={styles.content}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.brand}>Melting Solution</Text>
        <Text style={styles.subtitle}>Preparing your workspace…</Text>
        <ActivityIndicator size="large" color={colors.PRIMARY_DARK} style={styles.loader} />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.SURFACE,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginBottom: 20,
  },
  brand: {
    ...typography.title,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.caption,
    marginBottom: 28,
  },
  loader: {
    marginTop: 8,
  },
});
