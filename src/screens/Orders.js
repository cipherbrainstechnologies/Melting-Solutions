import { Box, Center, VStack, WarningOutlineIcon, ScrollView, Input, Icon, Pressable, HStack, Spacer, StatusBar, useColorModeValue, Stack, Image } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Linking
} from 'react-native';
import globleStyles, { height } from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { TabView, SceneMap } from "react-native-tab-view";
import CustomSwitch from '../components/CustomSwitch';
import moment from 'moment';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/orderactions';
import { FirebaseContext } from '../../redux';
import { convertDate, showToastError, showToastSuccess } from '../../redux/actions/Validation';
import { STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND, STATUS_QUOTE_ACCEPT_PAYMENT, STATUS_QUOTE_CONFIRMED_PROCESSING, STATUS_ORDER_COMPLETED } from '../common/Constants';
import MaterialButtonLight from '../components/MaterialButtonLight';
import Spinner from '../components/Spinner';
import DateTimePickerModal from "react-native-modal-datetime-picker";

var { width } = Dimensions.get('window');

function Orders(props) {

    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const usertype = useSelector(state => state.auth.info.usertype);

    const [tabIndex, setTabIndex] = useState(1)
    // const [data, setData] = useState(Array(10).fill(0))
    const [data, setData] = useState(Array(10).fill(0))
    const [fromDateModalOpen, setFromDateModalOpen] = useState(false);
    const [toDateModalOpen, setToDateModalOpen] = useState(false);

    const onSelectSwitch = index => {
        setTabIndex(index)
    };

    useEffect(() => {
        dispatch(api.fetchQuoteData(STATUS_QUOTE_REQUESTED))
        dispatch(api.fetchQuoteData(STATUS_QUOTE_SEND))
        dispatch(api.fetchQuoteData(STATUS_QUOTE_ACCEPT_PAYMENT))
        dispatch(api.fetchQuoteData(STATUS_QUOTE_CONFIRMED_PROCESSING))
    }, [dispatch, api.fetchQuoteData]);

    useEffect(() => {

        if (props.error && props.error.msg) {
            showToastError(props.error.msg);
            dispatch(api.clearOrderError())
        }

        // if (props.success == "success") {
        //     showToastSuccess("Quote requested successfully")
        //     dispatch(api.clearCartError())
        //     dispatch({ type: CLEAR_CART, payload: null });
        //     props.navigation.goBack()
        // }

        if (props.success == "success") {
            if (props.success_status == STATUS_ORDER_COMPLETED) {
                showToastSuccess("Order completed successfully")
            }
                if (props.success_status == "chat") {
                if (!props.data?.receiverData?.uid || !props.data?.usersChatId) {
                    showToastError("Unable to open chat. Recipient not found.")
                } else {
                    props.navigation.navigate("ChatBoard", {
                        chatId: props.data.usersChatId,
                        receiver: props.data.receiverData,
                        title: `${props.data.receiverData.firstname} ${usertype == "admin" ? props.data.receiverData.lastname : ''}`,
                        profileImage: props.data.receiverData.image,
                        orderData: props.data.orderData
                    })
                }
            }
            dispatch(api.clearOrderError())
        }

    }, [props.error, props.error.msg, props.success, props.success_status]);

    const handleFromDateConfirm = (date) => {

        setFromDateModalOpen(false)
        // setState({ ...state, expectedDate: date })
        props.fromDateOrderChange(date)
        props.toDate && applyDateFilter()
    }

    const handleToDateConfirm = (date) => {

        setToDateModalOpen(false)
        // setState({ ...state, expectedDate: date })
        props.toDateOrderChange(date)
        props.fromDate && applyDateFilter()

    }

    const resetFilter = () => {
        props.fromDateOrderChange("")
        props.toDateOrderChange("")
        if (props.toDate || props.fromDate) {
            // console.log("applyDateFilter");
            applyDateFilter()
        }
        // props.toDate && applyDateFilter()
        // props.fromDate && applyDateFilter()
    }

    const applyDateFilter = () => {
        if (tabIndex == 1) {
            dispatch(api.fetchQuoteData(STATUS_QUOTE_REQUESTED))
        } else if (tabIndex == 2) {
            dispatch(api.fetchQuoteData(STATUS_QUOTE_SEND))
        } else if (tabIndex == 3) {
            dispatch(api.fetchQuoteData(STATUS_QUOTE_ACCEPT_PAYMENT))
        } else if (tabIndex == 4) {
            dispatch(api.fetchQuoteData(STATUS_QUOTE_CONFIRMED_PROCESSING))
        }
    }

    const renderItem1 = ({ item, index }) => {
        var screentype = ""
        var count = 0;
        item.cart.map(i => i.status == "active" && count++)
        return <TouchableOpacity activeOpacity={0.9} onPress={() => {

            if (tabIndex == 1)
                if (usertype == "admin") screentype = "admin_quote_request"
                else screentype = "user_quote_request"
            else if (tabIndex == 2)
                if (usertype == "admin") screentype = "admin_quote_send"
                else screentype = "user_quote_received"
            else if (tabIndex == 3)
                if (usertype == "admin") screentype = "admin_quote_order"
                else screentype = "user_quote_order"
            else if (tabIndex == 4)
                if (usertype == "admin") screentype = "admin_quote_confirm"
                else screentype = "user_quote_confirm"

            props.navigation.navigate('OrderDetails', { item, screentype })
            // props.navigation.navigate('OrderManagement')
        }}>
            <Stack borderBottomColor={colors.GREY_5} borderBottomWidth={1} pb="2" pt="1">
                <HStack justifyContent="space-between" >
                    <Text style={styles.text1}>#{item.id}</Text>
                    {/* <Text style={styles.text1}>₹6000.00</Text> */}
                    {item.paymentMethod && <Text style={{...styles.text1, color: colors.PRIMARY_DARK}}>{item.paymentMethod}</Text>}
                </HStack>
                <Text style={styles.text2}>{count} Items</Text>
                <HStack justifyContent="space-between">
                    <VStack>
                        <Text style={styles.text2}>{moment(convertDate(item.created)).format("MMM D, YYYY [at] LT")}</Text>
                        {/* <Text style={styles.text2}>{moment(item.created).format("MMM D, YYYY [at] LT")}</Text> */}
                        <Text style={styles.text2}>{item.cart[0].title}</Text>
                    </VStack>
                    <MaterialButtonDark onPress={() => dispatch(api.onChatBoardClick(item))} style={styles.materialButton}>Chat</MaterialButtonDark>
                </HStack>
                {usertype == "admin" && (tabIndex == 3 || tabIndex == 4) &&
                    <HStack justifyContent="space-between" mt={2}>
                        <HStack alignItems={'center'} flex={1}>
                            <Image
                                source={{ uri: item.image }}
                                style={{ width: 30, height: 30, borderRadius: 50 }}
                            />
                            <VStack ml={2}>
                                <Text style={styles.text3} numberOfLines={1}>{item.firstname} {item.lastname}</Text>
                                <Text style={styles.text3} numberOfLines={1}>Mo: {item.phoneNumber}</Text>
                            </VStack>
                        </HStack>
                        <MaterialButtonDark onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)} style={styles.materialButton}>Call</MaterialButtonDark>
                    </HStack>
                }
                {usertype == "admin" && tabIndex == 4 && item.status == "QUOTE_CONFIRMED_PROCESSING" &&
                    <MaterialButtonLight onPress={() => dispatch(api.doCompleteOrder(item))} style={styles.materialButtonLight}>Mark this order was completed</MaterialButtonLight>
                }
            </Stack>
        </TouchableOpacity>
    }

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header title={'Orders'} isLeftIconHide isTitleCenter={false} rightIconName="back-in-time" onPressRightIcon={() => resetFilter()} />

            {/* <Center w="100%" > */}
            <Box pb="150" w="100%" paddingX={2.5}>

                <HStack space={3} justifyContent="center">
                    <TouchableOpacity style={{ flex: 1, borderColor: colors.PRIMARY_DARK, borderWidth: 1 }} onPress={() => setFromDateModalOpen(true)}>
                        <HStack justifyContent="space-between" style={{ alignItems: 'center', paddingRight: 5 }}>
                            <Text style={{ ...globleStyles.normalText, padding: 5, paddingHorizontal: 8, color: colors.GREY_8 }}>{props.fromDate ? moment(props.fromDate).format("D MMM YY") : "From"}</Text>
                            <Entypo name="calendar" color={colors.PRIMARY_DARK} size={20} />
                        </HStack>
                    </TouchableOpacity>
                    <Text style={{ ...globleStyles.subHeader, fontSize: 20, ...globleStyles.fontMedium }}>To</Text>
                    <TouchableOpacity style={{ flex: 1, borderColor: colors.PRIMARY_DARK, borderWidth: 1 }} onPress={() => setToDateModalOpen(true)}>
                        <HStack justifyContent="space-between" style={{ alignItems: 'center', paddingRight: 5 }}>
                            <Text style={{ ...globleStyles.normalText, padding: 5, paddingHorizontal: 8, color: colors.GREY_8 }}>{props.toDate ? moment(props.toDate).format("D MMM YY") : "To"}</Text>
                            <Entypo name="calendar" color={colors.PRIMARY_DARK} size={20} />
                        </HStack>
                    </TouchableOpacity>
                </HStack>
                <View style={{ alignItems: 'center', margin: 15 }}>
                    {usertype == "admin" ?
                        <CustomSwitch
                            selectionMode={tabIndex}
                            roundCorner={false}
                            option1={'Quote Request'}
                            option2={'Quote Send'}
                            option3={'Order'}
                            option4={'Order Confirmed'}
                            onSelectSwitch={onSelectSwitch}
                            selectionColor={colors.PRIMARY_DARK}
                        />
                        :
                        <CustomSwitch
                            selectionMode={tabIndex}
                            roundCorner={false}
                            option1={'Quote Request'}
                            option2={'Quote Received'}
                            option3={'Order'}
                            option4={'Order Confirmed'}
                            onSelectSwitch={onSelectSwitch}
                            selectionColor={colors.PRIMARY_DARK}
                        />
                    }
                </View>
                {tabIndex == 1 && <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={props.quote_request}
                    renderItem={renderItem1}
                    style={{ maxHeight: height - 227 }}
                />}
                {tabIndex == 2 && <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={usertype == "admin" ? props.quote_send : props.quote_received}
                    renderItem={renderItem1}
                    style={{ maxHeight: height - 227 }}
                />}
                {tabIndex == 3 && <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={props.order}
                    renderItem={renderItem1}
                    style={{ maxHeight: height - 227 }}
                />}
                {tabIndex == 4 && <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={props.order_confirm}
                    renderItem={renderItem1}
                    style={{ maxHeight: height - 227 }}
                />}
            </Box>
            {/* </Center> */}

            <DateTimePickerModal
                date={props.fromDate ? props.fromDate : new Date()}
                // minimumDate={new Date()}
                maximumDate={props.toDate ? props.toDate : new Date()}
                isVisible={fromDateModalOpen}
                mode={"date"}
                onConfirm={handleFromDateConfirm}
                onCancel={() => setFromDateModalOpen(false)}
            />
            <DateTimePickerModal
                date={props.toDate ? props.toDate : new Date()}
                minimumDate={props.fromDate ? props.fromDate : new Date()}
                isVisible={toDateModalOpen}
                mode={"date"}
                onConfirm={handleToDateConfirm}
                onCancel={() => setToDateModalOpen(false)}
            />
            {showLoader()}

        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        quote_request: state.orderdata.quote_request,
        quote_send: state.orderdata.quote_send,
        quote_received: state.orderdata.quote_received,
        order: state.orderdata.order,
        order_confirm: state.orderdata.order_confirm,
        fromDate: state.orderdata.fromDate,
        toDate: state.orderdata.toDate,
        success: state.orderdata.success,
        success_status: state.orderdata.success_status,
        data: state.orderdata.data,
        loading: state.orderdata.loading,
        error: state.orderdata.error
    }
};
export default connect(mapStateToProps, actions)(Orders)

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
    },
    text1: {
        fontSize: 16,
        ...globleStyles.fontMedium,
    },
    text2: {
        fontSize: 15,
        ...globleStyles.fontMedium,
        color: colors.GREY_7,
        lineHeight: 19,
        paddingTop: 2
    },
    text3: {
        fontSize: 14,
        ...globleStyles.fontReg,
        color: colors.BLACK,
        lineHeight: 18,
        // paddingTop: 2
    },
    materialButton: { height: 30, minWidth: 70, position: 'absolute', right: 0, bottom: 0, marginVertical: 0 },
    materialButtonLight: { height: 30, width: "70%", marginTop: 10, borderColor: colors.PRIMARY_DARK, borderWidth: 1 }
})