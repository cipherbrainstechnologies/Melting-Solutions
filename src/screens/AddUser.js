import { Box, Center, FormControl, VStack, WarningOutlineIcon, ScrollView, StatusBar } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import { layout } from '../common/responsive';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/useractions';
import { showToastError, showToastSuccess, validateEmail, validatePhonenumber } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import Spinner from '../components/Spinner';

function AddUser(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const users = useSelector(state => state.usersdata);

    const {
        first_name,
        last_name,
        email,
        mobile_number,
        company_name,
        gst_number,
        userFirstnameChange,
        userLastnameChange,
        userEmailChange,
        userPhonenumberChange,
        userCompanyNameChange,
        userGSTNumberChange,
    } = props;

    const uid = props.navigation.getParam('uid');
    const isEditMode = Boolean(uid);

    const [error, setError] = useState(null);
    const [showGST, setShowGST] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!isEditMode) {
            dispatch(api.resetUserForm());
        }
    }, [dispatch, api.resetUserForm, isEditMode]);

    useEffect(() => {
        if (users.error && users.error.msg) {
            showToastError(users.error.msg);
            dispatch(api.clearUserError());
        }

        if (users.success === 'success') {
            if (users.success_status === 'create_success') {
                showToastSuccess('User created successfully');
            } else if (users.success_status === 'edit_success') {
                showToastSuccess('User updated successfully');
            }
            dispatch(api.clearUserError());
            props.navigation.goBack();
        }
    }, [users.error, users.error.msg, users.success, users.success_status]);

    const validateForm = () => {
        if (!first_name) {
            return { first_name: 'Please enter first name' };
        }
        if (!last_name) {
            return { last_name: 'Please enter last name' };
        }
        if (!email || !validateEmail(email)) {
            return { email: 'Please enter a valid email address' };
        }
        if (!mobile_number || !validatePhonenumber(mobile_number)) {
            return { mobile_number: 'Please enter a valid mobile number' };
        }
        if (!company_name) {
            return { company_name: 'Please enter company name' };
        }
        if (!gst_number) {
            return { gst_number: 'Please enter GST number' };
        }
        if (!isEditMode) {
            if (!password || password.length < 6) {
                return { password: 'Password must be at least 6 characters' };
            }
            if (password !== confirmPassword) {
                return { confirmPassword: 'Passwords do not match' };
            }
        }
        return null;
    };

    const _attemptSubmit = () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        if (isEditMode) {
            dispatch(api.editUser(uid));
        } else {
            dispatch(api.adminCreateUser(password));
        }
    };

    const showLoader = () => {
        if (props.loading === true) {
            return <Spinner />;
        }
    };

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header
                title={isEditMode ? 'Edit User' : 'Add User'}
                onPress={() => props.navigation.goBack()}
                isTitleCenter={false}
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Center w="100%">
                    <Box w="100%" maxW={layout.formMaxWidth} px="4" py="4">
                        <Text style={globleStyles.sectionTitle}>
                            {isEditMode ? 'Update user details' : 'Create a new buyer account'}
                        </Text>
                        <Text style={globleStyles.screenDescription}>
                            {isEditMode
                                ? 'Edit profile information for this user.'
                                : 'Set up login credentials and profile details. The user can sign in immediately with the password you assign.'}
                        </Text>

                        <VStack space={4}>
                            <FormControl isRequired isInvalid={!!error?.first_name}>
                                <InputCard
                                    label="First name"
                                    onChangeText={userFirstnameChange}
                                    blurOnSubmit={false}
                                    value={first_name}
                                    returnKey={"next"}
                                    secureEntry={false}
                                    placeholder={"Enter first name"}
                                >
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error?.first_name && (
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.first_name}
                                    </FormControl.ErrorMessage>
                                )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error?.last_name}>
                                <InputCard
                                    label="Last name"
                                    onChangeText={userLastnameChange}
                                    blurOnSubmit={false}
                                    value={last_name}
                                    returnKey={"next"}
                                    secureEntry={false}
                                    placeholder={"Enter last name"}
                                >
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error?.last_name && (
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.last_name}
                                    </FormControl.ErrorMessage>
                                )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error?.email}>
                                <InputCard
                                    label="Email"
                                    onChangeText={userEmailChange}
                                    blurOnSubmit={false}
                                    value={email}
                                    returnKey={"next"}
                                    keyboardType={"email-address"}
                                    secureEntry={false}
                                    placeholder={"Enter email address"}
                                    editable={!isEditMode}
                                >
                                    <Entypo name="email" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error?.email && (
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.email}
                                    </FormControl.ErrorMessage>
                                )}
                            </FormControl>

                            {!isEditMode && (
                                <>
                                    <FormControl isRequired isInvalid={!!error?.password}>
                                        <InputCard
                                            label="Password"
                                            onChangeText={setPassword}
                                            blurOnSubmit={false}
                                            value={password}
                                            returnKey={"next"}
                                            secureEntry={!showPassword}
                                            placeholder={"Set password (min. 6 characters)"}
                                            rightIcon={<Entypo name={!showPassword ? "eye-with-line" : "eye"} color={colors.GREY_7} size={20} />}
                                            onPressRightIcon={() => setShowPassword(!showPassword)}
                                        >
                                            <Entypo name="lock" color={colors.GREY_7} size={20} />
                                        </InputCard>
                                        {error?.password && (
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {error.password}
                                            </FormControl.ErrorMessage>
                                        )}
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!error?.confirmPassword}>
                                        <InputCard
                                            label="Confirm password"
                                            onChangeText={setConfirmPassword}
                                            blurOnSubmit={false}
                                            value={confirmPassword}
                                            returnKey={"next"}
                                            secureEntry={!showConfirmPassword}
                                            placeholder={"Confirm password"}
                                            rightIcon={<Entypo name={!showConfirmPassword ? "eye-with-line" : "eye"} color={colors.GREY_7} size={20} />}
                                            onPressRightIcon={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <Entypo name="lock" color={colors.GREY_7} size={20} />
                                        </InputCard>
                                        {error?.confirmPassword && (
                                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                {error.confirmPassword}
                                            </FormControl.ErrorMessage>
                                        )}
                                    </FormControl>
                                </>
                            )}

                            <FormControl isRequired isInvalid={!!error?.mobile_number}>
                                <InputCard
                                    label="Mobile number"
                                    onChangeText={userPhonenumberChange}
                                    blurOnSubmit={false}
                                    value={mobile_number}
                                    returnKey={"next"}
                                    keyboardType={"phone-pad"}
                                    secureEntry={false}
                                    maxLength={10}
                                    placeholder={"Enter mobile number"}
                                >
                                    <Entypo name="mobile" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error?.mobile_number && (
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.mobile_number}
                                    </FormControl.ErrorMessage>
                                )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error?.company_name}>
                                <InputCard
                                    label="Company name"
                                    onChangeText={userCompanyNameChange}
                                    blurOnSubmit={false}
                                    value={company_name}
                                    returnKey={"next"}
                                    secureEntry={false}
                                    placeholder={"Enter company name"}
                                >
                                    <MaterialIcons name="business" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error?.company_name && (
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.company_name}
                                    </FormControl.ErrorMessage>
                                )}
                            </FormControl>

                            <FormControl isRequired isInvalid={!!error?.gst_number}>
                                <InputCard
                                    label="GST number"
                                    onChangeText={userGSTNumberChange}
                                    blurOnSubmit={false}
                                    value={gst_number}
                                    returnKey={"next"}
                                    secureEntry={!showGST}
                                    placeholder={"Enter GST number"}
                                    rightIcon={<Entypo name={!showGST ? "eye-with-line" : "eye"} color={colors.GREY_7} size={20} />}
                                    onPressRightIcon={() => setShowGST(!showGST)}
                                >
                                    <Entypo name="calculator" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error?.gst_number && (
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.gst_number}
                                    </FormControl.ErrorMessage>
                                )}
                            </FormControl>

                            <MaterialButtonDark onPress={_attemptSubmit}>
                                {isEditMode ? 'Save Changes' : 'Create User'}
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
    first_name: state.usersdata.first_name,
    last_name: state.usersdata.last_name,
    email: state.usersdata.email,
    mobile_number: state.usersdata.mobile_number,
    company_name: state.usersdata.company_name,
    gst_number: state.usersdata.gst_number,
    loading: state.usersdata.loading,
    success: state.usersdata.success,
    success_status: state.usersdata.success_status,
    error: state.usersdata.error,
});

export default connect(mapStateToProps, actions)(AddUser);

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
});
