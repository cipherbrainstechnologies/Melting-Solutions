import { Box, Center, FormControl, VStack, WarningOutlineIcon, StatusBar } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { colors } from '../common/theme';
import { layout } from '../common/responsive';
import globleStyles from '../common/globleStyles';
import Header from '../components/Header';
import ScreenContainer from '../components/ScreenContainer';
import { InputCard } from '../components/InputCard';
import { Entypo } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/authactions';
import { showToastError, validateEmail } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import Spinner from '../components/Spinner';
import FadeInView from '../components/FadeInView';
import { not_logged_in } from '../common/Constants';

function Login(props) {
    const { api } = useContext(FirebaseContext);
    const { emailPasswordSignIn, clearLoginError } = api;
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (auth.error && auth.error.msg && auth.error.msg !== not_logged_in) {
            showToastError(auth.error.msg);
            dispatch(clearLoginError());
        }
    }, [auth.error]);

    useEffect(() => {
        if (!auth.loading && auth.info && auth.info.uid) {
            props.navigation.navigate('AuthLoading');
        }
    }, [auth.info, auth.loading]);

    const _attemptLogin = () => {
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError(null);
        dispatch(emailPasswordSignIn(email, password));
    };

    const showLoader = () => {
        if (auth.loading) return <Spinner />;
    };

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header title={'Sign in'} isLeftIconHide isTitleCenter={false} />

            <ScreenContainer scroll maxWidth={layout.formMaxWidth} contentStyle={styles.content}>
                <Center w="100%">
                    <Box w="100%" py="6">
                        <FadeInView>
                            <Text style={globleStyles.subHeader}>Welcome back</Text>
                            <Text style={globleStyles.screenDescription}>
                                Sign in with your email and password to continue.
                            </Text>
                        </FadeInView>

                        <FadeInView delay={80}>
                            <VStack space={4} mt="6">
                            <FormControl isRequired isInvalid={!!error}>
                                <InputCard
                                    label="Email"
                                    onChangeText={setEmail}
                                    value={email}
                                    keyboardType="email-address"
                                    placeholder="Enter email address"
                                    autoCapitalize="none"
                                >
                                    <Entypo name="mail" color={colors.GREY_7} size={20} />
                                </InputCard>

                                <InputCard
                                    label="Password"
                                    onChangeText={setPassword}
                                    value={password}
                                    secureEntry={true}
                                    placeholder="Enter password"
                                >
                                    <Entypo name="lock" color={colors.GREY_7} size={20} />
                                </InputCard>

                                {error && (
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error}
                                    </FormControl.ErrorMessage>
                                )}
                            </FormControl>

                            <MaterialButtonDark onPress={_attemptLogin}>
                                Sign in
                            </MaterialButtonDark>

                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => props.navigation.navigate('Register')}
                            >
                                <Text style={styles.linkText}>
                                    Don't have an account? <Text style={styles.linkTextBold}>Sign up</Text>
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => props.navigation.navigate('ForgotPassword')}
                            >
                                <Text style={styles.linkTextBold}>Forgot password?</Text>
                            </TouchableOpacity>
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

export default connect(mapStateToProps, actions)(Login);

const styles = StyleSheet.create({
    content: {
        justifyContent: 'center',
        paddingTop: 24,
    },
    linkButton: {
        alignSelf: 'center',
        paddingVertical: 8,
    },
    linkText: {
        ...globleStyles.normalText,
        textAlign: 'center',
    },
    linkTextBold: {
        ...globleStyles.normalText,
        color: colors.PRIMARY_DARK,
        fontFamily: 'Sofia-Pro-SemiBold',
    },
});
