import { Box, HStack, VStack, StatusBar } from 'native-base';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FirebaseContext } from '../../redux';
import globleStyles from '../common/globleStyles';
import { colors, shadows, radii } from '../common/theme';
import { useWindowWidth } from '../common/responsive';
import * as actions from '../../redux/actions/homeactions';
import FadeInView from '../components/FadeInView';
import PressableCard from '../components/PressableCard';
import GrowthInsights from '../components/GrowthInsights';
import OnboardingTips from '../components/OnboardingTips';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import { motion } from '../common/animations';
import { useRefresh } from '../hooks/useRefresh';
import { storageKeys } from '../common/storage';
import { trackEvent, AnalyticsEvents } from '../common/analytics';
import { STATUS_ORDER_COMPLETED, STATUS_QUOTE_REQUESTED, STATUS_QUOTE_SEND } from '../common/Constants';

const DASHBOARD_ITEMS = [
    { title: 'Total Users', key: 'totalUsers', icon: require('../../assets/user-menu-icon.png'), route: 'Users' },
    { title: 'Total Products', key: 'totalProducts', icon: require('../../assets/total-products-icon.png'), route: 'Products' },
    { title: 'Send Quotes', key: 'totalSendQuotes', icon: require('../../assets/send-quotes-icon.png'), route: 'Order' },
    { title: 'Completed Order', key: 'totalCompleteOrders', icon: require('../../assets/complate-order-icon.png'), route: 'Order' },
    { title: 'Reports', key: 'reports', icon: require('../../assets/reports-icon.png'), route: 'Reports', hideCount: true },
    { title: 'Broadcast', key: 'broadcast', icon: require('../../assets/received_quotes-icon.png'), route: 'NotificationBroadcast', hideCount: true },
];

function HomeAdmin(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { width, isDesktop } = useWindowWidth();

    const screenWidth = width || Dimensions.get('window').width;
    const columns = isDesktop ? 3 : 2;
    const horizontalGap = 10;
    const containerPadding = 16;
    const cardWidth = (screenWidth - containerPadding * 2 - horizontalGap * (columns - 1)) / columns;
    const cardHeight = cardWidth * 0.95;

    const loadDashboard = useCallback(() => {
        dispatch(api.fetchTotalUsersCount());
        dispatch(api.fetchTotalProductCount());
        dispatch(api.fetchTotalQuoteCount(STATUS_QUOTE_REQUESTED));
        dispatch(api.fetchTotalQuoteCount(STATUS_QUOTE_SEND));
        dispatch(api.fetchTotalQuoteCount(STATUS_ORDER_COMPLETED));
        dispatch(api.fetchGrowthMetrics());
    }, [dispatch, api]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const { refreshing, onRefresh } = useRefresh(async () => {
        trackEvent(AnalyticsEvents.DASHBOARD_REFRESH, { role: 'admin' });
        loadDashboard();
    });

    const counts = useMemo(() => ({
        totalUsers: props.totalUsers ?? 0,
        totalProducts: props.totalProducts ?? 0,
        totalSendQuotes: props.totalSendQuotes ?? 0,
        totalCompleteOrders: props.totalCompleteOrders ?? 0,
    }), [props.totalUsers, props.totalProducts, props.totalSendQuotes, props.totalCompleteOrders]);

    const getCountForItem = (item) => (item.hideCount ? null : counts[item.key] ?? 0);
    const showSkeleton = props.loading && props.totalUsers === 0 && props.totalProducts === 0;

    return (
        <View style={globleStyles.mainViewWithColor}>
            <StatusBar backgroundColor={colors.SURFACE} barStyle="dark-content" />
            <Box safeAreaTop bg={colors.SURFACE} pt="2" />
            <OnboardingTips role="admin" storageKey={storageKeys.adminOnboarding} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.PRIMARY_DARK} />
                }
            >
                <View style={globleStyles.subMainView}>
                    <HStack justifyContent="space-between" alignItems="center" mb="4">
                        <VStack flex={1} pr="3">
                            <Text style={globleStyles.sectionTitle}>Dashboard</Text>
                            <Text style={globleStyles.screenDescription}>
                                Overview of users, products, quotes, and growth signals.
                            </Text>
                        </VStack>
                        <Image
                            source={auth.info?.image ? { uri: auth.info.image } : require('../../assets/icon.png')}
                            style={styles.avatar}
                        />
                    </HStack>

                    <GrowthInsights
                        newUsersWeek={props.growthNewUsersWeek}
                        activeUsers={props.growthActiveUsers}
                        pendingQuotes={props.growthPendingQuotes}
                        onAddUser={() => props.navigation.navigate('Users')}
                        onAddProduct={() => props.navigation.navigate('Products')}
                        onBroadcast={() => props.navigation.navigate('NotificationBroadcast')}
                    />

                    {showSkeleton ? (
                        <SkeletonDashboard columns={columns} count={6} cardWidth={cardWidth} cardHeight={cardHeight} />
                    ) : (
                        <View style={styles.grid}>
                            {DASHBOARD_ITEMS.map((item, index) => {
                                const count = getCountForItem(item);
                                const isLastInRow = (index + 1) % columns === 0;
                                return (
                                    <FadeInView
                                        key={item.key}
                                        delay={index * motion.stagger}
                                        style={{
                                            width: cardWidth,
                                            marginRight: isLastInRow ? 0 : horizontalGap,
                                            marginBottom: horizontalGap,
                                        }}
                                    >
                                        <PressableCard
                                            onPress={() => item.route && props.navigation.navigate(item.route)}
                                            style={[styles.mainCard, { width: cardWidth, minHeight: cardHeight }]}
                                            accessibilityLabel={item.title}
                                        >
                                            <View style={styles.cardContent}>
                                                {count !== null && <Text style={styles.countText}>{count}</Text>}
                                                <Image source={item.icon} style={styles.boxIcon} resizeMode="contain" />
                                                <Text style={styles.cardTitle}>{item.title}</Text>
                                            </View>
                                        </PressableCard>
                                    </FadeInView>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const mapStateToProps = (state) => ({
    totalUsers: state.homedata.totalUsers,
    totalProducts: state.homedata.totalProducts,
    totalReceivedQuotes: state.homedata.totalReceivedQuotes,
    totalSendQuotes: state.homedata.totalSendQuotes,
    totalCompleteOrders: state.homedata.totalCompleteOrders,
    growthNewUsersWeek: state.homedata.growthNewUsersWeek,
    growthActiveUsers: state.homedata.growthActiveUsers,
    growthPendingQuotes: state.homedata.growthPendingQuotes,
    loading: state.homedata.loading,
});

export default connect(mapStateToProps, actions)(HomeAdmin);

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingBottom: 120 },
    avatar: { width: 48, height: 48, borderRadius: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    mainCard: {
        backgroundColor: colors.WHITE,
        borderColor: colors.BORDER,
        borderWidth: 1,
        borderRadius: radii.lg,
        paddingTop: 10,
        paddingBottom: 10,
        overflow: 'hidden',
        ...shadows.card,
    },
    cardContent: { flex: 1, justifyContent: 'space-between', minHeight: 120, paddingHorizontal: 10 },
    countText: { ...globleStyles.subHeader, fontSize: 32, color: colors.GREY_9 },
    boxIcon: { width: 72, height: 72, position: 'absolute', right: -8, bottom: 28, opacity: 0.9 },
    cardTitle: { fontSize: 16, ...globleStyles.fontMedium, color: colors.TEXT_PRIMARY, marginTop: 8 },
});
