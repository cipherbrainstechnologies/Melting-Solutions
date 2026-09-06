import { Box, Button, Center, FormControl, Heading, HStack, Input, Link, Stack, StatusBar, VStack, WarningOutlineIcon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Linking
} from 'react-native';
import { colors } from '../common/theme';
import globleStyles from '../common/globleStyles';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { FontSemiBold, not_logged_in } from '../common/Constants';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import * as actions from '../../redux/actions/authactions';
import { connect, useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import { FirebaseContext } from '../../redux';
import { showToastError } from '../../redux/actions/Validation';

var { width } = Dimensions.get('window');

function Verification(props) {
    const { api, config, authRef } = useContext(FirebaseContext);
    const {
        mobileSignIn,
        clearLoginError
    } = api;
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 6 });
    const [propss, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useEffect(() => {
        // console.log("auth===> ", auth);

        if (auth.info) {
            props.navigation.navigate('AuthLoading');
            dispatch(clearLoginError());
        }
        if (auth.error && auth.error.msg && auth.error.msg.message !== not_logged_in) {
            showToastError(auth.error.msg.message.toString());
            dispatch(clearLoginError());
            if (auth.error.msg.message.includes('verficationId.confirm')) {
                props.navigation.navigate('AuthLoading');
            }
        }

    }, [auth.error, auth.error.msg, , auth.verificationId]);


    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    const _attemptLogin = () => {
        dispatch(mobileSignIn(
            props.verificationId,
            value
        ));
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header title={'Verification'} onPress={() => props.navigation.goBack()} />
            <Center w="100%">
                <Box safeArea p="2" py="8" w="95%" maxW="350">

                    <Text style={globleStyles.subHeader}>Verification</Text>
                    <Text style={globleStyles.normalText}>Enter the OTP code from the mobile. We just sent you at {props.phonenumber}</Text>

                    <VStack space={3} mt="10">
                        <FormControl isRequired isInvalid>
                            <CodeField
                                ref={ref}
                                {...propss}
                                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                value={value}
                                onChangeText={setValue}
                                cellCount={6}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                            {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                Please enter a phonenumber!
                            </FormControl.ErrorMessage> */}
                        </FormControl>
                        <MaterialButtonDark onPress={() => _attemptLogin()} disabled={value.length != 6}>Verify</MaterialButtonDark>
                        {/* <View style={globleStyles.actionLine}>
                            <Text style={globleStyles.actionText}>{`Didn't receive the code?`}</Text>
                            <TouchableOpacity style={globleStyles.actionItem} onPress={null}>
                                <Text style={{ ...globleStyles.actionText, color: colors.PRIMARY_DARK, fontFamily: FontSemiBold }}>{'Resend Code'}</Text>
                            </TouchableOpacity>
                        </View> */}
                    </VStack>
                </Box>
            </Center>
            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => {
    // console.log(state.auth.phonenumber);
    return {
        // nav: state.nav,
        phonenumber: state.auth.phonenumber,
        verificationId: state.auth.verificationId,
        loading: state.auth.loading
    }
};

export default connect(mapStateToProps, actions)(Verification)



const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 1,
        borderColor: colors.GREY_4,
        borderRadius: 5,
        textAlign: 'center',
        // marginHorizontal: 20
    },
    focusCell: {
        borderColor: '#000',
    },
})