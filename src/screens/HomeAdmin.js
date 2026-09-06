import { Badge, Box, Flex, HStack, Pressable, Image, AspectRatio, VStack, StatusBar } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FirebaseContext } from '../../redux';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import { useWindowWidth } from '../common/responsive';
import * as actions from '../../redux/actions/homeactions';
import Spinner from '../components/Spinner';
import { STATUS_ORDER_COMPLETED, STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND } from '../common/Constants';

function HomeAdmin(props) {

    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { width, isDesktop } = useWindowWidth();
    const cardWidth = isDesktop ? (width - 80) / 3 : width / 2.25;

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

    const renderData = ({ item }) => {
        return <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.mainCard, { width: cardWidth, height: cardWidth * 0.95 }]}
            onPress={() => {
                if (item.route) {
                    props.navigation.navigate(item.route);
                }
            }}
        >
            <VStack justifyContent="space-between" flex={1} marginY="1.5" overflow="hidden">
                <Text style={styles.countText}>{item.count}</Text>
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
            <StatusBar backgroundColor={colors.SURFACE} barStyle={'dark-content'} />
            <Box safeAreaTop bg={colors.SURFACE} pt="2" />
            <View style={globleStyles.subMainView}>
                <HStack justifyContent='space-between' alignItems="center" mb="4">
                    <VStack flex={1}>
                        <Text style={globleStyles.sectionTitle}>Dashboard</Text>
                        <Text style={globleStyles.screenDescription}>
                            Overview of users, products, quotes, and orders.
                        </Text>
                    </VStack>
                    {auth.info.image ?
                        <Image
                            source={{ uri: auth.info.image }}
                            style={{ width: 48, height: 48, borderRadius: 12 }}
                        />
                        :
                        <Image
                            source={require('../../assets/icon.png')}
                            style={{ width: 48, height: 48, borderRadius: 12 }}
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
                    numColumns={isDesktop ? 3 : 2}
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
    countText: {
        ...globleStyles.subHeader,
        fontSize: 36,
        color: colors.GREY_9,
        paddingHorizontal: 10,
    },
    box_icon: {
        width: 80,
        height: 80,
        position: 'absolute',
        right: -16,
        opacity: 0.9,
    },
    text: {
        fontSize: 18,
        ...globleStyles.fontMedium,
        color: colors.TEXT_PRIMARY,
        paddingHorizontal: 10,
        paddingBottom: 4,
    },
    mainCard: {
        flexDirection: 'column',
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: colors.WHITE,
        borderColor: colors.BORDER,
        borderWidth: 1,
        borderRadius: 16,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
})