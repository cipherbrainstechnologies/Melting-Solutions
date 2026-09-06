import { Box, Center, FormControl, Stack, VStack, WarningOutlineIcon, ScrollView, Input, Icon, StatusBar } from 'native-base';
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
var { width } = Dimensions.get('window');
import * as actions from '../../redux/actions/useractions';
import { showToastError, validateEmail, validatePhonenumber } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import Spinner from '../components/Spinner';

function AddUser(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
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

    const [error, setError] = useState(null);
    const [showGST, setShowGST] = useState(false);

    useEffect(() => {
        // console.log("auth login==> ", auth);

        // if (auth.info) {
        //     console.log("auth login======> ");
        //     props.navigation.navigate('AuthLoading');
        // }
        if (users.error && users.error.msg) {
            showToastError(users.error.msg);
        }

    }, [users.error, users.error.msg]);


    const _attemptSubmit = () => {
        const { email, first_name, last_name, mobile_number, company_name, gst_number } = props;
        setError(null)
        if (first_name == undefined || first_name == "") {
            setError({ first_name: "Please enter first name" })
        } else if (last_name == undefined || last_name == "") {
            setError({ last_name: "Please enter last name" })
        } else if (email == "" || !validateEmail(email)) {
            setError({ email: "Please enter valid email address" })
        } else if (mobile_number == "" || !validatePhonenumber(mobile_number)) {
            setError({ mobile_number: "Please enter valid mnobile number" })
        } else if (company_name == undefined || company_name == "") {
            setError({ company_name: "Please enter company name" })
        } else if (gst_number == undefined || gst_number == "") {
            setError({ gst_number: "Please enter GST number" })
        } else {
            dispatch(api.editUser(props.navigation.getParam('uid')))
        }
    }

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header title={'Edit User'} onPress={() => props.navigation.goBack()} isTitleCenter={false} />
            <ScrollView _contentContainerStyle={{
                // px: "10px",
                mb: "4",
                minW: "72"
            }}>
                <Center w="100%">
                    <Box p="2" w="95%">
                        <VStack space={3}>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    onChangeText={userFirstnameChange}
                                    blurOnSubmit={false}
                                    value={first_name}
                                    returnKey={"next"}
                                    secureEntry={false}
                                    placeholder={"Enter First Name"} >
                                    {/* <Entypo name="user" color={colors.GREY_7} size={20} /> */}
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error && error.first_name &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.first_name}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    onChangeText={userLastnameChange}
                                    blurOnSubmit={false}
                                    value={last_name}
                                    returnKey={"next"}
                                    secureEntry={false}
                                    placeholder={"Enter Last Name"} >
                                    {/* <Entypo name="user" color={colors.GREY_7} size={20} /> */}
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error && error.last_name &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.last_name}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    onChangeText={userEmailChange}
                                    blurOnSubmit={false}
                                    value={email}
                                    returnKey={"next"}
                                    keyboardType={"email-address"}
                                    secureEntry={false}
                                    placeholder={"Enter Email Address"} >
                                    <Entypo name="email" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error && error.email &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.email}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    onChangeText={userPhonenumberChange}
                                    blurOnSubmit={false}
                                    value={mobile_number}
                                    returnKey={"next"}
                                    keyboardType={"phone-pad"}
                                    secureEntry={false}
                                    maxLength={10}
                                    placeholder={"Enter Mobile Number"} >
                                    <Entypo name="mobile" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error && error.mobile_number &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.mobile_number}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    onChangeText={userCompanyNameChange}
                                    blurOnSubmit={false}
                                    value={company_name}
                                    returnKey={"next"}
                                    secureEntry={false}
                                    placeholder={"Enter Company Name"} >
                                    <MaterialIcons name="business" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error && error.company_name &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.company_name}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    onChangeText={userGSTNumberChange}
                                    blurOnSubmit={false}
                                    value={gst_number}
                                    returnKey={"next"}
                                    // keyboardType={"email-address"}
                                    secureEntry={!showGST}
                                    placeholder={"Enter GST Number"}
                                    rightIcon={<Entypo name={!showGST ? "eye-with-line" : "eye"} color={colors.GREY_7} size={20} />}
                                    onPressRightIcon={() => setShowGST(!showGST)}>
                                    <Entypo name="calculator" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error && error.gst_number &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.gst_number}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>
                            <MaterialButtonDark onPress={() => _attemptSubmit()}>Edit User</MaterialButtonDark>

                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => {
    // console.log(state.auth.phonenumber);
    return {
        // nav: state.nav,
        first_name: state.usersdata.first_name,
        last_name: state.usersdata.last_name,
        email: state.usersdata.email,
        mobile_number: state.usersdata.mobile_number,
        company_name: state.usersdata.company_name,
        gst_number: state.usersdata.gst_number,
        loading: state.usersdata.loading
    }
};
export default connect(mapStateToProps, actions)(AddUser)

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