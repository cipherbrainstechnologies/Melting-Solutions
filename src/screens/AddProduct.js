import { Box, Center, FormControl, Stack, VStack, WarningOutlineIcon, ScrollView, Input, Icon, Radio, HStack, StatusBar } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    Alert,
    Platform
} from 'react-native';
import { FontBold, FontSemiBold } from '../common/Constants';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet from "react-native-actions-sheet";
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { FirebaseContext } from '../../redux';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../redux/actions/productactions';
import Spinner from '../components/Spinner';
import { showToastError, showToastSuccess } from '../../redux/actions/Validation';


var { width } = Dimensions.get('window');

function AddProduct(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();

    const actionSheetRef = useRef(null);
    const [actionUid, setActionUid] = useState(null)
    const [error, setError] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const {
        product_title,
        product_desc,
        product_quantity_type,
        product_image,
        productTitleChange,
        productDescChange,
        productQuantityTypeChange,
        productImageChange,
        productImageBlobChange
    } = props;

    useEffect(() => {
        setActionUid(props.navigation.getParam('actionUid'))
    }, []);

    useEffect(() => {
        // console.log("auth login==> ", auth);

        // if (auth.info) {
        //     console.log("auth login======> ");
        //     props.navigation.navigate('AuthLoading');
        // }
        if (props.error && props.error.msg) {
            showToastError(props.error.msg);
            dispatch(api.clearProductError())
            console.log("Error==> ", props.error.msg);
        }

        if (props.success == "success") {
            if (props.success_status == "add_success") {
                showToastSuccess("Product added successfully")
            } else if (props.success_status == "edit_success") {
                showToastSuccess("Product updated successfully")
            }
            dispatch(api.clearProductError())
            props.navigation.goBack()
        }

    }, [props.error, props.error.msg, props.success]);

    const showActionSheet = () => {
        actionSheetRef.current?.setModalVisible(true);
    }

    const removeImage = () => {
        productImageChange(null)
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
            if (!result.cancelled) {
                productImageChange(result.uri)
            }
        } else {
            Alert.alert('Alert', 'Camera Permisison Error')
        }
    }

    const _attemptSubmit = () => {
        const { product_title, product_desc, product_quantity_type } = props;
        setError(null)
        if (product_title == undefined || product_title == "") {
            setError({ product_title: "Please enter title" })
        } else if (product_desc == undefined || product_desc == "") {
            setError({ product_desc: "Please enter description" })
        } else if (product_quantity_type == undefined || product_quantity_type == "") {
            setError({ product_quantity_type: "Select quantity " })
        } else if (product_image == undefined || product_image == "") {
            showToastError("Product image require*");
        } else {
            actionUid ? dispatch(api.editProduct(actionUid)) : dispatch(api.addProduct())
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
            <Header title={actionUid ? 'Edit Product' : 'Add Product'} onPress={() => props.navigation.goBack()} isTitleCenter={false} />
            <ScrollView _contentContainerStyle={{
                // px: "10px",
                mb: "4",
                minW: "72"
            }}>

                <Center w="100%">
                    <Box p="2" w="95%">

                        <VStack space={3} mt="0">
                            {uploadImage()}

                            <Stack style={{ marginVertical: 10, alignItems: 'center' }}>
                                {product_image ?
                                    <Image
                                        source={{ uri: product_image }}
                                        style={globleStyles.profileIcon}
                                    />
                                    :
                                    <Image
                                        source={require('../../assets/icon.png')}
                                        style={globleStyles.profileIcon}
                                    />
                                }
                                {/* image picker */}
                                <TouchableOpacity activeOpacity={.5} style={globleStyles.profileEditView} onPress={showActionSheet}>
                                    <Text style={globleStyles.normalTextWhite}>Upload</Text>
                                </TouchableOpacity>

                            </Stack>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    label={'Product Name'}
                                    onChangeText={productTitleChange}
                                    blurOnSubmit={false}
                                    value={product_title}
                                    returnKey={"next"}
                                    // keyboardType={"email-address"}
                                    secureEntry={false}
                                    placeholder={"Enter Product Name"} >
                                    {/* <Entypo name="user" color={colors.GREY_7} size={20} /> */}
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {error && error.product_title &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.product_title}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    label={'Description'}
                                    onChangeText={productDescChange}
                                    blurOnSubmit={false}
                                    // onSubmitEditing={() => this.onSubmit("email")}
                                    value={product_desc}
                                    returnKey={"next"}
                                    // keyboardType={"email-address"}
                                    secureEntry={false}
                                    placeholder={"Enter Description up to 200 characters"}
                                    multiline
                                    maxLength={200}
                                    textInputStyle={{ paddingLeft: 0 }}>
                                </InputCard>
                                {error && error.product_desc &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.product_desc}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>

                            <FormControl isInvalid>
                                <Text style={{ ...globleStyles.normalText, ...globleStyles.fontSemiBold }}>Quantity Type</Text>
                                <Radio.Group defaultValue={product_quantity_type} name="myRadioGroup" accessibilityLabel="Pick your favorite number" onChange={productQuantityTypeChange}>
                                    <HStack space={4}>
                                        <Radio value="KG" my={1} colorScheme="blue" color="green" selectedColor="yellow">
                                            KG
                                        </Radio>
                                        <Radio value="Number" my={1} colorScheme="blue">
                                            Number
                                        </Radio>
                                    </HStack>
                                </Radio.Group>
                                {error && error.product_quantity_type &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.product_quantity_type}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>

                            <MaterialButtonDark onPress={() => _attemptSubmit()}>{actionUid ? 'Update' : 'Submit'}</MaterialButtonDark>

                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        product_title: state.productsdata.product_title,
        product_desc: state.productsdata.product_desc,
        product_quantity_type: state.productsdata.product_quantity_type,
        product_image: state.productsdata.product_image,
        product_image_blob: state.productsdata.product_image_blob,
        success: state.productsdata.success,
        success_status: state.productsdata.success_status,
        loading: state.productsdata.loading,
        error: state.productsdata.error
    }
};
export default connect(mapStateToProps, actions)(AddProduct)


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