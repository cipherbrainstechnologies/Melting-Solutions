import { Box, VStack, ScrollView, HStack, StatusBar, AlertDialog, Button, Switch, Stack } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl,
} from 'react-native';
import globleStyles from '../common/globleStyles';
import { colors, layout } from '../common/theme';
import { useWindowWidth } from '../common/responsive';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, Ionicons } from 'react-native-vector-icons';
import * as actions from '../../redux/actions/productactions';
import { connect, useDispatch } from 'react-redux';
import { FirebaseContext } from '../../redux';
import { showToastError } from '../../redux/actions/Validation';
import EmptyState from '../components/EmptyState';
import FadeInView from '../components/FadeInView';
import { SkeletonList } from '../components/SkeletonLoader';
import { PRODUCT_RESET } from '../../redux/store/type';
import { motion } from '../common/animations';
import { useRefresh } from '../hooks/useRefresh';

let unsubRef = null;

function Products(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();
    const { isDesktop } = useWindowWidth();

    const [isOpen, setIsOpen] = useState(false);
    const [deleteModelData, setDeleteModelData] = useState({});
    const cancelRef = useRef(null);

    const onClose = () => setIsOpen(false);

    useEffect(() => {
        if (props.error && props.error.msg) {
            showToastError(props.error.msg);
        }
    }, [props.error, props.error.msg]);

    useEffect(() => {
        unsubRef = dispatch(api.fetchProducts());
        return () => unsubRef && unsubRef();
    }, [dispatch, api.fetchProducts]);

    const reloadProducts = () => {
        if (unsubRef) unsubRef();
        unsubRef = dispatch(api.fetchProducts());
    };

    const { refreshing, onRefresh } = useRefresh(async () => {
        reloadProducts();
    });

    const products = props.products || [];
    const showSkeleton = props.loading && products.length === 0;

    const onDeleteProduct = () => {
        onClose();
        dispatch(api.onDeleteProduct(deleteModelData.id));
    };

    const renderProductCard = (item, index) => (
        <FadeInView key={item.id || index} delay={index * motion.stagger}>
            <HStack style={globleStyles.userCard}>
                <Image
                    source={item.image ? { uri: item.image } : require('../../assets/icon.png')}
                    style={styles.thumbnail}
                />
                <VStack justifyContent="space-between" space={2} paddingX="2" flex={1}>
                    <Stack>
                        <Text style={globleStyles.cardTextLabel}>Name</Text>
                        <Text style={globleStyles.cardTextValue} numberOfLines={1}>{item.title}</Text>
                    </Stack>
                    <Stack flex={1}>
                        <Text style={globleStyles.cardTextLabel}>Description</Text>
                        <Text style={globleStyles.cardTextValue} numberOfLines={3}>{item.description}</Text>
                    </Stack>
                    <Switch
                        size="md"
                        alignSelf="flex-end"
                        value={item.status === 'active'}
                        onValueChange={value => dispatch(api.onProductStatusChange(item.id, value))}
                    />
                </VStack>

                <VStack justifyContent="space-between" space={2}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={globleStyles.cardIconView}
                        onPress={() => {
                            dispatch(api.setEditProductDataToState(item));
                            props.navigation.navigate('AddProduct', { actionUid: item.id });
                        }}
                    >
                        <Ionicons name="create-outline" size={20} color={colors.PRIMARY_DARK} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={globleStyles.cardIconView}
                        onPress={() => props.navigation.navigate('ViewProduct', { item })}
                    >
                        <Ionicons name="eye-outline" size={20} color={colors.PRIMARY_DARK} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={globleStyles.cardIconView}
                        onPress={() => {
                            setDeleteModelData(item);
                            setIsOpen(true);
                        }}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.PRIMARY_DARK} />
                    </TouchableOpacity>
                </VStack>
            </HStack>
        </FadeInView>
    );

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle="dark-content" />
            <Header title="Products" isLeftIconHide isTitleCenter={false} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.PRIMARY_DARK} />
                }
            >
                <Box w="100%" maxW={layout.cardMaxWidth} alignSelf="center" px="4" py="4">
                    <FadeInView>
                        <HStack justifyContent="space-between" alignItems="center" mb="4">
                            <VStack flex={1} pr="3">
                                <Text style={globleStyles.sectionTitle}>Product catalog</Text>
                                <Text style={globleStyles.screenDescription}>
                                    Manage inventory, pricing visibility, and product details.
                                </Text>
                            </VStack>
                            <TouchableOpacity
                                activeOpacity={0.85}
                                style={styles.addButton}
                                onPress={() => {
                                    dispatch({ type: PRODUCT_RESET, payload: null });
                                    props.navigation.navigate('AddProduct');
                                }}
                            >
                                <Ionicons name="add-outline" size={22} color={colors.WHITE} />
                                {isDesktop && <Text style={styles.addButtonText}>Add Product</Text>}
                            </TouchableOpacity>
                        </HStack>
                    </FadeInView>

                    <InputCard
                        onChangeText={props.searchFilterFunction}
                        value={props.searchtext}
                        placeholder="Search products..."
                        cardInputStyle={{ borderColor: colors.BORDER, marginBottom: 16 }}
                        textInputStyle={{ paddingLeft: 0 }}
                        rightIcon={<Entypo name="magnifying-glass" color={colors.PRIMARY_DARK} size={20} />}
                    />

                    {showSkeleton ? (
                        <SkeletonList count={4} />
                    ) : products.length === 0 ? (
                        <EmptyState
                            icon="cube-outline"
                            title="No products yet"
                            description="Add your first product to start receiving quote requests."
                        />
                    ) : (
                        products.map(renderProductCard)
                    )}
                </Box>
            </ScrollView>

            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Delete Product</AlertDialog.Header>
                    <AlertDialog.Body>
                        This will remove all data relating to {deleteModelData.title}. This action cannot be reversed.
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={onDeleteProduct}>
                                Delete
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </View>
    );
}

const mapStateToProps = (state) => ({
    searchtext: state.productsdata.searchtext,
    products: state.productsdata.products,
    loading: state.productsdata.loading,
    error: state.productsdata.error,
});

export default connect(mapStateToProps, actions)(Products);

const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1, paddingBottom: 120 },
    thumbnail: { width: 72, height: 72, borderRadius: 12 },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.PRIMARY_DARK,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 48,
        gap: 8,
    },
    addButtonText: {
        color: colors.WHITE,
        fontFamily: 'Sofia-Pro-SemiBold',
        fontSize: 14,
    },
});
