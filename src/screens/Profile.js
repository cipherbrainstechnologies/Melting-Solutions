import { Box, Center, FormControl, Stack, VStack, WarningOutlineIcon, ScrollView, Input, Icon, StatusBar } from 'native-base';
import React, { useContext, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    Dimensions,
    Image,
    Linking
} from 'react-native';
import { NavigationActions } from "react-navigation";

import { FontSemiBold } from '../common/Constants';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import ProfileComponent from '../components/ProfileComponent';
import { FirebaseContext } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
var { width } = Dimensions.get('window');

export default function Profile(props) {

    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        // console.log("auth login==> ", auth);

        // if (auth.info) {
        //     console.log("auth login======> ");
        //     props.navigation.navigate('AuthLoading');
        // }

        if (auth.success == "success") {
            auth.info.usertype == "user" ?
                props.navigation.navigate('UserRoot')
                :
                props.navigation.navigate('AdminRoot')

            // props.navigation.dispatch({
            //     type: NavigationActions.NAVIGATE,
            //     routeName: 'AuthLoading',
            //     key: null,
            //     action: {
            //         type: NavigationActions.RESET,
            //         index: 0,
            //         actions: [{ type: NavigationActions.RESET, routeName: 'AuthLoading' }]
            //     }
            // })
        }

    }, [auth.success]);

    const onLogout = () => {
        Alert.alert(
            'SIGNOUT!',
            'Are you sure you want to signout?',
            [
                { text: 'NO', onPress: () => { console.log("sd") } },
                {
                    text: 'YES', onPress: () => {
                        logout();
                    }
                },
            ],
            { cancelable: false }
        )
    }

    const logout = () => {
        /*props.navigation.dispatch(NavigationActions.navigate({
          routeName:"Auth",
        }))*/
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
        })
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header
                title={'Edit Profile'}
                isLeftIconHide
                isTitleCenter={false}
                isRightIconHide={auth.info.usertype == "user" ? false : true}
                rightIconName="log-out"
                onPressRightIcon={() => onLogout()} />
            <ProfileComponent />
        </View>
    );
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE,
        //marginTop: StatusBar.currentHeight,
        justifyContent: 'center'
    },
    title: {
        fontFamily: 'Sofia-Pro-Bold',
        fontSize: width * 0.045,
        color: colors.DARK_BLUE,
        textAlign: 'center',
        textDecorationLine: "underline",
        marginVertical: 5
    }
})