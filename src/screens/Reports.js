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
import * as actions from '../../redux/actions/reportsactions';
import { FirebaseContext } from '../../redux';
import { convertDate, showToastError, showToastSuccess } from '../../redux/actions/Validation';
import { STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND, STATUS_QUOTE_ACCEPT_PAYMENT, STATUS_QUOTE_CONFIRMED_PROCESSING, STATUS_ORDER_COMPLETED } from '../common/Constants';
import MaterialButtonLight from '../components/MaterialButtonLight';
import Spinner from '../components/Spinner';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

var { width } = Dimensions.get('window');

function Reports(props) {

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
        dispatch(api.fetchProducts())
        dispatch(api.fetchReportData(STATUS_ORDER_COMPLETED))
    }, [dispatch, api.fetchReportData, api.fetchProducts]);

    useEffect(() => {

        if (props.error && props.error.msg) {
            showToastError(props.error.msg);
            dispatch(api.clearOrderError())
        }

        if (props.success == "success") {
            if (props.success_status == STATUS_ORDER_COMPLETED) {
                showToastSuccess("Order completed successfully")
            }
            dispatch(api.clearOrderError())
        }

    }, [props.error, props.error.msg, props.success, props.success_status]);

    const handleFromDateConfirm = (date) => {

        setFromDateModalOpen(false)
        props.fromDateOrderChange(date)
        props.toDate && applyDateFilter()
    }

    const handleToDateConfirm = (date) => {

        setToDateModalOpen(false)
        props.toDateOrderChange(date)
        props.fromDate && applyDateFilter()

    }

    const exportExcelFile = async () => {

        var rdata = []
        props.order_confirm.map(item => {
            var obj = {
                "Orderid": item.id,
                "Firstname": item.firstname,
                "Lastname": item.lastname,
                "Phone number": item.phoneNumber,
                "Email": item.email,
                "Payment method": item.paymentMethod,
                "TransactionId": item.transactionId ? item.transactionId : "",
                "Bank name": item.bankName ? item.bankName : "",
                "Cheque number": item.chequeNumber ? item.chequeNumber : "",
                "Total payment": item.totalPayment,
                "Created": moment(convertDate(item.created)).format("MMM D, YYYY [at] LT"),
                "Products": item.cart.map(u => u.title).join(', '),
            }
            rdata.push(obj)
        })

        var ws = XLSX.utils.json_to_sheet(rdata);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reports");
        const wbout = XLSX.write(wb, {
            type: 'base64',
            bookType: "xlsx"
        });
        const uri = FileSystem.cacheDirectory + 'melting-solution-report.xlsx';
        // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
        await FileSystem.writeAsStringAsync(uri, wbout, {
            encoding: FileSystem.EncodingType.Base64
        });

        await Sharing.shareAsync(uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Report data',
            UTI: 'com.microsoft.excel.xlsx'
        });
    }

    const applyDateFilter = () => {
        dispatch(api.fetchReportData(STATUS_ORDER_COMPLETED))
    }

    const renderItem1 = ({ item, index }) => {
        var screentype = ""
        var count = 0;
        item.cart.map(i => i.status == "active" && count++)
        return <TouchableOpacity activeOpacity={0.9} onPress={() => {
            screentype = "admin_quote_confirm"
            props.navigation.navigate('OrderDetails', { item, screentype })
        }}>
            <Stack borderBottomColor={colors.GREY_5} borderBottomWidth={1} pb="2" pt="1">
                <HStack justifyContent="space-between" >
                    <Text style={styles.text1}>#{item.id}</Text>
                    {/* <Text style={styles.text1}>₹6000.00</Text> */}
                    {item.paymentMethod && <Text style={{ ...styles.text1, color: colors.PRIMARY_DARK }}>{item.paymentMethod}</Text>}
                </HStack>
                <Text style={styles.text2}>{count} Items</Text>
                <HStack justifyContent="space-between">
                    <VStack>
                        <Text style={styles.text2}>{moment(convertDate(item.created)).format("MMM D, YYYY [at] LT")}</Text>
                        {/* <Text style={styles.text2}>{moment(item.created).format("MMM D, YYYY [at] LT")}</Text> */}
                        <Text style={styles.text2}>{item.cart[0].title}</Text>
                    </VStack>
                    <Text style={{ ...styles.text1, color: colors.PRIMARY_DARK }}>₹{item.totalPayment}</Text>
                    {/* <MaterialButtonDark onPress={() => dispatch(api.onChatBoardClick(item))} style={styles.materialButton}>Chat</MaterialButtonDark> */}
                </HStack>
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
                    {/* <MaterialButtonDark onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)} style={styles.materialButton}>Call</MaterialButtonDark> */}
                </HStack>
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
            <Header title={'Reports'} onPress={() => props.navigation.goBack()} isTitleCenter={false} rightIconName="share-alternative" onPressRightIcon={() => exportExcelFile()} />

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

                <Picker
                    placeholder={{}}
                    selectedValue={props.productId}
                    // useNativeAndroidPickerStyle={false}
                    style={styles.pickerStyle}
                    onValueChange={(text) => {
                        props.productIdChange(text)
                        applyDateFilter()
                    }}
                >
                    <Picker.Item style={styles.textInput} label={"All Product"} value={0} />
                    {props.products && props.products.map(item => {
                        return <Picker.Item style={styles.textInput} label={item.title} value={item.id} />
                    })}
                </Picker>

                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={props.order_confirm}
                    renderItem={renderItem1}
                    style={{
                        // maxHeight: height - 227
                        height: height - 160
                    }}
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
        products: state.productsdata.products,
        order_confirm: state.reportsdata.order_confirm,
        productId: state.reportsdata.productId,
        fromDate: state.reportsdata.fromDate,
        toDate: state.reportsdata.toDate,
        success: state.reportsdata.success,
        success_status: state.reportsdata.success_status,
        data: state.reportsdata.data,
        loading: state.reportsdata.loading,
        error: state.reportsdata.error
    }
};
export default connect(mapStateToProps, actions)(Reports)

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
    materialButtonLight: { height: 30, width: "70%", marginTop: 10, borderColor: colors.PRIMARY_DARK, borderWidth: 1 },
    pickerStyle: {
        ...globleStyles.fontReg,
        color: colors.BLACK,
        width: Dimensions.get('window').width * .83,
        fontSize: 15,
        height: 40,
        marginLeft: 20,
        paddingRight: 25,
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.DARK_BLUE,
    },
})