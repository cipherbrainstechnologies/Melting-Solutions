import { Box, Center, FormControl, VStack, WarningOutlineIcon, StatusBar } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { FontSemiBold } from '../common/Constants';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import { layout } from '../common/responsive';
import Header from '../components/Header';
import ScreenContainer from '../components/ScreenContainer';
import FadeInView from '../components/FadeInView';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/authactions';
import { showToastError, validateEmail } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import { trackEvent, AnalyticsEvents } from '../common/analytics';
import Spinner from '../components/Spinner';

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
            trackEvent(AnalyticsEvents.REGISTER_SUCCESS, { role: auth.info.usertype });
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
            <StatusBar backgroundColor={colors.WHITE} barStyle="dark-content" />
            <Header title="Create account" onPress={() => props.navigation.goBack()} isTitleCenter={false} />
            <ScreenContainer scroll maxWidth={layout.formMaxWidth}>
                <Center w="100%">
                    <Box w="100%" py="6">
                        <FadeInView>
                            <Text style={globleStyles.subHeader}>Create account</Text>
                            <Text style={globleStyles.screenDescription}>
                                Enter your details to start requesting quotes.
                            </Text>
                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => props.navigation.navigate('Login')}
                            >
                                <Text style={styles.linkText}>
                                    Already have an account? <Text style={styles.linkBold}>Sign in</Text>
                                </Text>
                            </TouchableOpacity>
                        </FadeInView>

                        <FadeInView delay={80}>
                        <VStack space={4} mt="6">
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
                        </FadeInView>
                    </Box>
                </Center>
            </ScreenContainer>
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
    linkButton: { paddingVertical: 8, marginTop: 4 },
    linkText: { ...globleStyles.normalText },
    linkBold: { color: colors.PRIMARY_DARK, fontFamily: FontSemiBold },
});