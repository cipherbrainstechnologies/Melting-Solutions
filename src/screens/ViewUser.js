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
import { FirebaseContext } from '../../redux';
import Spinner from '../components/Spinner';
import ProfileComponent from '../components/ProfileComponent';


function ViewUser(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const users = useSelector(state => state.usersdata);

    const [showGST, setShowGST] = useState(false);
    const [data, setData] = useState([]);

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    useEffect(() => {
        setData(props.navigation.getParam('item'))
    }, []);

    return (
        <View style={globleStyles.mainView}>

            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header title={'View User'} onPress={() => props.navigation.goBack()} isTitleCenter={false} />
            <ScrollView _contentContainerStyle={{
                // px: "10px",
                mb: "4",
                minW: "72"
            }}>
                <Center w="100%">
                    <Box p="2" w="95%">

                        <VStack space={3} mt="0">
                            <Stack style={{ marginVertical: 10, alignItems: 'center' }}>
                                <Image
                                    source={require('../../assets/icon.png')}
                                    style={globleStyles.profileIcon}
                                />
                            </Stack>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    blurOnSubmit={false}
                                    value={data.firstname}
                                >
                                    {/* <Entypo name="user" color={colors.GREY_7} size={20} /> */}
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Please enter a phonenumber!
                                </FormControl.ErrorMessage> */}
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    blurOnSubmit={false}
                                    value={data.lastname}
                                >
                                    {/* <Entypo name="user" color={colors.GREY_7} size={20} /> */}
                                    <MaterialIcons name="person" color={colors.GREY_7} size={20} />
                                </InputCard>
                                {/* <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Please enter a phonenumber!
                                </FormControl.ErrorMessage> */}
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    value={data.email} >
                                    <Entypo name="email" color={colors.GREY_7} size={20} />
                                </InputCard>
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard value={data.phoneNumber} >
                                    <Entypo name="mobile" color={colors.GREY_7} size={20} />
                                </InputCard>
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard value={data.companyname} >
                                    <MaterialIcons name="business" color={colors.GREY_7} size={20} />
                                </InputCard>
                            </FormControl>
                            <FormControl isRequired isInvalid>
                                <InputCard
                                    value={data.gstnumber}
                                    secureEntry={!showGST}
                                    rightIcon={<Entypo name={!showGST ? "eye-with-line" : "eye"} color={colors.GREY_7} size={20} />}
                                    onPressRightIcon={() => setShowGST(!showGST)}>

                                    <Entypo name="calculator" color={colors.GREY_7} size={20} />
                                </InputCard>
                            </FormControl>
                            {/* {props.screentype != "view" &&
                                <MaterialButtonDark onPress={() => props.navigation.navigate('Verification')}>Save Changes</MaterialButtonDark>
                            } */}
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
export default connect(mapStateToProps, actions)(ViewUser)