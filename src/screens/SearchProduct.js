import { Badge, Box, Flex, HStack, Pressable, Image, AspectRatio, StatusBar, VStack } from 'native-base';
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
import { connect, useDispatch } from 'react-redux';
import { FirebaseContext } from '../../redux';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import * as actions from '../../redux/actions/productactions';
import { InputCard } from '../components/InputCard';
import Header from '../components/Header';
var { width } = Dimensions.get('window');

var unsubRef = null
var cartRef = null
function SearchProduct(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();

    useEffect(() => {
        unsubRef = dispatch(api.fetchProducts("active"));
        return () => unsubRef && unsubRef();
    }, [dispatch, api.fetchProducts]);

    // useEffect(() => {
    //     dispatch(api.fetchCartCount())
    // }, [dispatch, api.fetchCartCount]);

    // const [datas, setDatas] = useState(Array(10).fill(0))
    const renderData = ({ item, index }) => {
        return <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => props.navigation.navigate("ProductDetail", { item })}>
            {/* <Image
                source={{ uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg" }}
                style={styles.box_icon}
            /> */}
            {item.image ?
                <Image
                    source={{ uri: item.image }}
                    style={styles.box_icon}
                />
                :
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.box_icon}
                />
            }

            <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>;
    }

    return (
        <View style={globleStyles.mainViewWithColor}>
            <StatusBar backgroundColor={colors.PRIMARY_LIGHT} barStyle={'dark-content'} />
            <Header title={'Products'} isLeftIconHide isTitleCenter={false} style={{backgroundColor:colors.PRIMARY_LIGHT}}/>

            <Box safeAreaTop bg={colors.PRIMARY_LIGHT} />
            <View style={{ ...globleStyles.subMainView, marginHorizontal: 0 }}>


                <HStack space={2} marginX={3}>
                    <InputCard
                        onChangeText={props.searchFilterFunction2}
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
                </HStack>

                <FlatList
                    refreshing={true}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={props.searchProducts}
                    // extraData={this.state}
                    renderItem={renderData}
                    style={{
                        flex: 0, paddingTop: 5,
                        backgroundColor: colors.fullTransparent,
                    }}
                    numColumns={2}
                    fadingEdgeLength={10}
                    contentContainerStyle={
                        {
                            backgroundColor: colors.fullTransparent,
                            alignSelf: 'center',
                            // alignItems: 'center'
                        }
                    }
                />
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    // console.log(state.auth.phonenumber);
    return {
        searchtext: state.productsdata.searchtext,
        searchProducts: state.productsdata.searchProducts,
        cartCount: state.productsdata.cartCount,
        loading: state.productsdata.loading,
        error: state.productsdata.error
    }
};
export default connect(mapStateToProps, actions)(SearchProduct)

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE,
        //marginTop: StatusBar.currentHeight,
    },
    title: {
        fontFamily: 'Sofia-Pro-Bold',
        fontSize: width * 0.045,
        color: colors.DARK_BLUE,
        textAlign: 'center',
        textDecorationLine: "underline",
        marginVertical: 5
    },
    box_icon: {
        width: 120,
        height: 120,
        alignSelf: 'center'
    },
    text: {
        fontSize: 20,
        // color: AppStyles.colorMain.color,
        textAlign: 'center',
        ...globleStyles.fontMedium,
        marginTop: 5,
        marginLeft: 0,
        marginRight: 0,
    },
    mainCard: {
        width: Dimensions.get('window').width / 2.25,
        height: Dimensions.get('window').width / 2.25,
        flexDirection: 'column',
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 10,
        paddingHorizontal: 15,
        // paddingTop: 15,
        // paddingBottom: 5,
        justifyContent: 'space-evenly',
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
        elevation: 9,
    },
})