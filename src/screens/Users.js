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
import { FirebaseContext } from '../../redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import { editUser } from '../../redux/actions/useractions';
var { width } = Dimensions.get('window');
import * as actions from '../../redux/actions/useractions';
import { showToastError } from '../../redux/actions/Validation';

var unsubRef = null

function Users(props) {

    const { api, usersCollection } = useContext(FirebaseContext);
    const auth = useSelector(state => state.auth);
    const usersdata = useSelector(state => state.usersdata);
    const users = useSelector(state => state.usersdata.users);
    const loading = useSelector(state => state.usersdata.loading);

    const dispatch = useDispatch();

    const [tabIndex, setTabIndex] = useState(2)
    const [data, setData] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModelData, setDeleteModelData] = useState([]);

    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);

    useEffect(() => {
        if (usersdata.error && usersdata.error.msg) {
            showToastError(usersdata.error.msg);
        }

    }, [usersdata.error, usersdata.error.msg]);

    useEffect(() => {
        unsubRef = dispatch(api.fetchUsers());
        return () => unsubRef && unsubRef();
    }, [dispatch, api.fetchUsers]);


    const showLoader = () => {
        if (loading == true) {
            return <Spinner />
        }
    }

    const onDeleteUser = () => {
        onClose()
        dispatch(api.onDeleteUser(deleteModelData.uid))
    }


    const renderItem1 = ({ item, index }) => {
        return <HStack borderColor={colors.PRIMARY_DARK} borderWidth={1} borderRadius={5} p="1" marginY="1">
            {/* <Image
                source={{ uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg" }}
                style={{ width: 85, borderRadius: 5 }}
            /> */}

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
                    <Text style={globleStyles.cardTextValue} numberOfLines={1}>{item.firstname} {item.lastname}</Text>
                </Stack>
                <Stack>
                    <Text style={globleStyles.cardTextLabel}>Phone Number</Text>
                    <Text style={globleStyles.cardTextValue} numberOfLines={1}>{item.phoneNumber}</Text>
                </Stack>
                <HStack justifyContent="space-between">
                    <Stack flex={1}>
                        <Text style={globleStyles.cardTextLabel}>Email</Text>
                        <Text style={globleStyles.cardTextValue} numberOfLines={1}>{item.email}</Text>
                    </Stack>
                    <Switch size="md" width={30} height={30} alignSelf={'flex-end'} value={item.status == "active"} onValueChange={value => dispatch(api.onUserStatusChange(item.uid, value))} />
                </HStack>
            </VStack>

            <VStack justifyContent="space-between">
                {/* <Stack style={globleStyles.cardIconView}> */}
                <TouchableOpacity activeOpacity={0.8} style={globleStyles.cardIconView} onPress={() => {
                    dispatch(api.setEditUserDataToState(item))
                    props.navigation.navigate("AddUser", { uid: item.uid })
                }}>
                    <Ionicons name={'create-outline'} size={20} color={colors.PRIMARY_DARK} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={globleStyles.cardIconView} onPress={() => {
                    // dispatch(api.setEditUserDataToState(item))
                    props.navigation.navigate("ViewUser", { item: item })
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
        </HStack >
    }

    const deleteAlertView = () => {
        return (
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Delete User</AlertDialog.Header>
                    <AlertDialog.Body>
                        This will remove all data relating to {`${deleteModelData.firstname} ${deleteModelData.lastname}.`}
                        This action cannot be reversed. Deleted data can not be recovered.
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
            <Header title={'Users'} isLeftIconHide isTitleCenter={false} />

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
                    {/* <TouchableOpacity activeOpacity={0.8} style={globleStyles.addIconView} onPress={() => props.navigation.navigate("AddUser")}>
                        <Ionicons name={'person-add-outline'} size={25} color={colors.WHITE} />
                    </TouchableOpacity> */}
                </HStack>

                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={users}
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
        searchtext: state.usersdata.searchtext,
        loading: state.usersdata.loading
    }
};
export default connect(mapStateToProps, actions)(Users)

const styles = StyleSheet.create({
    materialButton: { height: 30, minWidth: 70, position: 'absolute', right: 0, bottom: 0, marginVertical: 0 }
})