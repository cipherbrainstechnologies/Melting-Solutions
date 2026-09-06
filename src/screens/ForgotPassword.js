import { Box, Center, FormControl, VStack, WarningOutlineIcon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { colors } from '../common/theme';
import globleStyles from '../common/globleStyles';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/authactions';
import { showToastError, showToastSuccess, validateEmail } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import Spinner from '../components/Spinner';
var { width } = Dimensions.get('window');

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
    }, [auth.loading, auth.error, auth.success, pendingReset]);

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
                <Header title={'Reset Password'} onPress={() => props.navigation.goBack()} />
                <Center w="100%">
                    <Box safeArea p="2" py="8" w="95%" maxW="350">
                        <Text style={globleStyles.subHeader}>Check Your Email</Text>
                        <Text style={globleStyles.normalText}>
                            We've sent a password reset link to {email}
                        </Text>
                        <VStack space={3} mt="10">
                            <MaterialButtonDark onPress={() => props.navigation.navigate('Login')}>
                                Back to Login
                            </MaterialButtonDark>
                        </VStack>
                    </Box>
                </Center>
            </View>
        );
    }

    return (
        <View style={globleStyles.mainView}>
            <Header title={'Reset Password'} onPress={() => props.navigation.goBack()} />
            <Center w="100%">
                <Box safeArea p="2" py="8" w="95%" maxW="350">
                    <Text style={globleStyles.subHeader}>Forgot Password?</Text>
                    <Text style={globleStyles.normalText}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Text>

                    <VStack space={3} mt="10">
                        <FormControl isRequired isInvalid={!!error}>
                            <InputCard
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                placeholder="Enter Email Address"
                                autoCapitalize="none"
                            >
                                <Entypo name="mail" color="black" size={20} />
                            </InputCard>
                            
                            {error && (
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error}
                                </FormControl.ErrorMessage>
                            )}
                        </FormControl>
                        
                        <MaterialButtonDark onPress={handleResetPassword}>
                            Send Reset Email
                        </MaterialButtonDark>

                        <TouchableOpacity 
                            style={globleStyles.actionItem} 
                            onPress={() => props.navigation.navigate('Login')}
                        >
                            <Text style={{ ...globleStyles.actionText, color: colors.PRIMARY_DARK }}>
                                Back to Login
                            </Text>
                        </TouchableOpacity>
                    </VStack>
                </Box>
            </Center>
            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    error: state.auth.error
});

export default connect(mapStateToProps, actions)(ForgotPassword);
