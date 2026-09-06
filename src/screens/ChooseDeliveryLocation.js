import { Box, Center, FormControl, Stack, VStack, WarningOutlineIcon, ScrollView, Input, Icon, Radio, HStack, StatusBar } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    Alert,
    Platform
} from 'react-native';
import { FontBold, FontMedium, FontRegular, FontSemiBold } from '../common/Constants';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet from "react-native-actions-sheet";
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons, Ionicons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { FirebaseContext, store } from '../../redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/searchlocationactions';
import Spinner from '../components/Spinner';
import { showToastError, showToastSuccess } from '../../redux/actions/Validation';
import MapView, { PROVIDER_GOOGLE, Marker } from '../components/AppMapView';
import * as Location from 'expo-location';
import { UPDATE_GPS_LOCATION } from '../../redux/store/type';

var { width } = Dimensions.get('window');

function ChooseDeliveryLocation(props) {
    const { api } = useContext(FirebaseContext);
    const dispatch = useDispatch();

    const gps = useSelector(state => state.gpsdata);
    const latitudeDelta = 0.0922;
    const longitudeDelta = 0.0421;

    const actionSheetRef = useRef(null);
    const mapRef = useRef();


    const [error, setError] = useState(null);
    const [dragging, setDragging] = useState(0);
    const [locationRejected, setLocationRejected] = useState(false);

    const [state, setState] = useState({
        addressType: "Work",
        completeAddress: "",
        floor: "",
        nearByLandmark: "",
        region: null,
    });

    useEffect(() => {
        if (gps.error && gps.error.msg) {
            showToastError(gps.error.msg);
            dispatch(api.clearSaveAddressError())
        }

        if (gps.success == "success") {
            showToastSuccess("Address saved successfully")
            dispatch(api.clearSaveAddressError())
            props.navigation.goBack()
        }

    }, [gps.error, gps.error.msg, gps.success]);

    useEffect(() => {
        GetOneTimeLocation()
    }, [])

    useEffect(() => {
        if (gps.location) {
            if (gps.location.lat && gps.location.lng) {
                setDragging(0);
                if (state.region) {
                    if (mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
                        mapRef.current.animateToRegion({
                            latitude: gps.location.lat,
                            longitude: gps.location.lng,
                            latitudeDelta: latitudeDelta,
                            longitudeDelta: longitudeDelta
                        });
                    }
                    setState({
                        ...state, region: {
                            latitude: gps.location.lat,
                            longitude: gps.location.lng,
                            latitudeDelta: latitudeDelta,
                            longitudeDelta: longitudeDelta
                        }
                    })
                }
                else {
                    setState({
                        ...state, region: {
                            latitude: gps.location.lat,
                            longitude: gps.location.lng,
                            latitudeDelta: latitudeDelta,
                            longitudeDelta: longitudeDelta
                        }
                    })
                }
            } else {
                setLocationRejected(true);
            }
        }
    }, [gps.location]);


    const showLoader = () => {
        if (props.loading == true) {
            return <Spinner />
        }
    }

    const onRegionChangeComplete = (newregion, gesture) => {
        if (gesture && gesture.isGesture) {
            // updateAddresses({
            //     latitude: newregion.latitude,
            //     longitude: newregion.longitude
            // }, 'region-change');
            // console.log({
            //     latitude: newregion.latitude,
            //     longitude: newregion.longitude
            // }, 'region-change');

            dispatch({
                type: UPDATE_GPS_LOCATION,
                payload: {
                    lat: newregion.latitude,
                    lng: newregion.longitude
                }
            });
        }
    }

    const locateUser = async () => {
        let tempWatcher = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.Balanced
        }, location => {
            dispatch({
                type: UPDATE_GPS_LOCATION,
                payload: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                }
            });
            tempWatcher.remove();
        })
    }

    const GetOneTimeLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            try {
                let tempWatcher = await Location.watchPositionAsync({
                    accuracy: Location.Accuracy.Balanced
                }, location => {
                    store.dispatch({
                        type: UPDATE_GPS_LOCATION,
                        payload: {
                            lat: location.coords.latitude,
                            lng: location.coords.longitude
                        }
                    });
                    tempWatcher.remove();
                })
            } catch (error) {
                store.dispatch({
                    type: UPDATE_GPS_LOCATION,
                    payload: {
                        lat: null,
                        lng: null
                    }
                });
                Alert.alert("Alert", "Location Permission Error")
            }
        } else {
            store.dispatch({
                type: UPDATE_GPS_LOCATION,
                payload: {
                    lat: null,
                    lng: null
                }
            });
            Alert.alert("Alert", "Location Permission Error")
        }
    }

    const _attemptSubmit = () => {
        const { completeAddress } = state;
        setError(null)
        if (completeAddress == undefined || completeAddress == "") {
            setError({ completeAddress: "Please enter complete address" })
        } else {
            dispatch(api.saveAddress(state))
        }
    }

    const showActionSheet = () => {
        actionSheetRef.current?.setModalVisible(true);
    }

    const hideActionSheet = () => {
        actionSheetRef.current?.setModalVisible(false);
    }

    const addressActionSheet = () => {
        return (
            <ActionSheet ref={actionSheetRef}>
                <Text style={{ color: colors.BLACK, fontFamily: FontSemiBold, padding: 15, paddingBottom: 10, paddingLeft: 15, fontSize: 18 }}>Enter complete address</Text>
                <View style={{ height: 1, backgroundColor: colors.GREY_3, margin: 5, marginHorizontal: 10 }} />
                <Text style={{ color: colors.GREY_6, fontFamily: FontRegular, padding: 10, paddingLeft: 15, fontSize: 14 }}>Save address as *</Text>

                <HStack space="1.5" marginX="3.5" pt="0" pb="2">

                    <TouchableOpacity onPress={() => setState({ ...state, addressType: "Work" })}>
                        <Text style={[{ ...styles.textWithBorder }, state.addressType == "Work" && { borderColor: colors.PRIMARY_DARK, backgroundColor: colors.PRIMARY_LIGHT }]}>Work</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setState({ ...state, addressType: "Home" })}>
                        <Text style={[{ ...styles.textWithBorder }, state.addressType == "Home" && { borderColor: colors.PRIMARY_DARK, backgroundColor: colors.PRIMARY_LIGHT }]}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setState({ ...state, addressType: "Other" })}>
                        <Text style={[{ ...styles.textWithBorder }, state.addressType == "Other" && { borderColor: colors.PRIMARY_DARK, backgroundColor: colors.PRIMARY_LIGHT }]}>Other</Text>
                    </TouchableOpacity>
                </HStack>

                <VStack marginX={3.5} space={1}>

                    <FormControl isRequired isInvalid>
                        <InputCard
                            onChangeText={(text) => { setState({ ...state, completeAddress: text }) }}
                            value={state.completeAddress}
                            secureEntry={false}
                            placeholder={"Complete address *"}
                            textInputStyle={{
                                paddingBottom: 2,
                                fontSize: 14,
                                color: colors.BLACK,
                                height: Platform.OS == 'ios' ? 35 : 35,
                                paddingLeft: 0,
                                textAlignVertical: 'center',
                            }}>
                        </InputCard>
                        {error && error.completeAddress &&
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {error.completeAddress}
                            </FormControl.ErrorMessage>
                        }
                    </FormControl>

                    <FormControl isRequired isInvalid>
                        <InputCard
                            onChangeText={(text) => { setState({ ...state, floor: text }) }}
                            value={state.floor}
                            secureEntry={false}
                            placeholder={"Floor (optional)"}
                            textInputStyle={{
                                paddingBottom: 2,
                                fontSize: 14,
                                color: colors.BLACK,
                                height: Platform.OS == 'ios' ? 35 : 35,
                                paddingLeft: 0,
                                textAlignVertical: 'center',
                            }}>
                        </InputCard>
                    </FormControl>

                    <FormControl isRequired isInvalid>
                        <InputCard
                            onChangeText={(text) => { setState({ ...state, nearByLandmark: text }) }}
                            value={state.nearByLandmark}
                            secureEntry={false}
                            placeholder={"Nearby landmark (optional)"}
                            textInputStyle={{
                                paddingBottom: 2,
                                fontSize: 14,
                                color: colors.BLACK,
                                height: Platform.OS == 'ios' ? 35 : 35,
                                paddingLeft: 0,
                                textAlignVertical: 'center',
                            }}>
                        </InputCard>
                    </FormControl>
                </VStack>

                <View style={{ height: 1, backgroundColor: colors.GREY_3, marginTop: 10, marginHorizontal: 10 }} />

                {/* <View style={{ width: "90%" }}> */}
                <MaterialButtonDark onPress={() => _attemptSubmit()} style={{ marginHorizontal: 15 }}>Save address</MaterialButtonDark>
                {/* </View> */}

                {/* <View style={{ height: 1, margin: 5, marginHorizontal: 10 }} /> */}


            </ActionSheet >
        )
    }


    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header title={'Choose Delivery Location'} onPress={() => props.navigation.goBack()} isTitleCenter={false} />
            <View style={styles.mapcontainer}>
                {addressActionSheet()}

                {state.region ?
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        loadingEnabled
                        showsMyLocationButton={false}
                        style={styles.mapViewStyle}
                        initialRegion={state.region}
                        onRegionChangeComplete={onRegionChangeComplete}
                        onPanDrag={() => setDragging(30)}
                    />
                    : null}
                {state.region && Platform.OS !== 'web' ?
                    <View pointerEvents="none" style={styles.mapFloatingPinView}>
                        <Image pointerEvents="none" style={[styles.mapFloatingPin, { marginBottom: Platform.OS == 'ios' ? (hasNotch ? (-10 + dragging) : 33) : 40 }]} resizeMode="contain" source={require('../../assets/green_pin.png')} />
                    </View>
                    : null}
                <View style={styles.locationButtonView}>
                    <TouchableOpacity onPress={locateUser} style={styles.locateButtonStyle}>
                        <Ionicons name="locate-outline" color={colors.BLUE} size={26} />
                    </TouchableOpacity>
                </View>
                {locationRejected ?
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                        <Text>Location Permission Error</Text>
                    </View>
                    : null}

                <View style={{ position: 'absolute', bottom: 0, width: "90%" }}>
                    <MaterialButtonDark onPress={() => showActionSheet()}>Enter complete address</MaterialButtonDark>
                </View>

            </View>
            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        loading: state.gpsdata.loading,
        error: state.gpsdata.error
    }
};
export default connect(mapStateToProps, actions)(ChooseDeliveryLocation)


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE,
        //marginTop: StatusBar.currentHeight,
        justifyContent: 'center'
    },
    title: {
        fontFamily: 'Sofia-Pro-Bold',
        fontSize: width * 0.045,
        color: colors.DARK_BLUE,
        textAlign: 'center',
        textDecorationLine: "underline",
        marginVertical: 5
    },
    mapcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapViewStyle: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    mapFloatingPinView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    mapFloatingPin: {
        height: 40
    },
    locationButtonView: {
        position: 'absolute',
        height: Platform.OS == 'ios' ? 55 : 42,
        width: Platform.OS == 'ios' ? 55 : 42,
        bottom: 180,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: Platform.OS == 'ios' ? 30 : 3,
        elevation: 2,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
            height: 0,
            width: 0
        },
    },
    locateButtonStyle: {
        height: Platform.OS == 'ios' ? 55 : 42,
        width: Platform.OS == 'ios' ? 55 : 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWithBorder: {
        ...globleStyles.fontReg,
        fontSize: 13,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.GREY_5,
        backgroundColor: colors.WHITE,
        paddingHorizontal: 10,
        paddingVertical: 2
    },
})