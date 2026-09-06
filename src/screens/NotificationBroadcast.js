import { Box, Center, VStack, WarningOutlineIcon, ScrollView, Input, Icon, Pressable, HStack, Spacer, StatusBar, useColorModeValue, Stack, Image, Checkbox, FormControl } from 'native-base';
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
import * as actions from '../../redux/actions/notificationbrodactions';
import { FirebaseContext } from '../../redux';
import { convertDate, showToastError, showToastSuccess } from '../../redux/actions/Validation';
import { STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND, STATUS_QUOTE_ACCEPT_PAYMENT, STATUS_QUOTE_CONFIRMED_PROCESSING, STATUS_ORDER_COMPLETED } from '../common/Constants';
import MaterialButtonLight from '../components/MaterialButtonLight';
import Spinner from '../components/Spinner';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NB_NOTIFICATION_BODY, NB_NOTIFICATION_TITLE, UPDATE_NB_USER } from '../../redux/store/type';

var { width } = Dimensions.get('window');

function NotificationBroadcast(props) {

    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const usertype = useSelector(state => state.auth.info.usertype);

    // const [data, setData] = useState(Array(10).fill(0))
    const [data, setData] = useState(Array(10).fill(0))
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(api.fetchNBUsers())
    }, [dispatch, api.fetchNBUsers]);

    useEffect(() => {
        dispatch({ type: NB_NOTIFICATION_TITLE, payload: "" });
        dispatch({ type: NB_NOTIFICATION_BODY, payload: "" });
    }, []);

    useEffect(() => {

        if (props.error && props.error.msg) {
            showToastError(props.error.msg);
            dispatch(api.clearNBError())
        }

        if (props.success == "success") {
            showToastSuccess("Notification broadcasted successfully")
            dispatch(api.clearNBError())
        }

    }, [props.error, props.error.msg, props.success]);

    const onUserChecked = (id, status) => {
        let newArr = props.users.map((item, i) => {
            if (id == item.uid) {
                if (status) {
                    return { ...item, status: "active" };
                } else {
                    return { ...item, status: "deactive" };
                }
            } else {
                return item
            }
        });

        dispatch({
            type: UPDATE_NB_USER,
            payload: newArr
        });
    }

    const _attemptSubmit = () => {
        const { nb_notification_title, nb_notification_body } = props;
        setError(null)
        if (nb_notification_title == undefined || nb_notification_title == "") {
            setError({ nb_notification_title: "Please enter title" })
        } else if (nb_notification_body == undefined || nb_notification_body == "") {
            setError({ nb_notification_body: "Please enter body" })
        } else {
            // console.log("fire notification");
            dispatch(api.sendBroadcastNotification())
        }
    }

    const renderItem1 = ({ item, index }) => {

        return <HStack borderColor={colors.PRIMARY_DARK} borderWidth={1} borderRadius={5} p="1" marginY="1">
            {/* <Checkbox isChecked={item.status == "active"} onChange={state => onUserChecked(item.uid, state)} justifyContent="center" alignContent="center">
            </Checkbox> */}
            {item.image ?
                <Image
                    // source={{ uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg" }}
                    source={{ uri: item.image }}
                    style={{ width: 85, borderRadius: 5 }}
                />
                :
                <Image
                    source={require('../../assets/icon.png')}
                    style={{ ...globleStyles.profileIcon, width: 85 }}
                />
            }

            <VStack justifyContent="space-between" space={1} paddingX="1.5" flex={1} >
                <Stack>
                    <Text style={globleStyles.cardTextLabel}>Name</Text>
                    <Text style={globleStyles.cardTextValue} numberOfLines={1}>{item.firstname} {item.lastname}</Text>
                </Stack>
                <Stack>
                    <Text style={globleStyles.cardTextLabel}>Phone Number</Text>
                    <Text style={globleStyles.cardTextValue} numberOfLines={1}>{item.phoneNumber}</Text>
                </Stack>
                <HStack justifyContent="space-between">
                    <Stack flex={1}>
                        <Text style={globleStyles.cardTextLabel}>Email</Text>
                        <Text style={globleStyles.cardTextValue} numberOfLines={1}>{item.email}</Text>
                    </Stack>
                    {/* <Switch size="md" width={30} height={30} alignSelf={'flex-end'} value={item.status == "active"} onValueChange={value => dispatch(api.onUserStatusChange(item.uid, value))} /> */}
                </HStack>
            </VStack>

            <Checkbox isChecked={item.status == "active"} onChange={state => onUserChecked(item.uid, state)} justifyContent="center" alignContent="center">
            </Checkbox>

        </HStack >
    }

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header
                title={'Notification Broadcast'}
                onPress={()=> props.navigation.goBack()}
                isTitleCenter={false}
                rightIconName="direction"
                onPressRightIcon={() => _attemptSubmit()}
            />

            {/* <Center w="100%" > */}
            <Box pb="150" w="100%" paddingX={2.5}>

                <FormControl isRequired isInvalid>
                    <InputCard
                        label={'Notification Title'}
                        onChangeText={props.nbTitleChange}
                        blurOnSubmit={false}
                        value={props.nb_notification_title}
                        returnKey={"next"}
                        // keyboardType={"email-address"}
                        secureEntry={false}
                        placeholder={"Enter Product Name"} >
                        {/* <Entypo name="user" color={colors.GREY_7} size={20} /> */}
                        <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                    </InputCard>
                    {error && error.nb_notification_title &&
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            {error.nb_notification_title}
                        </FormControl.ErrorMessage>
                    }
                </FormControl>
                <FormControl isRequired isInvalid>
                    <InputCard
                        label={'Notification Body'}
                        onChangeText={props.nbBodyChange}
                        blurOnSubmit={false}
                        value={props.nb_notification_body}
                        returnKey={"next"}
                        secureEntry={false}
                        placeholder={"Enter Body up to 100 characters"}
                        multiline
                        maxLength={100}
                        textInputStyle={{ paddingLeft: 0, height: 65 }}>
                    </InputCard>
                    {error && error.nb_notification_body &&
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            {error.nb_notification_body}
                        </FormControl.ErrorMessage>
                    }
                </FormControl>

                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={props.users}
                    renderItem={renderItem1}
                    // style={{ maxHeight: height - 227 }}
                    style={{ marginBottom: 80, marginTop: 5 }}
                />
            </Box>

            {showLoader()}

        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        nb_notification_title: state.notificationbrod.nb_notification_title,
        nb_notification_body: state.notificationbrod.nb_notification_body,
        success: state.notificationbrod.success,
        success_status: state.notificationbrod.success_status,
        users: state.notificationbrod.users,
        loading: state.notificationbrod.loading,
        error: state.notificationbrod.error
    }
};
export default connect(mapStateToProps, actions)(NotificationBroadcast)

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