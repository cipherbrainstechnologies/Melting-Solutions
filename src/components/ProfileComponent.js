import { Box, Center, FormControl, Stack, VStack, WarningOutlineIcon, ScrollView, Input, Icon } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    Linking
} from 'react-native';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { FirebaseContext } from '../../redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet from "react-native-actions-sheet";
import Spinner from './Spinner';
import * as actions from '../../redux/actions/useractions';
import { showToastError } from '../../redux/actions/Validation';
import { getImagePickerUri } from '../common/imagePicker';
import { FontBold } from '../common/Constants';
var { width } = Dimensions.get('window');

function ProfileComponent(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    const actionSheetRef = useRef(null);
    const [showGST, setShowGST] = useState(false);
    const [error, setError] = useState(null);
    const [state, setState] = useState({
        uid: auth.info.uid,
        image: auth.info.image,
        firstname: auth.info.firstname,
        lastname: auth.info.lastname,
        email: auth.info.email,
        phonenumber: auth.info.phoneNumber,
        companyname: auth.info.companyname,
        gstnumber: auth.info.gstnumber,
        profileStatus: auth.info.profileStatus,
    });

    useEffect(() => {
        // console.log("auth login==> ", auth);

        // if (auth.info) {
        //     console.log("auth login======> ");
        //     props.navigation.navigate('AuthLoading');
        // }

        // if (props.success == "success") {
        //     console.log("routeHome");
        //     routeHome()
        //     // api.clearLoginError()
        //     // props.navigation.navigate('AuthLoading');
        // }

        if (props.error && props.error.msg) {
            showToastError(props.error.msg);
            console.log("Error==> ", props.error.msg);
        }

    }, [props.error, props.error.msg, props.success]);

    const showActionSheet = () => {
        actionSheetRef.current?.setModalVisible(true);
    }

    const removeImage = () => {
        setState({ ...state, image: null })
        actionSheetRef.current?.setModalVisible(false);
    }


    const uploadImage = () => {
        return (
            <ActionSheet ref={actionSheetRef}>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderColor: colors.GREY_1, borderBottomWidth: 1, height: 60, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { _pickImage('CAMERA', ImagePicker.launchCameraAsync) }}
                >
                    <Text style={{ color: colors.GREY_8, fontWeight: 'bold', fontFamily: FontBold }}>{'Camera'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderBottomWidth: 1, borderColor: colors.GREY_1, height: 60, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { _pickImage('MEDIA', ImagePicker.launchImageLibraryAsync) }}
                >
                    <Text style={{ color: colors.GREY_8, fontWeight: 'bold', fontFamily: FontBold }}>{'Media Library'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    onPress={removeImage}>
                    <Text style={{ color: 'red', fontWeight: 'bold', fontFamily: FontBold }}>Remove Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { actionSheetRef.current?.setModalVisible(false); }}>
                    <Text style={{ color: 'red', fontWeight: 'bold', fontFamily: FontBold }}>Cancel</Text>
                </TouchableOpacity>
            </ActionSheet>
        )
    }

    const _pickImage = async (permissionType, res) => {
        var pickFrom = res;
        let permisions;
        if (permissionType == 'CAMERA') {
            permisions = await ImagePicker.requestCameraPermissionsAsync();
        } else {
            permisions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        const { status } = permisions;

        if (status == 'granted') {

            let result = await pickFrom({
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.9,
                base64: true
            });

            actionSheetRef.current?.setModalVisible(false);
            const uri = getImagePickerUri(result);
            if (uri) {
                setState({ ...state, image: uri })
            }
        } else {
            Alert.alert('Alert', 'Camera Permisison Error')
        }
    }

    const _attemptSubmit = () => {
        const { firstname, lastname, email, companyname, gstnumber, image } = state;
        setError(null)
        if (firstname == undefined || firstname == "") {
            setError({ firstname: "Please enter firstname" })
        } else if (lastname == undefined || lastname == "") {
            setError({ lastname: "Please enter lastname" })
        } else if (email == undefined || email == "") {
            setError({ email: "Please enter email" })
        } else if ((companyname == undefined || companyname == "") && auth.info.usertype != "admin") {
            setError({ companyname: "Please enter company name" })
        } else if ((gstnumber == undefined || gstnumber == "") && auth.info.usertype != "admin") {
            setError({ gstnumber: "Please enter gst number" })
            // } else if (image == undefined || image == "") {
            //     showToastError("Product image require*");
        } else {
            dispatch(api.updateProfile(state))
        }
    }

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }


    return (
        <ScrollView _contentContainerStyle={{
            // px: "10px",
            mb: "4",
            minW: "72"
        }}>
            <Center w="100%">
                <Box p="2" w="95%">
                    {uploadImage()}

                    <VStack space={3} mt="0">
                        <Stack style={{ marginVertical: 10, alignItems: 'center' }}>
                            {state.image ?
                                <Image
                                    source={{ uri: state.image }}
                                    style={globleStyles.profileIcon}
                                />
                                :
                                <Image
                                    source={require('../../assets/icon.png')}
                                    style={globleStyles.profileIcon}
                                />
                            }
                            {/* image picker */}
                            {props.screentype != "view" &&
                                <TouchableOpacity activeOpacity={.5} style={globleStyles.profileEditView} onPress={showActionSheet}>
                                    <Text style={globleStyles.normalTextWhite}>Change</Text>
                                </TouchableOpacity>
                            }
                        </Stack>
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => { setState({ ...state, firstname: text }) }}
                                value={state.firstname}
                                secureEntry={false}
                                placeholder={"Enter First Name"} >
                                <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                            </InputCard>
                            {error && error.firstname &&
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error.firstname}
                                </FormControl.ErrorMessage>
                            }
                        </FormControl>
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => { setState({ ...state, lastname: text }) }}
                                value={state.lastname}
                                // returnKey={"next"}
                                // keyboardType={"email-address"}
                                secureEntry={false}
                                placeholder={"Enter Last Name"} >
                                {/* <Entypo name="user" color={colors.GREY_7} size={20} /> */}
                                <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                            </InputCard>
                            {error && error.lastname &&
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error.lastname}
                                </FormControl.ErrorMessage>
                            }
                        </FormControl>
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => { setState({ ...state, email: text }) }}
                                value={state.email}
                                // returnKey={"next"}
                                // keyboardType={"email-address"}
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
                                onChangeText={(text) => { setState({ ...state, phonenumber: text }) }}
                                value={state.phonenumber}
                                // returnKey={"next"}
                                // keyboardType={"email-address"}
                                secureEntry={false}
                                placeholder={"Enter Mobile Number"}
                                editable={false} >
                                <Entypo name="mobile" color={colors.GREY_7} size={20} />
                            </InputCard>
                        </FormControl>
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => { setState({ ...state, companyname: text }) }}
                                value={state.companyname}
                                // returnKey={"next"}
                                // keyboardType={"email-address"}
                                secureEntry={false}
                                placeholder={"Enter Company Name"} >
                                <MaterialIcons name="business" color={colors.GREY_7} size={20} />
                            </InputCard>
                            {error && error.companyname &&
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error.companyname}
                                </FormControl.ErrorMessage>
                            }
                        </FormControl>
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => { setState({ ...state, gstnumber: text }) }}
                                value={state.gstnumber}
                                // returnKey={"next"}
                                // keyboardType={"email-address"}
                                secureEntry={!showGST}
                                placeholder={"Enter GST Number"}
                                rightIcon={<Entypo name={!showGST ? "eye-with-line" : "eye"} color={colors.GREY_7} size={20} />}
                                onPressRightIcon={() => setShowGST(!showGST)}>
                                <Entypo name="calculator" color={colors.GREY_7} size={20} />
                            </InputCard>
                            {error && error.gstnumber &&
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error.gstnumber}
                                </FormControl.ErrorMessage>
                            }
                        </FormControl>
                        {props.screentype != "view" &&
                            <MaterialButtonDark onPress={() => _attemptSubmit()}>Save Changes</MaterialButtonDark>
                        }
                    </VStack>
                </Box>
            </Center>
            {showLoader()}

        </ScrollView>
    )
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        success: state.auth.success
    }
};
export default connect(mapStateToProps, actions)(ProfileComponent)