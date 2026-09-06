import { Badge, Box, Flex, HStack, Pressable, Image, AspectRatio, VStack, StatusBar } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Linking
} from 'react-native';
import { Entypo } from 'react-native-vector-icons';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FirebaseContext } from '../../redux';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import * as actions from '../../redux/actions/homeactions';
import Spinner from '../components/Spinner';
import { STATUS_ORDER_COMPLETED, STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND } from '../common/Constants';
import { getnumbertoken, getordernumber } from '../../redux/actions/Validation';
var { width } = Dimensions.get('window');

function HomeAdmin(props) {

    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        Promise.all([
            dispatch(api.fetchTotalUsersCount()),
            dispatch(api.fetchTotalProductCount()),
            dispatch(api.fetchTotalQuoteCount(STATUS_QUOTE_REQUESTED)),
            dispatch(api.fetchTotalQuoteCount(STATUS_QUOTE_SEND)),
            dispatch(api.fetchTotalQuoteCount(STATUS_ORDER_COMPLETED))
        ]);
    }, [dispatch, api.fetchTotalUsersCount, api.fetchTotalProductCount, api.fetchTotalQuoteCount]);

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    const renderData = ({ item, index }) => {
        return <TouchableOpacity
            activeOpacity={0.9}
            style={styles.mainCard}
            onPress={() => {
                if (item.route) {
                    props.navigation.navigate(item.route);
                }
            }}
        >
            <VStack justifyContent="space-between" flex={1} marginY="1.5" zIndex={99999999} overflow="hidden" >
                <Text style={{ ...globleStyles.subHeader, fontSize: 40, color: colors.GREY_9, paddingHorizontal: 10 }}>{item.count}</Text>
                <Image
                    source={item.icon}
                    style={styles.box_icon}
                />
                <Text style={styles.text}>{item.title}</Text>
            </VStack>
        </TouchableOpacity>;
    }

    return (
        <View style={globleStyles.mainViewWithColor}>
            <StatusBar backgroundColor={colors.PRIMARY_LIGHT} barStyle={'dark-content'} />
            <Box safeAreaTop bg={colors.PRIMARY_LIGHT} pt="2" />
            <View style={globleStyles.subMainView}>

                <HStack justifyContent='space-between'>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => { 
                        // Use bottom tabs navigation instead of drawer
                        props.navigation.navigate('Users');
                    }}>
                        <View style={globleStyles.toggleIconView}>
                            <Entypo name="menu" color={colors.DARK_BLUE} size={30} />
                        </View>
                    </TouchableOpacity>
                    {auth.info.image ?
                        <Image
                            source={{ uri: auth.info.image }}
                            style={{ width: 45, height: 45, borderRadius: 10 }}
                        />
                        :
                        <Image
                            source={require('../../assets/icon.png')}
                            style={{ width: 45, height: 45, borderRadius: 10 }}
                        />
                    }
                </HStack>

                <FlatList
                    refreshing={true}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={[{
                        title: "Total Users",
                        count: props.totalUsers,
                        icon: require('../../assets/user-menu-icon.png'),
                        route: 'Users'
                    }, {
                        title: "Total Products",
                        count: props.totalProducts,
                        icon: require('../../assets/total-products-icon.png'),
                        route: 'Products'
                    },
                    {
                        title: "Send Quotes",
                        count: props.totalSendQuotes,
                        icon: require('../../assets/send-quotes-icon.png'),
                        route: 'Order'
                    }, {
                        title: "Completed Order",
                        count: props.totalCompleteOrders,
                        icon: require('../../assets/complate-order-icon.png'),
                        route: 'Order'
                    }, {
                        title: "Reports",
                        count: '',
                        icon: require('../../assets/reports-icon.png'),
                        route: 'Reports'
                    }, {
                        title: "Broadcast",
                        count: '',
                        icon: require('../../assets/received_quotes-icon.png'),
                        route: 'NotificationBroadcast'
                    }
                    ]}
                    // extraData={this.state}
                    renderItem={renderData}
                    style={{
                        flex: 0, paddingTop: 5,
                        backgroundColor: colors.fullTransparent,
                        alignSelf: 'center',
                    }}
                    numColumns={2}
                    fadingEdgeLength={50}
                    contentContainerStyle={
                        {
                            backgroundColor: colors.fullTransparent,
                        }
                    }
                />
            </View>
            {showLoader()}
        </View>
    );
}
const mapStateToProps = (state) => {
    // console.log(state.auth.phonenumber);
    return {
        totalUsers: state.homedata.totalUsers,
        totalProducts: state.homedata.totalProducts,
        totalReceivedQuotes: state.homedata.totalReceivedQuotes,
        totalSendQuotes: state.homedata.totalSendQuotes,
        totalCompleteOrders: state.homedata.totalCompleteOrders,
        totalReport: state.homedata.totalReport,
        loading: state.homedata.loading,
        error: state.homedata.error
    }
};
export default connect(mapStateToProps, actions)(HomeAdmin)

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE,
        //marginTop: StatusBar.currentHeight,
    },
    title: {
        ...globleStyles.fontBold,
        fontSize: width * 0.045,
        color: colors.DARK_BLUE,
        textAlign: 'center',
        textDecorationLine: "underline",
        marginVertical: 5
    },
    box_icon: {
        width: 90,
        height: 90,
        position: 'absolute',
        right: -20,
        zIndex: -99999999
    },
    text: {
        fontSize: 25,
        ...globleStyles.fontMedium,
        color: colors.BLACK,
        paddingHorizontal: 10,
    },
    mainCard: {
        width: Dimensions.get('window').width / 2.25,
        height: Dimensions.get('window').width / 2.25,
        flexDirection: 'column',
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 4,
    },
})