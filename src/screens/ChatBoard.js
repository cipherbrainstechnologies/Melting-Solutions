import { Box, Center, VStack, WarningOutlineIcon, ScrollView, Input, Icon, Pressable, HStack, Spacer, StatusBar, useColorModeValue, Stack, Image, Checkbox } from 'native-base';
import React, { useContext, useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    TextInput,
    Platform,
    Linking,
    KeyboardAvoidingView,
    SafeAreaView, Modal, Keyboard, Alert
} from 'react-native';
import globleStyles, { height } from '../common/globleStyles';
import { colors } from '../common/theme';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, MaterialIcons } from 'react-native-vector-icons';
import MaterialButtonDark from '../components/MaterialButtonDark';
import { TabView, SceneMap } from "react-native-tab-view";
import CustomSwitch from '../components/CustomSwitch';
import { isIphoneWithNotch } from '../common/Constants';
import { FirebaseContext } from '../../redux';
import { useSelector } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import ActionSheet from 'react-native-actions-sheet';
import * as ImagePicker from 'expo-image-picker';
import Spinner from '../components/Spinner';
import moment from 'moment';
import { sendNotification, uploadImagetoFirebase } from '../../redux/actions/Validation';


var { width } = Dimensions.get('window');

export default function ChatBoard(props) {

    const {
        storage,
        usersCollection,
        chatCollection,
        chatListCollection } = useContext(FirebaseContext);

    const userData = useSelector(state => state.auth.info);

    const userChatRef = chatCollection.doc(props.navigation.state.params.chatId);
    const chatListRef = chatListCollection.doc(props.navigation.state.params.chatId);

    const [users, setUsers] = useState([])
    const [orderData, setOrderData] = useState([])
    const [messageList, setMessageList] = useState([])
    const [message, setMessage] = useState("")
    const [receiverUser, setReceiverUser] = useState("")
    const [user, setUserData] = useState("")
    const [isContentScroll, setContentScroll] = useState(true)
    const [yOffset, setYOffSet] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [imageUpload, setImageUpload] = useState("")
    const [loading, setLoading] = useState(false)
    const [isShowImageViwer, setIsShowImageViwer] = useState(false)
    const [images, setImages] = useState(false)

    const actionSheetRef = useRef(null)
    const flatListRef = useRef(null)

    var userNodeData = null
    var receiverNodeData = null
    var unsubRef = null
    var usersChatId = null

    let keyboardHeight = 0
    let scrollOffset = 0

    useEffect(() => {
        let unsubRef = null;
        let keyboardShowSub = null;
        let keyboardHideSub = null;

        const setup = async () => {
            const params = props.navigation.state.params || {};
            usersChatId = params.chatId;
            let receiverData = params.receiver;

            if (!usersChatId || !receiverData || !receiverData.uid || !userData?.uid) {
                console.log('ChatBoard missing chatId/receiver/user');
                return;
            }

            setUserData(userData)
            setReceiverUser(receiverData)
            setOrderData(params.orderData)

            let userChatList = []
            await usersCollection.doc(String(userData.uid)).get().then((doc) => {
                if (doc.exists) {
                    userChatList = doc.data().usersChatList != undefined ? doc.data().usersChatList : []
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting cached document:", error);
            });
            const isChatIDExists = userChatList.indexOf(String(usersChatId))
            if (isChatIDExists < 0) {
                userChatList[userChatList.length] = usersChatId;
                usersCollection.doc(String(userData.uid)).update({ usersChatList: userChatList })
            }

            let receiverChatList = []
            await usersCollection.doc(String(receiverData.uid)).get().then((doc) => {
                if (doc.exists) {
                    receiverChatList = doc.data().usersChatList != undefined ? doc.data().usersChatList : []
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting cached document:", error);
            });

            const isOwnerIDExists = receiverChatList.indexOf(String(usersChatId))
            if (isOwnerIDExists < 0) {
                receiverChatList[receiverChatList.length] = usersChatId;
                usersCollection.doc(String(receiverData.uid)).update({ usersChatList: receiverChatList })
            }

            let newMessages = messageList
            unsubRef = userChatRef
                .collection('messages')
                .orderBy("createDate", "asc")
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        let data = doc.data();

                        const index =
                            messageList && messageList.length > 0
                                ? messageList.findIndex(e => e.id === doc.id)
                                : -1;

                        if (index === -1) {
                            messageList.push({
                                id: doc.id,
                                ...data
                            });
                        } else {
                            messageList[index] = {
                                id: doc.id,
                                ...data
                            };
                        }
                    });
                    let chatMessage = {}
                    chatMessage[userData.uid] = true
                    chatListRef.update(chatMessage)

                    setMessageList([...newMessages])
                });

            keyboardShowSub = Keyboard.addListener("keyboardWillShow", _keyboardWillShow);
            keyboardHideSub = Keyboard.addListener("keyboardWillHide", _keyboardWillHide);
        };

        setup();

        return () => {
            if (unsubRef) unsubRef();
            if (keyboardShowSub) keyboardShowSub.remove();
            if (keyboardHideSub) keyboardHideSub.remove();
        };
    }, []);

    const showActionSheet = () => {
        actionSheetRef.current?.setModalVisible(true);
    }

    const GetImageActionSheet = () => {
        return (
            <ActionSheet ref={actionSheetRef}>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderColor: colors.GREY_1, borderBottomWidth: 1, height: 60, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { _pickImage('CAMERA', ImagePicker.launchCameraAsync) }}
                >
                    <Text style={{ color: colors.GREY_8, fontWeight: 'bold', fontFamily: 'poppinsBold' }}>{'Camera'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderBottomWidth: 1, borderColor: colors.GREY_1, height: 60, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { _pickImage('MEDIA', ImagePicker.launchImageLibraryAsync) }}
                >
                    <Text style={{ color: colors.GREY_8, fontWeight: 'bold', fontFamily: 'poppinsBold' }}>{'Media Library'}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    onPress={removeImage}>
                    <Text style={{ color: 'red', fontWeight: 'bold', fontFamily: 'poppinsBold' }}>Remove Image</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { actionSheetRef.current?.setModalVisible(false); }}>
                    <Text style={{ color: 'red', fontWeight: 'bold', fontFamily: 'poppinsBold' }}>Cancel</Text>
                </TouchableOpacity>
            </ActionSheet>
        )
    }

    const chatTimeFormat = (timestamp) => {
        const date = timestamp ? timestamp.toDate() : null;
        return date;
    }

    const imageViewer = (imageUrl) => {
        let images = [{ url: imageUrl, }]

        setImages(images)
        setIsShowImageViwer(true)
    }

    const getDatString = (date) => {
        const today = new Date
        const yesterday = new Date;
        yesterday.setDate(today.getDate() - 1)
        if (date.toLocaleDateString() == today.toLocaleDateString()) {
            return 'Today'
        } else if (date.toLocaleDateString() == yesterday.toLocaleDateString()) {
            return 'Yesterday'
        } else {
            return moment(date).format("MMMM DD")
        }
    }

    const getMessageData = (item, index) => {

        if (index == 0) {
            return <Text style={{ marginVertical: 10, alignSelf: 'center', color: colors.BLACK, fontSize: 12, fontFamily: "poppinsRegular" }}>
                {getDatString(chatTimeFormat(item.createDate))}
            </Text>
        } else if (moment(chatTimeFormat(item.createDate)).format("MMMM DD") != moment(chatTimeFormat(messageList[index - 1].createDate)).format("MMMM DD")) {
            return <Text style={{ marginVertical: 10, alignSelf: 'center', color: colors.BLACK, fontSize: 12, fontFamily: "poppinsRegular" }}>
                {getDatString(chatTimeFormat(item.createDate))}
            </Text>
        }

        return <View />

    }

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: 25 }}>
                {getMessageData(item, index)}
                {
                    item.sender_id != user.uid ?
                        <View key={index} style={styles.messageContainer}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image source={receiverUser != undefined && receiverUser.profileImage != undefined && receiverUser.profileImage != '' ?
                                    { uri: receiverUser.profileImage } : require('../../assets/icon.png')}
                                    style={styles.receiverImage} />

                                {item.messageType == "image" ?
                                    <TouchableOpacity style={styles.messageLeftImage} onPress={() => imageViewer(item.message)}>
                                        <Image source={{ uri: item.message }} style={styles.messageImage} />
                                    </TouchableOpacity>
                                    :
                                    <View style={styles.messageLeftView}>
                                        <Text style={styles.leftMessageText}>{item.message}</Text>
                                    </View>
                                }
                            </View>
                            <Text style={styles.leftTime}>{moment(chatTimeFormat(item.createDate)).format("HH:mm A")}</Text>
                        </View> :
                        <View key={index} style={styles.messageRightContainer}>
                            {item.messageType == "image" ?
                                <TouchableOpacity style={styles.messageRightImage} onPress={() => imageViewer(item.message)}>
                                    <Image source={{ uri: item.message }} style={styles.messageImage} />
                                </TouchableOpacity>
                                :
                                <View style={styles.messageRightView}>
                                    <Text style={styles.rightMessageText}>{item.message}</Text>
                                </View>
                            }
                            <Text style={styles.rightTime}>{moment(chatTimeFormat(item.createDate)).format("HH:mm A")}</Text>
                        </View>
                }
            </View>
        )
    }

    const onMessageSend = async () => {

        if (String(message).trim() == '') {
            return
        }
        setMessage('')
        let chatMessage = {
            message: message,
            sender_id: user.uid,
            createDate: new Date(),
            read: false,
            chatId: props.navigation.state.params.chatId,
            users: [user.uid, receiverUser.uid],
            messageType: 'text',
            mediaLink: ''
        }
        chatMessage[user.uid] = true
        chatMessage[receiverUser.uid] = false
        chatListRef.set(chatMessage)

        let chatMessageDoc = userChatRef.collection('messages');

        await chatMessageDoc.add({
            message: message,
            sender_id: user.uid,
            createDate: new Date(),
            read: false,
            messageType: 'text',
            mediaLink: ''
        });

        // console.log({
        //     status: "chat",
        //     chatId: props.navigation.state.params.chatId,
        //     receiver: props.navigation.state.params.receiver,
        //     title: props.navigation.state.params.title,
        //     profileImage: props.navigation.state.params.profileImage,
        //     orderData: props.navigation.state.params.orderData
        // });
        /* Notification — send `sender` so recipient opens chat with the correct counterparty */
        sendNotification({
            token: receiverUser.token,
            title: "Received new chat message from " + user.firstname + " " + user.lastname,
            body: message,
            data: {
                status: "chat",
                chatId: props.navigation.state.params.chatId,
                sender: {
                    uid: user.uid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    image: user.image || null,
                    token: user.token || null,
                    usertype: user.usertype,
                },
                orderData: props.navigation.state.params.orderData || null,
            },
        })

        setTimeout(() => {
            flatListRef.current.scrollToEnd();
        }, 500);
    }

    const _keyboardWillShow = e => {
        keyboardHeight = e.endCoordinates
            ? e.endCoordinates.height
            : e.end.height;

        const newOffset = scrollOffset + keyboardHeight;
        if (flatListRef.current != null) {
            flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
        }

    };

    const _keyboardWillHide = e => {
        const newOffset = scrollOffset - keyboardHeight;
        if (flatListRef.current != null) {
            flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
        }
    };

    const handleScroll = e => {
        scrollOffset = e.nativeEvent.contentOffset.y;

        if (parseInt(yOffset) <= e.nativeEvent.contentOffset.y) {
            setContentScroll(true)
        } else {
            setContentScroll(false)
        }

        setYOffSet(e.nativeEvent.contentOffset.y)
    };

    const uploadImage = async (path) => {
        // Firebase Web SDK path (not RN Firebase `storage().ref`)
        return uploadImagetoFirebase(path, `${props.navigation.state.params.chatId}_${Date.now()}`, storage);
    }

    const onSubmit = async (imageUpload) => {
        console.log("sending image");
        setLoading(true)
        let url = await uploadImage(imageUpload)
        if (!url) {
            setLoading(false)
            Alert.alert('Upload failed', 'Could not upload image. Please try again.');
            return;
        }
        let chatMessage = {
            message: url,
            sender_id: user.uid,
            createDate: new Date(),
            read: false,
            chatId: props.navigation.state.params.chatId,
            users: [user.uid, receiverUser.uid],
            messageType: 'image',
            mediaLink: url
        }
        chatMessage[user.uid] = true
        chatMessage[receiverUser.uid] = false
        chatListRef.set(chatMessage)

        let chatMessageDoc = userChatRef.collection('messages');

        await chatMessageDoc.add({
            message: url,
            sender_id: user.uid,
            createDate: new Date(),
            read: false,
            messageType: 'image',
            mediaLink: url
        });
        setMessage('')
        /* Notification */
        sendNotification({
            token: receiverUser.token,
            title: "Received new chat message from " + user.firstname + " " + user.lastname,
            body: "image file",
            data: {
                status: "chat",
                chatId: props.navigation.state.params.chatId,
                sender: {
                    uid: user.uid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    image: user.image || null,
                    token: user.token || null,
                    usertype: user.usertype,
                },
                orderData: props.navigation.state.params.orderData || null,
            },
        })
        setTimeout(() => {
            flatListRef.current.scrollToEnd();
        }, 500);
        setLoading(false)
    }

    const _pickImage = async (permissionType, res) => {
        var pickFrom = res;
        let permisions;
        if (permissionType == 'CAMERA') {
            permisions = await ImagePicker.requestCameraPermissionsAsync();
        } else {
            permisions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        const { status } = permisions;

        if (status == 'granted') {

            let result = await pickFrom({
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.9,
                base64: true
            });

            actionSheetRef.current?.setModalVisible(false);
            if (!result.cancelled) {
                let data = 'data:image/jpeg;base64,' + result.base64;
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        resolve(xhr.response);
                    };
                    xhr.onerror = function () {
                        Alert.alert('Alert', 'Image upload error');
                        setLoading(false);
                    };
                    xhr.responseType = 'blob';
                    xhr.open('GET', Platform.OS == 'ios' ? data : result.uri, true);
                    xhr.send(null);
                });
                onSubmit(blob)
            }
        } else {
            Alert.alert('Alert', 'Camera Permisison Error')
        }
    }

    const showImageViewer = () => {
        return (
            <Modal visible={isShowImageViwer} transparent={false}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ position: 'absolute', zIndex: 999, right: 20, top: 38, alignSelf: 'flex-end' }} onPress={() => setIsShowImageViwer(false)}>
                        {/* <Image source={Assets.cancel} style={{ width: 18, height: 18, tintColor: colors.WHITE }} resizeMode={"contain"} /> */}
                        <Entypo name="cross" color="red" size={25} style={{ width: 20, height: 20, tintColor: colors.WHITE }} />
                    </TouchableOpacity>
                    <ImageViewer imageUrls={images} />
                </View>
            </Modal>
        )
    }

    var created = ""
    try {
        if (orderData.created) created = moment(new Date((orderData.created.seconds + orderData.created.nanoseconds * 10 ** -9) * 1000)).format("MMM D, YYYY [at] LT")
        // console.log(orderData.created.toDate().toDateString());
    } catch (error) {
        // console.log(error);

    }

    var count = 0;
    orderData.cart && orderData.cart.map(i => i.status == "active" && count++)
    return (
        <View style={globleStyles.mainView}>

            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Box safeAreaTop bg="#ffffff" />

            {GetImageActionSheet()}
            {showImageViewer()}

            <HStack style={[globleStyles.headerView, globleStyles.headerView1]}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Entypo name="chevron-left" color="black" size={25} />
                </TouchableOpacity>

                <View style={[globleStyles.LeftTitleView, { alignSelf: 'center', marginHorizontal: 5, flex: 6, flexDirection: 'row' }]}>
                    <Image source={props.navigation.state.params.profileImage != undefined && props.navigation.state.params.profileImage != '' ?
                        { uri: props.navigation.state.params.profileImage } : require('../../assets/icon.png')}
                        style={{ ...styles.receiverImage, alignSelf: "center", width: 40, height: 40 }} />
                    <Text style={globleStyles.headerText}>{props.navigation.state.params.title}</Text>
                </View>
                <TouchableOpacity onPress={() =>
                    props.navigation.state.params.receiver.phoneNumber
                        ? Linking.openURL(`tel:${props.navigation.state.params.receiver.phoneNumber}`)
                        : null}>
                    <Entypo name={"phone"} color={colors.PRIMARY_DARK} size={25} />
                </TouchableOpacity>
            </HStack>

            <View style={{ flex: 1 }}>

                {/* order details */}
                <Stack borderBottomColor={colors.GREY_4} borderBottomWidth={1} paddingX={2} pb="2" pt="1">
                    <HStack justifyContent="space-between" >
                        <Text style={styles.text1}>#{orderData.id}</Text>
                        {/* <Text style={styles.text1}>₹6000.00</Text> */}
                    </HStack>
                    <Text style={styles.text2}>{count} Items</Text>
                    <HStack justifyContent="space-between">
                        <VStack>
                            {/* <Text style={styles.text2}>{orderData.created && moment(orderData.created.toDate()).format("MMM D, YYYY [at] LT")}</Text> */}
                            <Text style={styles.text2}>{created}</Text>
                            <Text style={styles.text2}>{orderData.cart && orderData.cart[0].title}</Text>
                        </VStack>
                        {/* <MaterialButtonDark onPress={() => null} style={styles.materialButton}>Chat</MaterialButtonDark> */}
                    </HStack>
                </Stack>
                {/* order details end */}

                {messageList.length > 0 ?
                    <FlatList
                        ref={flatListRef}
                        data={messageList}
                        style={{ flexGrow: 1 }}
                        contentContainerStyle={{ paddingTop: 20 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item + index}
                        onScroll={handleScroll}
                        onLayout={() => {
                            flatListRef.current.scrollToEnd();
                        }}
                        onContentSizeChange={() => {
                            if (isContentScroll && flatListRef != null) {
                                flatListRef.current.scrollToEnd()
                            }
                        }}
                    /> : null}
            </View>

            <View style={styles.messageEnterContainer}>
                <TouchableOpacity style={styles.sendButtonContainer} onPress={showActionSheet}>
                    {/* <Image source={Assets.plus} style={style.sendImage} resizeMode={"contain"} /> */}
                    <Entypo name="plus" color={colors.DARK_BLUE} size={25} style={styles.sendImage} />
                </TouchableOpacity>
                <TextInput
                    placeholder={'Write a message'}
                    style={styles.messageInput}
                    value={message}
                    placeholderTextColor={colors.GREY_7}
                    multiline={true}
                    // numberOfLines={3}
                    onChangeText={(message) => setMessage(message)}
                />
                <TouchableOpacity style={styles.sendButtonContainer} onPress={onMessageSend}>
                    {/* <Image source={Assets.send} style={style.sendImage} resizeMode={"contain"} /> */}
                    {/* <Entypo name="direction" color="red" size={20} style={style.sendImage} /> */}
                    <MaterialIcons name="send" color={colors.DARK_BLUE} size={20} style={styles.sendImage} />
                </TouchableOpacity>
            </View>
            {loading && <Spinner />}
        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: colors.WHITE },
    messageContainer: { marginRight: 60, marginBottom: 20 },
    messageLeftView: {
        flex: -1,
        marginRight: 5,
        borderRadius: 10,
        padding: 10,
        backgroundColor: colors.GREY_3
    },
    messageLeftImage: {
        flex: -1,
        marginRight: 5,
        // borderRadius: 12,
        // padding: 5,
        backgroundColor: colors.WHITE
    },
    messageRightImage: {
        flex: -1,
        marginRight: 5,
        // borderRadius: 12,
        // padding: 5,  
        backgroundColor: colors.WHITE
    },
    leftMessageText: {
        color: colors.BLACK,
        fontFamily: "poppinsRegular", lineHeight: 21
    },
    rightMessageText: {
        color: colors.WHITE,
        fontFamily: "poppinsRegular", lineHeight: 21
    },
    messageRightContainer: {
        marginLeft: 60,
        // flexDirection: 'row',
        alignSelf: 'flex-end',
        marginBottom: 20
    },
    messageRightView: {
        flex: -1,
        marginRight: 5,
        borderRadius: 10,
        padding: 10,
        backgroundColor: colors.PRIMARY_DARK,
    },
    messageRightTitle: {
        color: colors.WHITE,
        fontFamily: "poppinsRegular", lineHeight: 21
    },
    leftTime: {
        // position: 'absolute', bottom: -20, left: 45,
        marginLeft: 45, marginTop: 5,
        color: colors.GREY_7, fontSize: 10, fontFamily: "poppinsRegular"
    },
    rightTime: {
        color: colors.GREY_7, fontSize: 10, fontFamily: "poppinsRegular",
        textAlign: 'right', marginRight: 10, marginTop: 5
    },

    messageEnterContainer: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: colors.GREY_1,
        flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'center',
        marginBottom: isIphoneWithNotch() || Platform.OS == "android" ? 0 : -28
    },
    messageInput: {
        flex: 1, ...globleStyles.fontReg, textAlignVertical: 'center',
        padding: 10, marginTop: 5, paddingVertical: Platform.OS == "android" ? 0 : 10, maxHeight: 70,
    },
    sendImage: {
        width: 20,
        height: 20,
    },
    receiverImage: { alignSelf: "flex-end", marginRight: 10, width: 30, height: 30, borderRadius: 60 },
    messageImage: { width: 170, height: 170, padding: -10, borderRadius: 10 },
    text1: {
        fontSize: 16,
        ...globleStyles.fontMedium,
    },
    text2: {
        fontSize: 15,
        ...globleStyles.fontMedium,
        color: colors.GREY_7,
        lineHeight: 19,
        paddingTop: 2
    },
})