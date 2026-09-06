import { Box, Badge, HStack, VStack, StatusBar } from 'native-base';
import React, { useContext, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import { Entypo } from 'react-native-vector-icons';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FirebaseContext } from '../../redux';
import globleStyles from '../common/globleStyles';
import { colors, shadows, radii } from '../common/theme';
import { useWindowWidth } from '../common/responsive';
import * as actions from '../../redux/actions/productactions';
import Spinner from '../components/Spinner';
import FadeInView from '../components/FadeInView';
import PressableCard from '../components/PressableCard';
import EmptyState from '../components/EmptyState';
import { motion } from '../common/animations';

let unsubRef = null;

function Home(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { width, isDesktop } = useWindowWidth();

    const screenWidth = width || Dimensions.get('window').width;
    const columns = isDesktop ? 3 : 2;
    const horizontalGap = 10;
    const containerPadding = 16;
    const cardWidth = (screenWidth - containerPadding * 2 - horizontalGap * (columns - 1)) / columns;

    useEffect(() => {
        unsubRef = dispatch(api.fetchProducts('active'));
        return () => unsubRef && unsubRef();
    }, [dispatch, api.fetchProducts]);

    useEffect(() => {
        dispatch(api.fetchCartCount());
    }, [dispatch, api.fetchCartCount]);

    const products = props.products || [];

    const showLoader = () => {
        if (props.loading) return <Spinner />;
    };

    return (
        <View style={globleStyles.mainViewWithColor}>
            <StatusBar backgroundColor={colors.SURFACE} barStyle={'dark-content'} />
            <Box safeAreaTop bg={colors.SURFACE} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={globleStyles.subMainView}>
                    <FadeInView>
                        <HStack justifyContent="space-between" alignItems="center" mb="4">
                            <VStack flex={1} pr="3">
                                <Text style={globleStyles.normalText}>Hello</Text>
                                <Text style={globleStyles.subHeader}>
                                    {auth.info?.firstname || ''} {auth.info?.lastname || ''}
                                </Text>
                                <Text style={globleStyles.screenDescription}>
                                    Browse catalog and request quotes
                                </Text>
                            </VStack>
                            <VStack justifyContent="center" alignItems="center">
                                {props.cartCount > 0 && (
                                    <Badge
                                        colorScheme="danger"
                                        rounded="full"
                                        mb={-2}
                                        mr={-2}
                                        zIndex={1}
                                        variant="solid"
                                        alignSelf="flex-end"
                                        _text={{ fontSize: 12 }}
                                    >
                                        {props.cartCount}
                                    </Badge>
                                )}
                                <PressableCard
                                    onPress={() => props.navigation.navigate('Cart')}
                                    style={styles.cartButton}
                                    accessibilityLabel="Open cart"
                                >
                                    <Entypo name="shopping-cart" color={colors.PRIMARY_DARK} size={24} />
                                </PressableCard>
                            </VStack>
                        </HStack>
                    </FadeInView>

                    {products.length === 0 && !props.loading ? (
                        <EmptyState
                            icon="cube-outline"
                            title="No products available"
                            description="Check back soon — new catalog items will appear here."
                        />
                    ) : (
                        <View style={styles.grid}>
                            {products.map((item, index) => {
                                const isLastInRow = (index + 1) % columns === 0;
                                return (
                                    <FadeInView
                                        key={item.id || index}
                                        delay={index * motion.stagger}
                                        style={{
                                            width: cardWidth,
                                            marginRight: isLastInRow ? 0 : horizontalGap,
                                            marginBottom: horizontalGap,
                                        }}
                                    >
                                        <PressableCard
                                            onPress={() => props.navigation.navigate('ProductDetail', { item })}
                                            style={[styles.mainCard, { width: cardWidth, minHeight: cardWidth }]}
                                            accessibilityLabel={`View ${item.title}`}
                                        >
                                            <Image
                                                source={
                                                    item.image
                                                        ? { uri: item.image }
                                                        : require('../../assets/icon.png')
                                                }
                                                style={styles.productImage}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.productTitle} numberOfLines={2}>
                                                {item.title}
                                            </Text>
                                        </PressableCard>
                                    </FadeInView>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => ({
    products: state.productsdata.products,
    cartCount: state.productsdata.cartCount,
    loading: state.productsdata.loading,
    error: state.productsdata.error,
});

export default connect(mapStateToProps, actions)(Home);

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingBottom: 120 },
    cartButton: {
        width: 48,
        height: 48,
        borderRadius: radii.md,
        backgroundColor: colors.WHITE,
        borderWidth: 1,
        borderColor: colors.BORDER,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.card,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    mainCard: {
        backgroundColor: colors.WHITE,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.BORDER,
        padding: 12,
        justifyContent: 'space-between',
        ...shadows.card,
    },
    productImage: {
        width: '100%',
        height: 100,
        alignSelf: 'center',
    },
    productTitle: {
        fontSize: 15,
        ...globleStyles.fontMedium,
        color: colors.TEXT_PRIMARY,
        textAlign: 'center',
        marginTop: 8,
    },
});
