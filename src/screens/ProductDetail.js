import { Box, Center, FormControl, Stack, VStack, WarningOutlineIcon, ScrollView, Image, Icon, HStack, StatusBar } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Dimensions,
    Linking
} from 'react-native';
import { DummyText, FontSemiBold } from '../common/Constants';
import globleStyles, { height } from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialButtonDark from '../components/MaterialButtonDark';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import { showToastError, showToastSuccess } from '../../redux/actions/Validation';
import { FirebaseContext } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';


var { width } = Dimensions.get('window');

export default function ProductDetail(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const cartdata = useSelector(state => state.cartdata);


    const [data, setData] = useState([]);
    const [state, setState] = useState({
        id: props.navigation.getParam('item').id || null,
        quantity: '',
        expectedDate: new Date(),

    });

    const [dateModalOpen, setDateModalOpen] = useState(false);


    useEffect(() => {
        setData(props.navigation.getParam('item'))
    }, []);

    useEffect(() => {
        if (cartdata.error && cartdata.error.msg) {
            showToastError(cartdata.error.msg);
            dispatch(api.clearCartError())
        }

        if (cartdata.success == "success") {
            showToastSuccess("Product added to cart successfully")
            dispatch(api.clearCartError())
            props.navigation.goBack()
        }

    }, [cartdata.error, cartdata.error.msg, cartdata.success]);

    const handleDateConfirm = (date) => {

        setDateModalOpen(false)
        setState({ ...state, expectedDate: date })
    }

    const _attemptSubmit = () => {
        const { quantity } = state;
        if (quantity == undefined || quantity == "") {
            showToastError("Please enter quantity")
        } else {
            dispatch(api.addToCart(state))
        }
    }

    const showLoader = () => {
        if (cartdata.loading == true) {
            return <Spinner />
        }
    }


    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />

            <Header title={''} onPress={() => props.navigation.goBack()} />

            <ScrollView _contentContainerStyle={{
                // px: "10px",
                mb: "4",
                minW: "72"
            }}>
                <Center w="100%">
                    <Box p="2" pt="0" w="100%">

                        <VStack space={3} mt="0">

                            {data.image ?
                                <Image
                                    source={{ uri: data.image }}
                                    style={{ width: width, height: width * 0.8 }}
                                />
                                :
                                <Image
                                    source={require('../../assets/icon.png')}
                                    style={{ width: width, height: width * 0.8 }}
                                />
                            }

                            <Text style={globleStyles.subHeaderCenter}>{data.title}</Text>

                            <Text style={globleStyles.subHeader}>Quantity</Text>
                            <HStack style={{ borderColor: colors.PRIMARY_DARK, borderWidth: 1, alignSelf: 'flex-start' }}>
                                {/* <Text style={{ ...globleStyles.normalText, padding: 5, paddingHorizontal: 8, color: colors.GREY_8 }}>200</Text> */}
                                <TextInput
                                    onChangeText={(text) => { setState({ ...state, quantity: text }) }}
                                    value={state.quantity}
                                    placeholder={"00"}
                                    style={{ ...globleStyles.normalText, fontSize: 16, padding: 2, paddingHorizontal: 8, color: colors.GREY_8, minWidth: 60 }}>
                                </TextInput>
                                <Text style={{ ...globleStyles.normalText, padding: 5, paddingHorizontal: 10, backgroundColor: colors.PRIMARY_DARK, color: colors.WHITE }}>{data.quantity_type}</Text>
                            </HStack>

                            <Text style={globleStyles.subHeader}>Description</Text>
                            <Text style={{ ...globleStyles.normalText, color: colors.GREY_8 }}>{data.description}</Text>

                            <Text style={globleStyles.subHeader}>Expected Date</Text>
                            <TouchableOpacity onPress={() => setDateModalOpen(true)}>
                                <HStack style={{ borderColor: colors.PRIMARY_DARK, borderWidth: 1, alignSelf: 'flex-start', alignItems: 'center', paddingRight: 5 }}>
                                    <Text style={{ ...globleStyles.normalText, fontSize: 16, padding: 5, paddingHorizontal: 8, color: colors.GREY_8 }}>{moment(state.expectedDate).format("D MMM YY")}</Text>
                                    <Entypo name="calendar" color={colors.PRIMARY_DARK} size={20} />
                                </HStack>
                            </TouchableOpacity>

                            <MaterialButtonDark onPress={_attemptSubmit}>Add To Cart</MaterialButtonDark>

                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
            <DateTimePickerModal
                date={state.expectedDate}
                minimumDate={new Date()}
                isVisible={dateModalOpen}
                mode={"date"}
                onConfirm={handleDateConfirm}
                onCancel={() => setDateModalOpen(false)}
            />
            {showLoader()}
        </View>
    );
}