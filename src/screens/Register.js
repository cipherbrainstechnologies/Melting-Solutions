import { Box, Center, FormControl, Stack, VStack, WarningOutlineIcon, ScrollView, Input, Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    Linking
} from 'react-native';
import { FontSemiBold } from '../common/Constants';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/authactions';
import { showToastError, validateEmail } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import Spinner from '../components/Spinner';
var { width } = Dimensions.get('window');

function Register(props) {
    const { api } = useContext(FirebaseContext);
    const { emailPasswordRegister, clearLoginError } = api;
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [companyname, setCompanyname] = useState('');
    const [gstnumber, setGstnumber] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (auth.error && auth.error.msg) {
            showToastError(auth.error.msg);
            dispatch(clearLoginError());
        }
    }, [auth.error]);

    useEffect(() => {
        if (!auth.loading && auth.info && auth.info.uid) {
            props.navigation.navigate('AuthLoading');
        }
    }, [auth.info, auth.loading]);

    const _attemptRegister = () => {
        if (!firstname || !lastname) {
            setError('Please enter your full name');
            return;
        }
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(null);
        const userData = {
            firstname,
            lastname,
            companyname,
            gstnumber,
            usertype: 'user'
        };
        
        dispatch(emailPasswordRegister(email, password, userData));
    };

    const showLoader = () => {
        if (auth.loading) return <Spinner />;
    };

    return (
        <View style={globleStyles.mainView}>
            <Header title={'Registration'} onPress={() => props.navigation.goBack()} />
            <ScrollView _contentContainerStyle={{
                mb: "4",
                minW: "72"
            }}>
                <Center w="100%">
                    <Box p="2" w="95%" maxW="350">
                        <Text style={globleStyles.subHeader}>Create Account</Text>
                        <Text style={globleStyles.normalText}>
                            Enter your details to create an account
                        </Text>
                        <TouchableOpacity 
                            style={{ ...globleStyles.actionItem, alignSelf: 'auto', marginLeft: 0 }} 
                            onPress={() => props.navigation.navigate('Login')}
                        >
                            <Text style={{ ...globleStyles.actionText, color: colors.PRIMARY_DARK, fontFamily: FontSemiBold }}>
                                Already have account?
                            </Text>
                        </TouchableOpacity>

                        <VStack space={3} mt="10">
                            <FormControl isRequired isInvalid={!!error}>
                                <InputCard
                                    onChangeText={setFirstname}
                                    value={firstname}
                                    placeholder="Enter First Name"
                                >
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>
                                
                                <InputCard
                                    onChangeText={setLastname}
                                    value={lastname}
                                    placeholder="Enter Last Name"
                                >
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>

                                <InputCard
                                    onChangeText={setEmail}
                                    value={email}
                                    keyboardType="email-address"
                                    placeholder="Enter Email Address"
                                    autoCapitalize="none"
                                >
                                    <Entypo name="mail" color={colors.GREY_7} size={20} />
                                </InputCard>

                                <InputCard
                                    onChangeText={setPassword}
                                    value={password}
                                    secureEntry={true}
                                    placeholder="Enter Password"
                                >
                                    <Entypo name="lock" color={colors.GREY_7} size={20} />
                                </InputCard>

                                <InputCard
                                    onChangeText={setConfirmPassword}
                                    value={confirmPassword}
                                    secureEntry={true}
                                    placeholder="Confirm Password"
                                >
                                    <Entypo name="lock" color={colors.GREY_7} size={20} />
                                </InputCard>

                                <InputCard
                                    onChangeText={setCompanyname}
                                    value={companyname}
                                    placeholder="Enter Company Name"
                                >
                                    <MaterialIcons name="business" color={colors.GREY_7} size={20} />
                                </InputCard>

                                <InputCard
                                    onChangeText={setGstnumber}
                                    value={gstnumber}
                                    placeholder="Enter GST Number (Optional)"
                                >
                                    <Entypo name="calculator" color={colors.GREY_7} size={20} />
                                </InputCard>

                                {error && (
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error}
                                    </FormControl.ErrorMessage>
                                )}
                            </FormControl>

                            <MaterialButtonDark onPress={_attemptRegister}>
                                Create Account
                            </MaterialButtonDark>
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    error: state.auth.error
});

export default connect(mapStateToProps, actions)(Register);


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