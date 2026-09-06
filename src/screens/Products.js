import { Box, Center, VStack, WarningOutlineIcon, ScrollView, Input, Icon, Pressable, HStack, Spacer, StatusBar, useColorModeValue, Stack, Switch, AlertDialog, Button } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Platform,
    Image
} from 'react-native';
import globleStyles, { height } from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, Ionicons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { DummyText } from '../common/Constants';
import * as actions from '../../redux/actions/productactions';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FirebaseContext } from '../../redux';
import { showToastError } from '../../redux/actions/Validation';
import Spinner from '../components/Spinner';
import { PRODUCT_RESET } from '../../redux/store/type';
var { width } = Dimensions.get('window');

var unsubRef = null

function Products(props) {
    const { api, usersCollection } = useContext(FirebaseContext);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [deleteModelData, setDeleteModelData] = useState([]);

    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);

    useEffect(() => {
        if (props.error && props.error.msg) {
            showToastError(props.error.msg);
        }

    }, [props.error, props.error.msg]);

    useEffect(() => {
        unsubRef = dispatch(api.fetchProducts());
        return () => unsubRef && unsubRef();
    }, [dispatch, api.fetchProducts]);

    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    const onDeleteUser = () => {
        onClose()
        dispatch(api.onDeleteProduct(deleteModelData.id))
    }

    const renderItem1 = ({ item, index }) => {
        return <HStack borderColor={colors.PRIMARY_DARK} borderWidth={1} borderRadius={5} p="1" marginY="1">

            {item.image ?
                <Image
                    // source={{ uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg" }}
                    source={{ uri: item.image }}
                    style={{ width: 85, borderRadius: 5 }}
                />
                :
                <Image
                    source={require('../../assets/icon.png')}
                    style={globleStyles.profileIcon}
                />
            }
            <VStack justifyContent="space-between" space={1} paddingX="1.5" flex={1} >
                <Stack>
                    <Text style={globleStyles.cardTextLabel}>Name</Text>
                    <Text style={globleStyles.cardTextValue} numberOfLines={1}>{item.title}</Text>
                </Stack>
                <VStack justifyContent="space-between" flex={1}>
                    <Stack flex={1}>
                        <Text style={globleStyles.cardTextLabel}>Description</Text>
                        <Text style={{ ...globleStyles.cardTextValue }} numberOfLines={3}>{item.description}</Text>
                    </Stack>
                    <Switch size="md" width={30} height={30} alignSelf={'flex-end'} value={item.status == "active"} onValueChange={value => dispatch(api.onProductStatusChange(item.id, value))} top="1.5" />
                </VStack>
            </VStack>

            <VStack justifyContent="space-between">
                <TouchableOpacity activeOpacity={0.8} style={globleStyles.cardIconView} onPress={() => {
                    dispatch(api.setEditProductDataToState(item))
                    props.navigation.navigate("AddProduct", { actionUid: item.id })
                }}>
                    <Ionicons name={'create-outline'} size={20} color={colors.PRIMARY_DARK} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={globleStyles.cardIconView} onPress={() => {
                    // dispatch(api.setEditUserDataToState(item))
                    props.navigation.navigate("ViewProduct", { item: item })
                }}>
                    <Ionicons name={'eye-outline'} size={20} color={colors.PRIMARY_DARK} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={globleStyles.cardIconView} onPress={() => {
                    setIsOpen(!isOpen)
                    setDeleteModelData(item)
                }}>
                    <Ionicons name={'trash-outline'} size={20} color={colors.PRIMARY_DARK} />
                </TouchableOpacity>
            </VStack>
        </HStack>
    }

    const deleteAlertView = () => {
        return (
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Delete Product</AlertDialog.Header>
                    <AlertDialog.Body>
                        This will remove all data relating to {`${deleteModelData.title}.`} This action cannot be
                        reversed. Deleted data can not be recovered.
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={onDeleteUser}>
                                Delete
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        )
    }

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header title={'Products'} isLeftIconHide isTitleCenter={false} />

            {/* <Center w="100%" > */}
            <Box pb="185" w="95%" alignSelf={'center'}>

                <HStack space={2}>

                    <InputCard
                        onChangeText={props.searchFilterFunction}
                        blurOnSubmit={false}
                        value={props.searchtext}
                        // returnKey={"next"}
                        // keyboardType={"email-address"}
                        secureEntry={false}
                        placeholder={"Start typing..."}
                        cardInputStyle={{ flex: 1, borderColor: colors.PRIMARY_DARK }}
                        textInputStyle={{ paddingLeft: 0 }}
                        rightIcon={<Entypo name="magnifying-glass" color={colors.PRIMARY_DARK} size={20} />}>
                    </InputCard>
                    <TouchableOpacity activeOpacity={0.8} style={globleStyles.addIconView} onPress={() => {
                        dispatch({ type: PRODUCT_RESET, payload: null });
                        props.navigation.navigate("AddProduct")
                    }}>
                        <Ionicons name={'person-add-outline'} size={25} color={colors.WHITE} />
                    </TouchableOpacity>
                </HStack>

                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={props.products}
                    renderItem={renderItem1}
                // style={{ maxHeight: height - 210 }}
                />
            </Box>
            {/* </Center> */}
            {deleteAlertView()}
            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => {
    // console.log(state.auth.phonenumber);
    return {
        searchtext: state.productsdata.searchtext,
        products: state.productsdata.products,
        loading: state.productsdata.loading,
        error: state.productsdata.error
    }
};
export default connect(mapStateToProps, actions)(Products)

const styles = StyleSheet.create({
    materialButton: { height: 30, minWidth: 70, position: 'absolute', right: 0, bottom: 0, marginVertical: 0 }
})