import { Box, Center, VStack, WarningOutlineIcon, ScrollView, Input, Icon, Pressable, HStack, Spacer, StatusBar, useColorModeValue, Stack, Image, Checkbox, FormControl } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Animated
} from 'react-native';
import globleStyles, { height } from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, Ionicons, MaterialIcons } from 'react-native-vector-icons';

import MaterialButtonDark from '../components/MaterialButtonDark';
import { TabView, SceneMap } from "react-native-tab-view";
import CustomSwitch from '../components/CustomSwitch';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/cartactions';
import { FirebaseContext } from '../../redux';
import moment from 'moment';
import ActionSheet from 'react-native-actions-sheet';
import { FontBold, FontMedium, FontRegular, FontSemiBold } from '../common/Constants';
import { showToastError, showToastSuccess, formatFirestoreDate } from '../../redux/actions/Validation';
import Spinner from '../components/Spinner';
import { CLEAR_CART } from '../../redux/store/type';

var { width } = Dimensions.get('window');
var cartRef = null

function Cart(props) {

    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const cartdata = useSelector(state => state.cartdata);

    const actionSheetRef = useRef(null);
    const [address, setAddress] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (auth.info) {
            let address = auth.info.address;
            if (address) {
                address.slice(0, 1).map(item => {
                    setAddress(item);
                })
            }
        }
    }, [auth.info]);


    useEffect(() => {
        dispatch(api.fetchCarts())
        dispatch(api.fetchSavedAddress())
        // return () => cartRef && cartRef();
    }, [dispatch, api.fetchCarts, api.fetchSavedAddress]);

    useEffect(() => {
        if (cartdata.error && cartdata.error.msg) {
            showToastError(cartdata.error.msg);
            dispatch(api.clearCartError())
        }

        if (cartdata.success == "success") {
            // showToastSuccess("Address saved successfully")
            showToastSuccess("Quote requested successfully")
            dispatch(api.clearCartError())
            dispatch({ type: CLEAR_CART, payload: null });
            props.navigation.goBack()
        }

    }, [cartdata.error, cartdata.error.msg, cartdata.success]);

    const _attemptSubmit = () => {

        // console.log(address);
        // console.log(props.cart);
        // console.log(message);
        setError(null)
        if (address == undefined || address == "") {
            showToastError("Please choose address*");
        } else if (message == undefined || message == "") {
            setError({ message: "Please enter message" })
        } else {

            const data = {
                address,
                cart: props.cart,
                message
            }
            dispatch(api.submitForQuote(data))
        }

    }

    const showActionSheet = () => {
        actionSheetRef.current?.setModalVisible(true);
    }

    const hideActionSheet = () => {
        actionSheetRef.current?.setModalVisible(false);
    }

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    const addressActionSheet = () => {
        return (
            <ActionSheet ref={actionSheetRef}>
                <Text style={{ color: colors.BLACK, fontFamily: FontSemiBold, padding: 15, paddingBottom: 10, paddingLeft: 15, fontSize: 18 }}>Search Location</Text>
                <View style={{ height: 1, backgroundColor: colors.GREY_3, margin: 5, marginHorizontal: 10 }} />
                <TouchableOpacity style={{ width: '90%', paddingHorizontal: 15, paddingVertical: 5 }} onPress={() => {
                    props.navigation.navigate('ChooseDeliveryLocation')
                    hideActionSheet()
                }}>
                    <HStack>
                        <Entypo name="plus" color={colors.BLUE} size={18} style={{ alignSelf: 'center' }} />
                        <Text style={{ color: colors.BLUE, fontFamily: FontMedium, paddingBottom: 2, fontSize: 15 }}>{' Add Address'}</Text>
                    </HStack>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: colors.GREY_3, margin: 5, marginHorizontal: 10 }} />
                <Text style={{ color: colors.BLACK, fontFamily: FontMedium, padding: 10, paddingLeft: 15, fontSize: 16 }}>Saved Addresses</Text>

                {props.address &&
                    props.address.map((item, index) => {

                        var iconName = "home-outline"
                        if (item.addressType == "Work") {
                            iconName = "briefcase-outline"
                        } else if (item.addressType == "Home") {
                            iconName = "home-outline"
                        } else if (item.addressType == "Other") {
                            iconName = "location-outline"
                        }

                        return <HStack key={index} borderBottomColor={colors.GREY_3} borderBottomWidth={1} marginX="3.5" paddingY="2">
                            <Ionicons name={iconName} color={colors.BLACK} size={18} style={{ alignSelf: 'center' }} />
                            <HStack justifyContent="space-between" flex="1" pl="3">
                                <TouchableOpacity onPress={() => {
                                    setAddress(item)
                                    hideActionSheet()
                                }}>
                                    <VStack>
                                        <Text style={styles.text1}>{item.addressType}</Text>
                                        <Text style={{ ...styles.text2, fontSize: 12, paddingTop: -5 }}>{item.completeAddress} {item.floor && item.floor} {item.nearByLandmark && item.nearByLandmark}</Text>
                                    </VStack>
                                </TouchableOpacity>
                            </HStack>
                            <TouchableOpacity onPress={() => dispatch(api.deleteSavedAddress(item))} style={{ alignSelf: 'center' }}>
                                <Ionicons name="trash-outline" color={colors.BLACK} size={16} />
                            </TouchableOpacity>
                        </HStack>
                    })
                }




                <View style={{ height: 1, margin: 5, marginHorizontal: 10 }} />


            </ActionSheet>
        )
    }

    const renderItem = (item, index) => {
        return <HStack key={index} borderBottomColor={colors.GREY_3} borderBottomWidth={1} pb="2" pt="1" mb="1">
            {item.image ?
                <Image
                    source={{ uri: item.image }}
                    style={{ width: 50, height: 50, borderRadius: 10 }}
                />
                :
                <Image
                    source={require('../../assets/icon.png')}
                    style={{ width: 50, height: 50, borderRadius: 10 }}
                />
            }
            <HStack justifyContent="space-between" flex="1" pl="2">
                <VStack>
                    <Text style={styles.text1}>{item.title}</Text>
                    <Text style={{ ...styles.text2, fontSize: 12, paddingTop: -5 }}>Expected date {formatFirestoreDate(item.expectedDate, 'D MMM YY')}</Text>
                </VStack>
                <VStack>
                    <Text style={{ ...styles.text1, textAlign: 'right' }}>{item.quantity} {item.quantity_type}</Text>
                    {/* <Text style={{ ...styles.text2, color: colors.BLACK, fontSize: 16, paddingTop: -5, textAlign: 'right' }}>₹6000</Text> */}
                </VStack>
            </HStack>
        </HStack>
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header
                title={'Cart'}
                isTitleCenter={false}
                styleTitle={{ ...globleStyles.fontMedium }}
                onPress={() => { props.navigation.goBack() }}
            />

            <ScrollView _contentContainerStyle={{
                // px: "10px",
                mb: "4",
                minW: "72"
            }}>
                {addressActionSheet()}
                {props.cart &&
                    props.cart.length > 0 ?
                    <Center w="100%">
                        <Box pb="1" w="95%">
                            <View style={{ height: 5 }} />
                            <HStack mr={2}>
                                <MaterialIcons name="location-pin" color={colors.BLACK} size={20} style={{ alignSelf: "center" }} />
                                <VStack ml="2" w="79%">
                                    {address ?
                                        <>
                                            <Text style={{ ...styles.text2, fontSize: 16 }}>Deliver At:</Text>
                                            <Text style={{ ...styles.text1, marginTop: -2 }}>{`${address && address.completeAddress}${address && address.floor && " ," + address.floor}${address && address.nearByLandmark && " ," + address.nearByLandmark}`}</Text>
                                        </>
                                        :
                                        <Text style={{ ...styles.text1, marginTop: -2 }}>Select Address</Text>
                                    }
                                </VStack>
                                <TouchableOpacity onPress={() => showActionSheet()} style={{ alignSelf: 'center' }}>
                                    <Text style={styles.text3}>change</Text>
                                </TouchableOpacity>
                            </HStack>
                            <View style={{ height: 1, backgroundColor: colors.GREY_3, marginVertical: 10 }} />
                            {props.cart.map(obj => { return renderItem(obj) })}
                            <Text style={{ ...globleStyles.subHeader, fontSize: 20, marginTop: 10 }}>Message</Text>
                            <FormControl isRequired isInvalid>

                                <InputCard
                                    multiline
                                    placeholder={"Enter message here up to 200 character"}
                                    textInputStyle={{ paddingLeft: 0 }}
                                    maxLength={200}
                                    value={message}
                                    onChangeText={(text) => setMessage(text)}
                                />
                                {error && error.message &&
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.message}
                                    </FormControl.ErrorMessage>
                                }
                            </FormControl>
                            {/* <HStack justifyContent={"space-between"} mt="4">
                                <Text style={{ ...globleStyles.subHeader, fontSize: 20 }}>Total Payment</Text>
                                <Text style={{ ...globleStyles.subHeader, color: colors.BLACK, fontSize: 20 }}>₹6000</Text>
                            </HStack> */}
                            <MaterialButtonDark onPress={() => _attemptSubmit()}>Submit for quote</MaterialButtonDark>


                        </Box>
                    </Center>
                    :
                    <Center w="100%" h={height * .80}>

                        <VStack justifyContent={'center'} alignContent='center' space={3}>

                            <Image
                                source={require('../../assets/cart-empty.png')}
                                style={{ width: width * .50, height: width * .50 }}
                            />
                            <MaterialButtonDark onPress={() => props.navigation.goBack()}>Go Back</MaterialButtonDark>

                        </VStack>
                    </Center>
                }
                {showLoader()}
            </ScrollView>
        </View>
    );
}

const mapStateToProps = (state) => {
    // console.log(state.cartdata.cart);
    return {
        cart: state.cartdata.cart,
        address: state.cartdata.address,
        loading: state.cartdata.loading,
        error: state.cartdata.error
    }
};
export default connect(mapStateToProps, actions)(Cart)

const styles = StyleSheet.create({

    text1: {
        ...globleStyles.fontSemiBold,
        fontSize: 16
    },
    text2: {
        fontSize: 15,
        ...globleStyles.fontMedium,
        color: colors.GREY_7,
        // lineHeight: 19,
        paddingTop: 2
    },
    text3: {
        fontSize: 15,
        ...globleStyles.fontMedium,
        color: colors.BLUE,
        textDecorationLine: 'underline',
    },
})