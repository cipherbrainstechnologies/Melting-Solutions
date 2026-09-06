import { Box, HStack, StatusBar } from 'native-base';
import React, { useContext, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    Text,
} from 'react-native';
import { NavigationActions } from "react-navigation";

import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import ProfileComponent from '../components/ProfileComponent';
import { FirebaseContext } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { Entypo } from 'react-native-vector-icons';

export default function Profile(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        if (auth.success === 'success') {
            auth.info.usertype === 'user'
                ? props.navigation.navigate('UserRoot')
                : props.navigation.navigate('AdminRoot');
        }
    }, [auth.success]);

    const onLogout = () => {
        Alert.alert(
            'Sign out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign out',
                    style: 'destructive',
                    onPress: () => logout(),
                },
            ],
            { cancelable: true }
        );
    };

    const logout = () => {
        dispatch(api.signOut());
        props.navigation.dispatch({
            type: NavigationActions.NAVIGATE,
            routeName: 'AuthRoot',
            key: null,
            action: {
                type: NavigationActions.RESET,
                index: 0,
                actions: [{ type: NavigationActions.RESET, routeName: 'AuthRoot' }]
            }
        });
    };

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header
                title={'Profile'}
                isLeftIconHide
                isTitleCenter={false}
                isRightIconHide={false}
                rightIconName="log-out"
                onPressRightIcon={onLogout}
            />
            <ProfileComponent />

            <Box px="4" pb="8" maxW={480} alignSelf="center" w="100%">
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={globleStyles.logoutButton}
                    onPress={onLogout}
                >
                    <HStack alignItems="center" space={2}>
                        <Entypo name="log-out" size={18} color={colors.LIGHT_RED} />
                        <Text style={globleStyles.logoutButtonText}>Sign out</Text>
                    </HStack>
                </TouchableOpacity>
            </Box>
        </View>
    );
}
