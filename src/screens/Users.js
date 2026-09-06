import { Box, VStack, ScrollView, HStack, StatusBar, AlertDialog, Button, Switch, Stack } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import globleStyles from '../common/globleStyles';
import { colors } from '../common/theme';
import { layout, useWindowWidth } from '../common/responsive';
import Header from '../components/Header';
import { InputCard } from '../components/InputCard';
import { Entypo, Ionicons } from 'react-native-vector-icons';
import { FirebaseContext } from '../../redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import * as actions from '../../redux/actions/useractions';
import { showToastError } from '../../redux/actions/Validation';

var unsubRef = null;

function Users(props) {
    const { api } = useContext(FirebaseContext);
    const usersdata = useSelector(state => state.usersdata);
    const users = useSelector(state => state.usersdata.users);
    const loading = useSelector(state => state.usersdata.loading);
    const dispatch = useDispatch();
    const { isDesktop } = useWindowWidth();

    const [isOpen, setIsOpen] = useState(false);
    const [deleteModelData, setDeleteModelData] = useState([]);
    const cancelRef = useRef(null);

    const onClose = () => setIsOpen(false);

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
        if (loading === true) {
            return <Spinner />;
        }
    };

    const onDeleteUser = () => {
        onClose();
        dispatch(api.onDeleteUser(deleteModelData.uid));
    };

    const renderItem1 = ({ item }) => {
        return (
            <HStack style={globleStyles.userCard}>
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.avatar}
                    />
                ) : (
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.avatar}
                    />
                )}
                <VStack justifyContent="space-between" space={2} paddingX="2" flex={1}>
                    <Stack>
                        <Text style={globleStyles.cardTextLabel}>Name</Text>
                        <Text style={globleStyles.cardTextValue} numberOfLines={1}>
                            {item.firstname} {item.lastname}
                        </Text>
                    </Stack>
                    <Stack>
                        <Text style={globleStyles.cardTextLabel}>Phone</Text>
                        <Text style={globleStyles.cardTextValue} numberOfLines={1}>
                            {item.phoneNumber}
                        </Text>
                    </Stack>
                    <HStack justifyContent="space-between" alignItems="flex-end">
                        <Stack flex={1} pr="2">
                            <Text style={globleStyles.cardTextLabel}>Email</Text>
                            <Text style={globleStyles.cardTextValue} numberOfLines={1}>
                                {item.email}
                            </Text>
                        </Stack>
                        <Switch
                            size="md"
                            value={item.status === 'active'}
                            onValueChange={value => dispatch(api.onUserStatusChange(item.uid, value))}
                        />
                    </HStack>
                </VStack>

                <VStack justifyContent="space-between" space={2}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={globleStyles.cardIconView}
                        onPress={() => {
                            dispatch(api.setEditUserDataToState(item));
                            props.navigation.navigate('AddUser', { uid: item.uid });
                        }}
                    >
                        <Ionicons name={'create-outline'} size={20} color={colors.PRIMARY_DARK} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={globleStyles.cardIconView}
                        onPress={() => props.navigation.navigate('ViewUser', { item })}
                    >
                        <Ionicons name={'eye-outline'} size={20} color={colors.PRIMARY_DARK} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={globleStyles.cardIconView}
                        onPress={() => {
                            setIsOpen(true);
                            setDeleteModelData(item);
                        }}
                    >
                        <Ionicons name={'trash-outline'} size={20} color={colors.PRIMARY_DARK} />
                    </TouchableOpacity>
                </VStack>
            </HStack>
        );
    };

    const deleteAlertView = () => (
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
    );

    return (
        <View style={globleStyles.mainView}>
            <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
            <Header title={'Users'} isLeftIconHide isTitleCenter={false} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Box w="100%" maxW={layout.cardMaxWidth} alignSelf="center" px="4" py="4">
                    <HStack justifyContent="space-between" alignItems="center" mb="4">
                        <VStack flex={1} pr="3">
                            <Text style={globleStyles.sectionTitle}>User management</Text>
                            <Text style={globleStyles.screenDescription}>
                                Add buyers, set their passwords, and manage account status.
                            </Text>
                        </VStack>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.addButton}
                            onPress={() => {
                                dispatch(api.resetUserForm());
                                props.navigation.navigate('AddUser');
                            }}
                        >
                            <Ionicons name={'person-add-outline'} size={22} color={colors.WHITE} />
                            {isDesktop && <Text style={styles.addButtonText}>Add User</Text>}
                        </TouchableOpacity>
                    </HStack>

                    <HStack space={2} mb="4">
                        <InputCard
                            onChangeText={props.searchFilterFunction}
                            blurOnSubmit={false}
                            value={props.searchtext}
                            secureEntry={false}
                            placeholder={"Search by name, email, or phone..."}
                            cardInputStyle={{ flex: 1, borderColor: colors.BORDER }}
                            textInputStyle={{ paddingLeft: 0 }}
                            rightIcon={<Entypo name="magnifying-glass" color={colors.PRIMARY_DARK} size={20} />}
                        />
                    </HStack>

                    <FlatList
                        keyExtractor={(item, index) => item.uid || index.toString()}
                        scrollEnabled={false}
                        data={users || []}
                        renderItem={renderItem1}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={48} color={colors.GREY_4} />
                                <Text style={globleStyles.sectionTitle}>No users yet</Text>
                                <Text style={globleStyles.screenDescription}>
                                    Tap the add button to create the first buyer account.
                                </Text>
                            </View>
                        }
                    />
                </Box>
            </ScrollView>

            {deleteAlertView()}
            {showLoader()}
        </View>
    );
}

const mapStateToProps = (state) => ({
    searchtext: state.usersdata.searchtext,
    loading: state.usersdata.loading,
});

export default connect(mapStateToProps, actions)(Users);

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 120,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.PRIMARY_DARK,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        minWidth: 48,
    },
    addButtonText: {
        color: colors.WHITE,
        fontFamily: 'Sofia-Pro-SemiBold',
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        gap: 8,
    },
});
