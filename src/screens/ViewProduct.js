import { Box, Center, FormControl, Stack, VStack, WarningOutlineIcon, ScrollView, Image, Icon, HStack, StatusBar } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Linking
} from 'react-native';
import { DummyText, FontSemiBold } from '../common/Constants';
import globleStyles, { height } from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/productactions';
import moment from 'moment';

var { width } = Dimensions.get('window');

function ViewProduct(props) {

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(props.navigation.getParam('item'))
    }, []);


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
                            <Image
                                source={{ uri: data.image }}
                                style={{ width: width, height: width * 0.8 }}
                            />
                            <Text style={globleStyles.subHeaderCenter}>{data.title}</Text>

                            <Text style={globleStyles.subHeader}>Quantity</Text>
                            <HStack style={{ borderColor: colors.PRIMARY_DARK, borderWidth: 1, alignSelf: 'flex-start' }}>
                                <Text style={{ ...globleStyles.normalText, padding: 5, paddingHorizontal: 10, backgroundColor: colors.PRIMARY_DARK, color: colors.WHITE }}>{data.quantity_type}</Text>
                            </HStack>

                            <Text style={globleStyles.subHeader}>Description</Text>
                            <Text style={{ ...globleStyles.normalText, color: colors.GREY_8 }}>{data.description}</Text>

                            <Text style={globleStyles.subHeader}>Expected Date</Text>
                            <HStack style={{ borderColor: colors.PRIMARY_DARK, borderWidth: 1, alignSelf: 'flex-start', alignItems: 'center', paddingRight: 5 }}>
                                <Text style={{ ...globleStyles.normalText, padding: 5, paddingHorizontal: 8, color: colors.GREY_8 }}>{moment(data.created).format('DD MMM YYYY')}</Text>
                                <Entypo name="calendar" color={colors.PRIMARY_DARK} size={20} />
                            </HStack>

                            {/* <MaterialButtonDark onPress={() => props.navigation.navigate('Verification')}>Add To Cart</MaterialButtonDark> */}

                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
        </View>
    );
}


const mapStateToProps = (state) => {
    // console.log(state.auth.phonenumber);
    return {
        loading: state.productsdata.loading
    }
};
export default connect(mapStateToProps, actions)(ViewProduct)