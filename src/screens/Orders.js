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
import { colors, radii, shadows, spacing, typography } from '../common/theme';
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
import { convertDate, formatFirestoreDate, showToastError, showToastSuccess } from '../../redux/actions/Validation';
import EmptyState from '../components/EmptyState';
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

    const getActiveList = () => {
        if (tabIndex === 1) return props.quote_request || [];
        if (tabIndex === 2) return usertype === 'admin' ? props.quote_send : props.quote_received;
        if (tabIndex === 3) return props.order || [];
        return props.order_confirm || [];
    };

    const renderItem1 = ({ item }) => {
        var screentype = ""
        var count = 0;
        item.cart.map(i => i.status == "active" && count++)
        const itemLabel = count === 1 ? '1 item' : `${count} items`;
        return (
        <TouchableOpacity
            activeOpacity={0.88}
            style={styles.orderCard}
            onPress={() => {

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
        }}>
            <HStack justifyContent="space-between" alignItems="flex-start">
                <VStack flex={1} pr={2}>
                    <Text style={styles.orderId}>#{item.id}</Text>
                    <Text style={styles.orderMeta}>{itemLabel}</Text>
                    <Text style={styles.orderMeta}>{formatFirestoreDate(item.created, 'MMM D, YYYY [at] LT')}</Text>
                    <Text style={styles.orderProduct} numberOfLines={1}>{item.cart[0]?.title}</Text>
                </VStack>
                <VStack alignItems="flex-end" space={2}>
                    {item.paymentMethod && (
                        <Text style={styles.paymentBadge}>{item.paymentMethod}</Text>
                    )}
                    <MaterialButtonDark
                        onPress={() => dispatch(api.onChatBoardClick(item))}
                        style={styles.chatButton}
                    >
                        Chat
                    </MaterialButtonDark>
                </VStack>
            </HStack>
                {usertype == "admin" && (tabIndex == 3 || tabIndex == 4) &&
                    <HStack justifyContent="space-between" mt={3} alignItems="center">
                        <HStack alignItems={'center'} flex={1}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.buyerAvatar}
                            />
                            <VStack ml={2} flex={1}>
                                <Text style={styles.text3} numberOfLines={1}>{item.firstname} {item.lastname}</Text>
                                <Text style={styles.text3} numberOfLines={1}>Mo: {item.phoneNumber}</Text>
                            </VStack>
                        </HStack>
                        <MaterialButtonDark onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)} style={styles.chatButton}>Call</MaterialButtonDark>
                    </HStack>
                }
                {usertype == "admin" && tabIndex == 4 && item.status == "QUOTE_CONFIRMED_PROCESSING" &&
                    <MaterialButtonLight onPress={() => dispatch(api.doCompleteOrder(item))} style={styles.completeButton}>Mark order completed</MaterialButtonLight>
                }
        </TouchableOpacity>
        );
    }

    const renderEmpty = () => (
        <EmptyState
            icon="document-text-outline"
            title="No orders in this tab"
            description="Try another status filter or reset the date range."
        />
    );

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
            <Box pb="150" w="100%" px={spacing.md}>

                <HStack alignItems="center" mb={spacing.md} mt={spacing.sm}>
                    <TouchableOpacity style={styles.dateChip} onPress={() => setFromDateModalOpen(true)}>
                        <Text style={styles.dateChipLabel}>{props.fromDate ? moment(props.fromDate).format('D MMM YY') : 'From'}</Text>
                        <Entypo name="calendar" color={colors.PRIMARY_DARK} size={18} />
                    </TouchableOpacity>
                    <Text style={styles.dateDivider}>to</Text>
                    <TouchableOpacity style={styles.dateChip} onPress={() => setToDateModalOpen(true)}>
                        <Text style={styles.dateChipLabel}>{props.toDate ? moment(props.toDate).format('D MMM YY') : 'To'}</Text>
                        <Entypo name="calendar" color={colors.PRIMARY_DARK} size={18} />
                    </TouchableOpacity>
                </HStack>
                <View style={styles.tabWrap}>
                    {usertype == "admin" ?
                        <CustomSwitch
                            selectionMode={tabIndex}
                            roundCorner={true}
                            option1={'Quote request'}
                            option2={'Quote send'}
                            option3={'Order'}
                            option4={'Confirmed'}
                            onSelectSwitch={onSelectSwitch}
                            selectionColor={colors.PRIMARY_DARK}
                        />
                        :
                        <CustomSwitch
                            selectionMode={tabIndex}
                            roundCorner={true}
                            option1={'Quote request'}
                            option2={'Quote received'}
                            option3={'Order'}
                            option4={'Confirmed'}
                            onSelectSwitch={onSelectSwitch}
                            selectionColor={colors.PRIMARY_DARK}
                        />
                    }
                </View>
                <FlatList
                    keyExtractor={(item, index) => item.id || index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={getActiveList()}
                    renderItem={renderItem1}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={styles.listContent}
                    style={{ maxHeight: height - 240 }}
                />
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
    tabWrap: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    dateChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: colors.BORDER,
        borderWidth: 1,
        borderRadius: radii.md,
        backgroundColor: colors.WHITE,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        ...shadows.card,
    },
    dateChipLabel: {
        ...typography.body,
        color: colors.TEXT_SECONDARY,
    },
    dateDivider: {
        ...typography.caption,
        marginHorizontal: spacing.sm,
        color: colors.TEXT_SECONDARY,
        textTransform: 'lowercase',
    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    orderCard: {
        backgroundColor: colors.WHITE,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.BORDER,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.card,
    },
    orderId: {
        ...typography.heading,
        fontSize: 16,
        marginBottom: 4,
    },
    orderMeta: {
        ...typography.caption,
        marginBottom: 2,
    },
    orderProduct: {
        ...typography.bodyMedium,
        marginTop: 4,
    },
    paymentBadge: {
        ...typography.caption,
        color: colors.PRIMARY_DARK,
        backgroundColor: colors.PRIMARY_LIGHT,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radii.pill,
        overflow: 'hidden',
    },
    chatButton: {
        height: 36,
        minWidth: 72,
        marginVertical: 0,
    },
    completeButton: {
        height: 36,
        width: '100%',
        marginTop: spacing.sm,
        borderColor: colors.PRIMARY_DARK,
        borderWidth: 1,
    },
    buyerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    text3: {
        fontSize: 14,
        ...globleStyles.fontReg,
        color: colors.TEXT_PRIMARY,
        lineHeight: 18,
    },
})