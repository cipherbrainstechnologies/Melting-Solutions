import { Box, Center, VStack, WarningOutlineIcon, ScrollView, Input, Icon, Pressable, HStack, Spacer, StatusBar, useColorModeValue, Stack, Image, Checkbox, FormControl, Alert } from 'native-base';
import React, { useContext, useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Animated,
    Platform
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
import { FontAwesome } from '@expo/vector-icons';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../redux/actions/orderactions';
import { FirebaseContext } from '../../redux';
import { FontRegular, FontSemiBold, STATUS_QUOTE_ACCEPT_PAYMENT, STATUS_QUOTE_CONFIRMED_PROCESSING, STATUS_QUOTE_SEND } from '../common/Constants';
import ActionSheet from 'react-native-actions-sheet';
import Spinner from '../components/Spinner';
import { convertDate, formatFirestoreDate, showToastError, showToastSuccess, STATUS } from '../../redux/actions/Validation';

var { width } = Dimensions.get('window');

function OrderDetails(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();

    const actionSheetRef = useRef(null);

    const [tabIndex, setTabIndex] = useState(2)
    const [data, setData] = useState([])
    const [screentype, setScreentype] = useState(null)
    const [totalPayment, setTotalPayment] = useState(0)
    const [paymentMethodType, setPaymentMethodType] = useState("online")
    const [bankName, setBankName] = useState(null)
    const [chequeNumber, setChequeNumber] = useState(null)
    const [transactionId, setTransactionId] = useState(null)
    const [error, setError] = useState(null);

    useEffect(() => {
        setData(props.navigation.getParam('item'))
        setScreentype(props.navigation.getParam('screentype'))
    }, []);

    useEffect(() => {

        if (props.error && props.error.msg) {
            showToastError(props.error.msg);
            dispatch(api.clearOrderError())
        }

        if (props.success == "success") {
            if (props.success_status == STATUS_QUOTE_SEND) {
                showToastSuccess("Quote sent successfully")
            } else if (props.success_status == STATUS_QUOTE_ACCEPT_PAYMENT) {
                showToastSuccess("You have accepted quote and payment")
            } else if (props.success_status == STATUS_QUOTE_CONFIRMED_PROCESSING) {
                showToastSuccess("You have confirmed quote and processing order")
            }
            dispatch(api.clearOrderError())
            props.navigation.goBack()
        }

    }, [props.error, props.error.msg, props.success]);

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    const sendQuote = () => {
        dispatch(api.doQuoteSent(data))
    }

    const addAmounttoQoute = (id, text) => {
        if (text !== '' && isNaN(text)) return
        const newArr = data.cart.map((item) => {
            if (id == item.id) {
                return { ...item, price: text };
            }
            return item;
        });
        const totalsum = newArr.reduce((sum, item) => sum + Number(item.price || 0), 0);
        setData({ ...data, cart: newArr, totalPayment: totalsum })
    }

    const onProductChecked = (id, status) => {
        const newArr = data.cart.map((item) => {
            if (id == item.id) {
                return { ...item, status: status ? "active" : "deactive" };
            }
            return item;
        });
        const totalsum = newArr.reduce((sum, item) => {
            if (item.status === 'active' && item.price) {
                return sum + Number(item.price);
            }
            return sum;
        }, 0);
        setData({ ...data, cart: newArr, totalPayment: totalsum })
    }

    const _attemptPaymentMethodSubmit = () => {
        setError(null)
        if (paymentMethodType == "online") {
            if (transactionId == undefined || transactionId == "") {
                setError({ transactionId: "Please enter transaction id" })
                return
            }
            setData({ ...data, paymentMethod: paymentMethodType, transactionId })
        } else if (paymentMethodType == "cheque") {
            if (bankName == undefined || bankName == "") {
                setError({ bankName: "Please enter bank name" })
                return
            } else if (chequeNumber == undefined || chequeNumber == "") {
                setError({ chequeNumber: "Please enter cheque" })
                return
            }
            setData({ ...data, paymentMethod: paymentMethodType, bankName, chequeNumber })
        } else {
            setData({ ...data, paymentMethod: paymentMethodType })
        }

        actionSheetRef.current?.setModalVisible(false);
    }

    const acceptAndPayment = () => {
        if (data.paymentMethod == "online") {
            if (data.transactionId == undefined || data.transactionId == "") {
                actionSheetRef.current?.setModalVisible(true)
                return
            }
        } else if (data.paymentMethod == "cheque") {
            if (data.bankName == undefined || data.bankName == "") {
                actionSheetRef.current?.setModalVisible(true)
                return
            } else if (data.chequeNumber == undefined || data.chequeNumber == "") {
                actionSheetRef.current?.setModalVisible(true)
                return
            }
        } else if (data.paymentMethod == undefined) {
            actionSheetRef.current?.setModalVisible(true)
            return
        }

        dispatch(api.doQuoteAcceptAndPayment(data))

    }

    const confirmedAndProcessing = () => {
        dispatch(api.doQuoteConfirmedAndProcessing(data))
    }

    const hideActionSheet = () => {
        actionSheetRef.current?.setModalVisible(false);
    }

    const paymentMethodActionSheet = () => {
        return (
            <ActionSheet ref={actionSheetRef}>
                <Text style={{ color: colors.BLACK, fontFamily: FontSemiBold, padding: 15, paddingBottom: 10, paddingLeft: 15, fontSize: 18 }}>Payment Method</Text>
                <Text style={{ color: colors.GREY_7, paddingHorizontal: 15, paddingBottom: 8, fontSize: 13 }}>
                    Payments are verified manually. For online transfer, enter your UPI/bank transaction reference.
                </Text>
                <View style={{ height: 1, backgroundColor: colors.GREY_3, margin: 5, marginHorizontal: 10 }} />

                <HStack space="1.5" marginX="3.5" pt="2" pb="2">

                    <TouchableOpacity onPress={() => setPaymentMethodType("online")}>
                        <Text style={[{ ...styles.textWithBorder }, paymentMethodType == "online" && { borderColor: colors.PRIMARY_DARK, backgroundColor: colors.PRIMARY_LIGHT }]}>Online Transfer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setPaymentMethodType("cheque")}>
                        <Text style={[{ ...styles.textWithBorder }, paymentMethodType == "cheque" && { borderColor: colors.PRIMARY_DARK, backgroundColor: colors.PRIMARY_LIGHT }]}>Cheque</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setPaymentMethodType("credit")}>
                        <Text style={[{ ...styles.textWithBorder }, paymentMethodType == "credit" && { borderColor: colors.PRIMARY_DARK, backgroundColor: colors.PRIMARY_LIGHT }]}>Credit</Text>
                    </TouchableOpacity>

                </HStack>

                <VStack marginX={3.5} space={1}>

                    {paymentMethodType == "online" &&
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => setTransactionId(text)}
                                value={transactionId}
                                secureEntry={false}
                                placeholder={"Transaction / UPI reference *"}
                                textInputStyle={{
                                    paddingBottom: 2,
                                    fontSize: 14,
                                    color: colors.BLACK,
                                    height: Platform.OS == 'ios' ? 35 : 35,
                                    paddingLeft: 0,
                                    textAlignVertical: 'center',
                                }}>
                            </InputCard>
                            {error && error.transactionId &&
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error.transactionId}
                                </FormControl.ErrorMessage>
                            }
                        </FormControl>
                    }

                    {paymentMethodType == "cheque" &&
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => setBankName(text)}
                                value={bankName}
                                secureEntry={false}
                                placeholder={"Bank Name *"}
                                textInputStyle={{
                                    paddingBottom: 2,
                                    fontSize: 14,
                                    color: colors.BLACK,
                                    height: Platform.OS == 'ios' ? 35 : 35,
                                    paddingLeft: 0,
                                    textAlignVertical: 'center',
                                }}>
                            </InputCard>
                            {error && error.bankName &&
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error.bankName}
                                </FormControl.ErrorMessage>
                            }
                        </FormControl>
                    }

                    {paymentMethodType == "cheque" &&
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => setChequeNumber(text)}
                                value={chequeNumber}
                                secureEntry={false}
                                placeholder={"Cheque No *"}
                                textInputStyle={{
                                    paddingBottom: 2,
                                    fontSize: 14,
                                    color: colors.BLACK,
                                    height: Platform.OS == 'ios' ? 35 : 35,
                                    paddingLeft: 0,
                                    textAlignVertical: 'center',
                                }}>
                            </InputCard>
                            {error && error.chequeNumber &&
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {error.chequeNumber}
                                </FormControl.ErrorMessage>
                            }
                        </FormControl>
                    }

                </VStack>

                <View style={{ height: 1, backgroundColor: colors.GREY_3, marginTop: 10, marginHorizontal: 10 }} />

                <MaterialButtonDark onPress={() => { _attemptPaymentMethodSubmit() }} style={{ marginHorizontal: 15 }}>Submit</MaterialButtonDark>

            </ActionSheet >
        )
    }

    const renderItem = (item, index) => {

        return <HStack borderBottomColor={colors.GREY_4} borderBottomWidth={1} pb="2" pt="1" mb="1">
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
                <VStack flex="2">
                    <Text style={styles.text1}>{item.title}</Text>
                    <Text style={{ ...styles.text2, fontSize: 12, paddingTop: -5 }}>Expected date {formatFirestoreDate(item.expectedDate, 'D MMM YY')}</Text>
                    {screentype != "user_quote_request" &&
                        <FormControl isRequired isInvalid>
                            <InputCard
                                onChangeText={(text) => {
                                    // item.price = text
                                    addAmounttoQoute(item.id, text)
                                }}
                                placeholder={"Quote price"}
                                textInputStyle={{ paddingLeft: 5, paddingBottom: 5, height: 35 }}
                                cardInputStyle={{ width: "70%" }}
                                returnKey={"next"}
                                keyboardType={"phone-pad"}
                                value={item.price}
                                editable={screentype == "admin_quote_request"}
                            >
                                {/* <MaterialIcons name="currency_rupee" color={colors.GREY_7} size={20} /> */}
                                <FontAwesome name="rupee" size={14} color={colors.GREY_7} />
                            </InputCard>
                        </FormControl>
                    }
                </VStack>
                <VStack flex="1">
                    <Text style={{ ...styles.text1, textAlign: 'right' }}>{item.quantity} {item.quantity_type}</Text>
                    <Text style={{ ...styles.text2, color: colors.BLACK, fontSize: 16, paddingTop: -5, textAlign: 'right' }}>₹{item.price ? item.price : 0}</Text>
                </VStack>
            </HStack>
        </HStack>
    }

    const renderItem1 = (item, index) => {
        return <HStack borderBottomColor={colors.GREY_4} borderBottomWidth={1} pb="2" pt="1" mb="1">
            <Checkbox value="one" my={0} isChecked={item.status == "active"} onChange={state => onProductChecked(item.id, state)}>
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
            </Checkbox>
            <HStack justifyContent="space-between" flex="1" pl="2">
                <VStack>
                    <Text style={styles.text1}>{item.title}</Text>
                    <Text style={{ ...styles.text2, fontSize: 12, paddingTop: -5 }}>Expected date {formatFirestoreDate(item.expectedDate, 'D MMM YY')}</Text>
                </VStack>
                <VStack>
                    <Text style={{ ...styles.text1, textAlign: 'right' }}>{item.quantity} {item.quantity_type}</Text>
                    {screentype != "user_quote_request" &&
                        <Text style={{ ...styles.text2, color: colors.BLACK, fontSize: 16, paddingTop: -5, textAlign: 'right' }}>₹{item.price ? item.price : 0}</Text>}
                </VStack>
            </HStack>
        </HStack>
    }

    const renderItemOrder = (item, index) => {
        return item.status == "active" && <HStack borderBottomColor={colors.GREY_4} borderBottomWidth={1} pb="2" pt="1" mb="1">
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
                <VStack flex="2">
                    <Text style={styles.text1}>{item.title}</Text>
                    {/* <Text style={{ ...styles.text2, fontSize: 12, paddingTop: -5 }}>Expected date {moment(item.expectedDate.toDate()).format("D MMMM YY")}</Text> */}
                    <Text style={{ ...styles.text2, fontSize: 12, paddingTop: -5 }}>₹{item.price ? item.price : 0}</Text>
                </VStack>
                <VStack flex="1">
                    <Text style={{ ...styles.text1, textAlign: 'right' }}>{item.quantity} {item.quantity_type}</Text>
                    <Text style={{ ...styles.text2, color: colors.BLACK, fontSize: 16, paddingTop: -5, textAlign: 'right' }}>₹{item.price ? item.price : 0}</Text>
                </VStack>
            </HStack>
        </HStack>

    }

    const renderTimeline = ({ item, index }) => {
        return <>
            <HStack space={3}>
                <VStack alignItems={'flex-end'} flex='1'>
                    <Text style={{ ...styles.text1, fontSize: 13, marginTop: -5 }}>{moment(item.created.seconds ? convertDate(item.created) : item.created).format("D MMM, YYYY")}</Text>
                    <Text style={styles.text1}>{moment(item.created.seconds ? convertDate(item.created) : item.created).format("LT")}</Text>
                </VStack>
                <VStack alignItems={'center'} >
                    <View style={{ backgroundColor: colors.PRIMARY_DARK, width: 10, height: 10, borderRadius: 50 }} />
                    <View style={{ backgroundColor: colors.PRIMARY_LIGHT, width: 1, height: 66 }} />
                </VStack>
                <VStack justifyContent={'flex-start'} flex='2' paddingY={0}>
                    {/* <View style={globleStyles.addIconView}> */}
                    {/* <Ionicons name={'person-add-outline'} size={25} color={colors.PRIMARY_DARK} /> */}
                    <Image
                        source={STATUS[index].icon}
                        style={{ width: 35, height: 35, }}
                    />
                    {/* </View> */}
                    <HStack>
                        <Text style={styles.text2}>Status : </Text>
                        <Text style={{ ...styles.text1, ...globleStyles.fontSemiBold, color: colors.PRIMARY_DARK, width: width * 0.42 }} numberOfLines={2}>{STATUS[index].status}</Text>
                    </HStack>
                </VStack>
            </HStack>
            {index == 3 &&
                <VStack>
                    <HStack space={3}>
                        <VStack alignItems={'flex-end'} flex='1'>
                            <Text style={{ ...styles.text1, fontSize: 13, marginTop: -5 }}>{moment(item.created.seconds ? convertDate(item.created) : item.created).format("D MMM, YYYY")}</Text>
                            <Text style={styles.text1}>{moment(item.created.seconds ? convertDate(item.created) : item.created).format("LT")}</Text>
                        </VStack>
                        <VStack alignItems={'center'} >
                            <View style={{ backgroundColor: colors.PRIMARY_DARK, width: 10, height: 10, borderRadius: 50 }} />
                            <View style={{ backgroundColor: colors.PRIMARY_LIGHT, width: 1, height: 66 }} />
                        </VStack>
                        <VStack justifyContent={'flex-start'} flex='2' paddingY={0}>
                            {/* <View style={globleStyles.addIconView}> */}
                            {/* <Ionicons name={'person-add-outline'} size={25} color={colors.PRIMARY_DARK} /> */}
                            <Image
                                source={STATUS[4].icon}
                                style={{ width: 35, height: 35, }}
                            />
                            {/* </View> */}
                            <HStack>
                                <Text style={styles.text2}>Status : </Text>
                                <Text style={{ ...styles.text1, ...globleStyles.fontSemiBold, color: colors.PRIMARY_DARK, width: width * 0.42 }} numberOfLines={1}>{STATUS[4].status}</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                    <HStack space={3}>
                        <VStack alignItems={'flex-end'} flex='1'>
                            <Text style={{ ...styles.text1, fontSize: 13, marginTop: -5 }}>{moment(item.created.seconds ? convertDate(item.created) : item.created).format("D MMM, YYYY")}</Text>
                            <Text style={styles.text1}>{moment(item.created.seconds ? convertDate(item.created) : item.created).format("LT")}</Text>
                        </VStack>
                        <VStack alignItems={'center'} >
                            <View style={{ backgroundColor: colors.PRIMARY_DARK, width: 10, height: 10, borderRadius: 50 }} />
                            <View style={{ backgroundColor: colors.PRIMARY_LIGHT, width: 1, height: 66 }} />
                        </VStack>
                        <VStack justifyContent={'flex-start'} flex='2' paddingY={0}>
                            {/* <View style={globleStyles.addIconView}> */}
                            {/* <Ionicons name={'person-add-outline'} size={25} color={colors.PRIMARY_DARK} /> */}
                            <Image
                                source={STATUS[5].icon}
                                style={{ width: 35, height: 35, }}
                            />
                            {/* </View> */}
                            <HStack>
                                <Text style={styles.text2}>Status : </Text>
                                <Text style={{ ...styles.text1, ...globleStyles.fontSemiBold, color: colors.PRIMARY_DARK, width: width * 0.42 }} numberOfLines={1}>{STATUS[5].status}</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>}
            {index == 4 &&
                <VStack>
                    <HStack space={3}>
                        <VStack alignItems={'flex-end'} flex='1'>
                            <Text style={{ ...styles.text1, fontSize: 13, marginTop: -5 }}>{moment(item.created.seconds ? convertDate(item.created) : item.created).format("D MMM, YYYY")}</Text>
                            <Text style={styles.text1}>{moment(item.created.seconds ? convertDate(item.created) : item.created).format("LT")}</Text>
                        </VStack>
                        <VStack alignItems={'center'} >
                            <View style={{ backgroundColor: colors.PRIMARY_DARK, width: 10, height: 10, borderRadius: 50 }} />
                            <View style={{ backgroundColor: colors.PRIMARY_LIGHT, width: 1, height: 66 }} />
                        </VStack>
                        <VStack justifyContent={'flex-start'} flex='2' paddingY={0}>
                            {/* <View style={globleStyles.addIconView}> */}
                            {/* <Ionicons name={'person-add-outline'} size={25} color={colors.PRIMARY_DARK} /> */}
                            <Image
                                source={STATUS[6].icon}
                                style={{ width: 35, height: 35 }}
                            />
                            {/* </View> */}
                            <HStack>
                                <Text style={styles.text2}>Status : </Text>
                                <Text style={{ ...styles.text1, ...globleStyles.fontSemiBold, color: colors.PRIMARY_DARK, width: width * 0.42 }} numberOfLines={1}>{STATUS[6].status}</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>}
        </>
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header
                title={`#${data.id}`}
                isTitleCenter={false}
                styleTitle={{ ...globleStyles.fontMedium }}
                onPress={() => { props.navigation.goBack() }}
            />

            <ScrollView _contentContainerStyle={{
                // px: "10px",
                mb: "4",
                minW: "72"
            }}>
                {screentype == "user_quote_request" &&
                    <Center w="100%" >
                        <Box pb="1" w="95%">

                            <Text style={styles.text1}>Order date</Text>
                            <Text style={{ ...styles.text2, fontSize: 14, paddingTop: -5 }}>{formatFirestoreDate(data.created)}</Text>
                            <View style={{ height: 20 }} />
                            {data.cart.map(obj => { return renderItem(obj) })}
                            <HStack>
                                <MaterialIcons name="location-pin" color={colors.BLACK} size={20} style={{ alignSelf: "center" }} />
                                <VStack ml="2" w="95%">
                                    <Text style={{ ...styles.text2, fontSize: 16 }}>Deliver at:</Text>
                                    <Text style={{ ...styles.text1, marginTop: -2 }}>{`${data.address && data.address.completeAddress}${data.address && data.address.floor && " ," + data.address.floor}${data.address && data.address.nearByLandmark && " ," + data.address.nearByLandmark}`}</Text>
                                </VStack>
                            </HStack>
                            <Text style={{ ...globleStyles.subHeader, fontSize: 20, marginTop: 10 }}>Message</Text>
                            <InputCard
                                multiline
                                placeholder={"Enter message here up to 200 character"}
                                textInputStyle={{ paddingLeft: 0 }}
                                maxLength={200}
                                editable={false}
                                value={data.message}
                            />

                        </Box>
                    </Center>
                }

                {(screentype == "admin_quote_request" || screentype == "admin_quote_send") &&
                    <Center w="100%" >
                        <Box pb="1" w="95%">

                            <Text style={styles.text1}>Order date</Text>
                            <Text style={{ ...styles.text2, fontSize: 14, paddingTop: -5 }}>{formatFirestoreDate(data.created)}</Text>
                            <View style={{ height: 20 }} />
                            {data.cart.map(obj => { return renderItem(obj) })}
                            <HStack>
                                <MaterialIcons name="location-pin" color={colors.BLACK} size={20} style={{ alignSelf: "center" }} />
                                <VStack ml="2" w="95%">
                                    <Text style={{ ...styles.text2, fontSize: 16 }}>Deliver at:</Text>
                                    <Text style={{ ...styles.text1, marginTop: -2 }}>{`${data.address && data.address.completeAddress}${data.address && data.address.floor && " ," + data.address.floor}${data.address && data.address.nearByLandmark && " ," + data.address.nearByLandmark}`}</Text>
                                </VStack>
                            </HStack>
                            <Text style={{ ...globleStyles.subHeader, fontSize: 20, marginTop: 10 }}>Message</Text>
                            <InputCard
                                multiline
                                placeholder={"Enter message here up to 200 character"}
                                textInputStyle={{ paddingLeft: 0 }}
                                maxLength={200}
                                editable={false}
                                value={data.message}
                            />

                            <HStack justifyContent={"space-between"} mt="4">
                                <Text style={{ ...globleStyles.subHeader, fontSize: 20 }}>Total payment</Text>
                                <Text style={{ ...globleStyles.subHeader, color: colors.BLACK, fontSize: 20 }}>
                                    {/* ₹6000 */}
                                    ₹{data.totalPayment || 0}
                                </Text>
                            </HStack>

                            {screentype == "admin_quote_request" && <MaterialButtonDark onPress={() => sendQuote()} style={styles.materialButton}>Send quote</MaterialButtonDark>}

                        </Box>
                    </Center>
                }

                {/* quote accept And Payment screen */}
                {screentype == "user_quote_received" &&
                    <Center w="100%" >
                        <Box pb="1" w="95%">

                            <Text style={styles.text1}>Order date</Text>
                            <Text style={{ ...styles.text2, fontSize: 14, paddingTop: -5 }}>{formatFirestoreDate(data.created)}</Text>
                            <View style={{ height: 20 }} />
                            {data.cart.map(obj => { return renderItem1(obj) })}
                            <HStack>
                                <MaterialIcons name="location-pin" color={colors.BLACK} size={20} style={{ alignSelf: "center" }} />
                                <VStack ml="2" w="95%">
                                    <Text style={{ ...styles.text2, fontSize: 16 }}>Deliver at:</Text>
                                    <Text style={{ ...styles.text1, marginTop: -2 }}>{`${data.address && data.address.completeAddress}${data.address && data.address.floor && " ," + data.address.floor}${data.address && data.address.nearByLandmark && " ," + data.address.nearByLandmark}`}</Text>
                                </VStack>
                            </HStack>
                            <Text style={{ ...globleStyles.subHeader, fontSize: 20, marginTop: 10 }}>Message</Text>
                            <InputCard
                                multiline
                                placeholder={"Enter message here up to 200 character"}
                                textInputStyle={{ paddingLeft: 0 }}
                                maxLength={200}
                                editable={false}
                                value={data.message}
                            />

                            <HStack justifyContent={"space-between"} mt="4">
                                <Text style={{ ...globleStyles.subHeader, fontSize: 20 }}>Total payment</Text>
                                <Text style={{ ...globleStyles.subHeader, color: colors.BLACK, fontSize: 20 }}>
                                    {/* ₹6000 */}
                                    ₹{data.totalPayment || 0}
                                </Text>
                            </HStack>
                            {data.paymentMethod &&
                                <>
                                    <HStack justifyContent={"space-between"} mt="1">
                                        <Text style={{ ...styles.text1, fontSize: 15 }}>Payment Menthod</Text>
                                        <Text style={{ ...styles.text1, fontSize: 15 }}>{data.paymentMethod}</Text>
                                    </HStack>
                                    {data.paymentMethod == "online" &&
                                        <HStack justifyContent={"space-between"} mt="1">
                                            <Text style={{ ...styles.text1, fontSize: 15 }}>Transaction Id</Text>
                                            <Text style={{ ...styles.text1, fontSize: 15 }}>{data.transactionId}</Text>
                                        </HStack>
                                    }
                                    {data.paymentMethod == "cheque" &&
                                        <>
                                            <HStack justifyContent={"space-between"} mt="1">
                                                <Text style={{ ...styles.text1, fontSize: 15 }}>Bank Name</Text>
                                                <Text style={{ ...styles.text1, fontSize: 15 }}>{data.bankName}</Text>
                                            </HStack>
                                            <HStack justifyContent={"space-between"} mt="1">
                                                <Text style={{ ...styles.text1, fontSize: 15 }}>Cheque</Text>
                                                <Text style={{ ...styles.text1, fontSize: 15 }}>{data.chequeNumber}</Text>
                                            </HStack>
                                        </>
                                    }
                                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(true)} style={{ alignSelf: 'flex-start' }}>
                                        <Text style={styles.text3}>change payment method</Text>
                                    </TouchableOpacity>
                                </>
                            }

                            <View style={{ marginVertical: 10 }} />

                            <MaterialButtonDark onPress={() => acceptAndPayment()} style={styles.materialButton}>Accept & Confirm Payment</MaterialButtonDark>

                        </Box>
                        {paymentMethodActionSheet()}
                    </Center>
                }

                {/* quote accept And Payment screen */}
                {(screentype == "admin_quote_order" || screentype == "user_quote_order" || screentype == "admin_quote_confirm" || screentype == "user_quote_confirm") &&
                    <Center w="100%" >
                        <Box pb="1" pt={2} w="95%">

                            <FlatList
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                data={data.timeline}
                                // extraData={this.state}
                                renderItem={renderTimeline}
                                scrollEnabled={false}
                            />
                            {/* <Text style={styles.text1}>Order Date</Text>
                            <Text style={{ ...styles.text2, fontSize: 14, paddingTop: -5 }}>{moment(new Date((data.created.seconds + data.created.nanoseconds * 10 ** -9) * 1000)).format("D MMMM YYYY")}</Text> */}
                            <HStack paddingY={2}>
                                <MaterialIcons name="location-pin" color={colors.BLACK} size={20} style={{ alignSelf: "center" }} />
                                <VStack ml="2" w="95%">
                                    <Text style={{ ...styles.text2, fontSize: 16 }}>Deliver at:</Text>
                                    <Text style={{ ...styles.text1, marginTop: -2 }}>{`${data.address && data.address.completeAddress}${data.address && data.address.floor && " ," + data.address.floor}${data.address && data.address.nearByLandmark && " ," + data.address.nearByLandmark}`}</Text>
                                </VStack>
                            </HStack>
                            <View style={{ height: 20 }} />
                            {data.cart.map(obj => { return renderItemOrder(obj) })}

                            {/* <Text style={{ ...globleStyles.subHeader, fontSize: 20, marginTop: 10 }}>Message</Text>
                            <Text style={{ ...globleStyles.normalText, fontSize: 16, marginTop: 5 }}>{data.message}</Text> */}

                            {/* <HStack justifyContent={"space-between"} mt="2">
                                <Text style={{ ...styles.text1, fontSize: 15 }}>Item Total</Text>
                                <Text style={{ ...styles.text1, fontSize: 15 }}>₹12000.00</Text>
                            </HStack>
                            <HStack justifyContent={"space-between"} mt="1">
                                <Text style={{ ...styles.text1, fontSize: 15 }}>Delivery Charges</Text>
                                <Text style={{ ...styles.text1, fontSize: 15 }}>₹500.00</Text>
                            </HStack>
                            <HStack justifyContent={"space-between"} mt="1">
                                <Text style={{ ...styles.text1, fontSize: 15 }}>Taxes and Charges</Text>
                                <Text style={{ ...styles.text1, fontSize: 15 }}>₹60.50</Text>
                            </HStack> */}
                            {/* <View style={{ height: 1, backgroundColor: colors.GREY_3, marginVertical: 10 }} /> */}

                            <HStack justifyContent={"space-between"} mt="0">
                                <Text style={{ ...globleStyles.subHeader, fontSize: 20 }}>Total payment</Text>
                                <Text style={{ ...globleStyles.subHeader, color: colors.BLACK, fontSize: 20 }}>
                                    {/* ₹6000 */}
                                    ₹{data.totalPayment || 0}
                                </Text>
                            </HStack>
                            {data.paymentMethod &&
                                <>
                                    <HStack justifyContent={"space-between"} mt="1">
                                        <Text style={{ ...styles.text1, fontSize: 15 }}>Payment Menthod</Text>
                                        <Text style={{ ...styles.text1, fontSize: 15 }}>{data.paymentMethod}</Text>
                                    </HStack>
                                    {data.paymentMethod == "online" &&
                                        <HStack justifyContent={"space-between"} mt="1">
                                            <Text style={{ ...styles.text1, fontSize: 15 }}>Transaction Id</Text>
                                            <Text style={{ ...styles.text1, fontSize: 15 }}>{data.transactionId}</Text>
                                        </HStack>
                                    }
                                    {data.paymentMethod == "cheque" &&
                                        <>
                                            <HStack justifyContent={"space-between"} mt="1">
                                                <Text style={{ ...styles.text1, fontSize: 15 }}>Bank Name</Text>
                                                <Text style={{ ...styles.text1, fontSize: 15 }}>{data.bankName}</Text>
                                            </HStack>
                                            <HStack justifyContent={"space-between"} mt="1">
                                                <Text style={{ ...styles.text1, fontSize: 15 }}>Cheque</Text>
                                                <Text style={{ ...styles.text1, fontSize: 15 }}>{data.chequeNumber}</Text>
                                            </HStack>
                                        </>
                                    }
                                </>
                            }
                            <View style={{ marginVertical: 10 }} />

                            {screentype == "admin_quote_order" &&
                                <MaterialButtonDark onPress={() => confirmedAndProcessing()} style={styles.materialButton}>Confirmed & Processing Order</MaterialButtonDark>
                            }
                        </Box>
                        {paymentMethodActionSheet()}
                    </Center>
                }

            </ScrollView>
            {showLoader()}

        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        success: state.orderdata.success,
        success_status: state.orderdata.success_status,
        loading: state.orderdata.loading,
        error: state.orderdata.error
    }
};
export default connect(mapStateToProps, actions)(OrderDetails)

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
        textDecorationLine: 'underline'
    },
    textWithBorder: {
        ...globleStyles.fontReg,
        fontSize: 12,
        borderWidth: 1,
        borderRadius: 0,
        borderColor: colors.GREY_4,
        backgroundColor: colors.WHITE,
        paddingHorizontal: 15,
        paddingVertical: 5
    },
})