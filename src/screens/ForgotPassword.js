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
import FadeInView from '../components/FadeInView';
import { InputCard } from '../components/InputCard';
import { Entypo } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/authactions';
import { showToastError, showToastSuccess, validateEmail } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import Spinner from '../components/Spinner';

function ForgotPassword(props) {
    const { api } = useContext(FirebaseContext);
    const { sendPasswordResetEmail, clearLoginError } = api;
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [sent, setSent] = useState(false);
    const [pendingReset, setPendingReset] = useState(false);

    useEffect(() => {
        if (!pendingReset) return;

        if (auth.error && auth.error.msg) {
            showToastError(auth.error.msg);
            setError(auth.error.msg);
            setPendingReset(false);
            dispatch(clearLoginError());
            return;
        }

        if (auth.success === 'reset_sent') {
            setSent(true);
            setPendingReset(false);
            showToastSuccess('Password reset email sent!');
        }
    }, [auth.loading, auth.error, auth.success, pendingReset, clearLoginError, dispatch]);

    const handleResetPassword = () => {
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError(null);
        setPendingReset(true);
        dispatch(sendPasswordResetEmail(email));
    };

    const showLoader = () => {
        if (auth.loading) return <Spinner />;
    };

    if (sent) {
        return (
            <View style={globleStyles.mainView}>
                <StatusBar backgroundColor={colors.WHITE} barStyle="dark-content" />
                <Header title="Reset password" onPress={() => props.navigation.goBack()} isTitleCenter={false} />
                <ScreenContainer scroll maxWidth={layout.formMaxWidth}>
                    <Center w="100%">
                        <Box w="100%" py="8">
                            <FadeInView>
                                <Text style={globleStyles.subHeader}>Check your email</Text>
                                <Text style={globleStyles.screenDescription}>
                                    We sent a password reset link to {email}
                                </Text>
                                <MaterialButtonDark onPress={() => props.navigation.navigate('Login')}>
                                    Back to sign in
                                </MaterialButtonDark>
                            </FadeInView>
                        </Box>
                    </Center>
                </ScreenContainer>
            </View>
        );
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle="dark-content" />
            <Header title="Reset password" onPress={() => props.navigation.goBack()} isTitleCenter={false} />
            <ScreenContainer scroll maxWidth={layout.formMaxWidth}>
                <Center w="100%">
                    <Box w="100%" py="8">
                        <FadeInView>
                            <Text style={globleStyles.subHeader}>Forgot password?</Text>
                            <Text style={globleStyles.screenDescription}>
                                Enter your email and we will send you a reset link.
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

                                    {error && (
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {error}
                                        </FormControl.ErrorMessage>
                                    )}
                                </FormControl>

                                <MaterialButtonDark onPress={handleResetPassword}>
                                    Send reset email
                                </MaterialButtonDark>

                                <TouchableOpacity
                                    style={styles.linkButton}
                                    onPress={() => props.navigation.navigate('Login')}
                                >
                                    <Text style={styles.linkText}>Back to sign in</Text>
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
    error: state.auth.error,
});

export default connect(mapStateToProps, actions)(ForgotPassword);

const styles = StyleSheet.create({
    linkButton: { alignSelf: 'center', paddingVertical: 8 },
    linkText: { ...globleStyles.normalText, color: colors.PRIMARY_DARK, fontFamily: 'Sofia-Pro-SemiBold' },
});
