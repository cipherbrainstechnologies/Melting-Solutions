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
var { width } = Dimensions.get('window');
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/authactions';
import { showToastError, validateEmail } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import Spinner from '../components/Spinner';

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

    // Navigate to AuthLoading screen after successful login
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
            <Header title={'Login'} isLeftIconHide />
            
            <Center w="100%">
                <Box safeArea p="2" py="8" w="95%" maxW="350">
                    <Text style={globleStyles.subHeader}>Login Now</Text>
                    <Text style={globleStyles.normalText}>
                        Please enter your email and password to login
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
                            
                            <InputCard
                                onChangeText={setPassword}
                                value={password}
                                secureEntry={true}
                                placeholder="Enter Password"
                            >
                                <Entypo name="lock" color="black" size={20} />
                            </InputCard>
                            
                            {error && (
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error}
                                </FormControl.ErrorMessage>
                            )}
                        </FormControl>
                        
                        <MaterialButtonDark onPress={_attemptLogin}>
                            Login
                        </MaterialButtonDark>

                        <TouchableOpacity 
                            style={globleStyles.actionItem} 
                            onPress={() => props.navigation.navigate('Register')}
                        >
                            <Text style={{ ...globleStyles.actionText, color: colors.PRIMARY_DARK }}>
                                Don't have an account? Sign up
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={globleStyles.actionItem}
                            onPress={() => props.navigation.navigate('ForgotPassword')}
                        >
                            <Text style={{ ...globleStyles.actionText, color: colors.PRIMARY_DARK }}>
                                Forgot Password?
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

export default connect(mapStateToProps, actions)(Login)

const styles = StyleSheet.create({

    // title: {
    //     fontFamily: 'Sofia-Pro-Bold',
    //     fontSize: width * 0.045,
    //     color: colors.DARK_BLUE,
    //     textAlign: 'center',
    //     textDecorationLine: "underline",
    //     marginVertical: 5
    // }
})