/* @flow */

import React, { Component, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { NavigationActions } from "react-navigation";
import Spinner from './Spinner';
import globleStyles from '../common/globleStyles';
import DrawerItem from './DrawerItem';
import { Box, HStack, VStack } from 'native-base';
import { colors } from '../common/theme';
import { FirebaseContext } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';

export default function Drawer(props) {
  const { api } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const onItemPress = (index) => {
    switch (index) {
      case 1:
        props.navigation.dispatch(NavigationActions.navigate({
          routeName: "Home",
        }))
        break;
      case 2:
        props.navigation.dispatch(NavigationActions.navigate({
          routeName: "Users",
        }))
        break;
      case 3:
        props.navigation.dispatch(NavigationActions.navigate({
          routeName: "Order",
        }))
        break;
      case 4:
        props.navigation.dispatch(NavigationActions.navigate({
          routeName: "Order",
        }))
        break;
      case 5:
        props.navigation.dispatch(NavigationActions.navigate({
          routeName: "Order",
        }))
        break;
      case 7:
        props.navigation.dispatch(NavigationActions.navigate({
          routeName: "Reports",
        }));
        break;
      case 8:
        props.navigation.dispatch(NavigationActions.navigate({
          routeName: "Profile",
        }));
        break;
      case 9:
        props.navigation.dispatch(NavigationActions.navigate({
          routeName: "NotificationBroadcast",
        }));
        break;
      case 10:
        //props.navigation.closeDrawer();
        onLogout();
        break;
      case 11:
        props.navigation.closeDrawer();
        // props.restorePurcahse();
        break;
    }
  }

  const onLogout = () => {
    props.navigation.closeDrawer();
    Alert.alert(
      'SIGNOUT!',
      'Are you sure you want to signout?',
      [
        { text: 'NO', onPress: () => { console.log("sd") } },
        {
          text: 'YES', onPress: () => {
            logout();
          }
        },
      ],
      { cancelable: false }
    )
  }

  const logout = () => {
    /*props.navigation.dispatch(NavigationActions.navigate({
      routeName:"Auth",
    }))*/
    dispatch(api.signOut());
    props.navigation.dispatch({
      type: NavigationActions.NAVIGATE,
      routeName: 'AuthRoot',
      key: null,
      action: {
        type: NavigationActions.RESET,
        index: 0,
        actions: [{ type: NavigationActions.RESET, routeName: 'AuthRoot' }]
      }
    })
  }

  const showSubscriptionBtn = () => {
    const { userData } = props;
    if (userData.type != "employee") {
      return <DrawerItem onPress={() => onItemPress(4)} index={4} label={"Subscription"} />
    }
  }

  const showRestoreButton = () => {
    const { userData } = props;
    if (userData.type != "employee") {
      return <DrawerItem onPress={() => onItemPress(8)} index={4} label={"Restore"} />
    }
  }

  const showLoader = () => {
    if (props.drawerLoading) {
      return <Spinner />
    }
  }
  const { userData } = props;
  // var fullName = userData.first_name.toUpperCase() + " " + userData.last_name.toUpperCase();
  return (
    <View style={globleStyles.drawerContainer}>
      <Box safeAreaTop bg="#ffffff" />
      <HStack pb="0" pt="2" mb="1">
        {/* <Image
          source={{ uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg" }}
          style={{ width: 50, height: 50, borderRadius: 10 }}
        /> */}
        {auth.info.image ?
          <Image
            source={{ uri: auth.info.image }}
            style={{ width: 50, height: 50, borderRadius: 10 }}
          />
          :
          <Image
            source={require('../../assets/icon.png')}
            style={{ width: 50, height: 50, borderRadius: 10 }}
          />
        }
        <VStack justifyContent="center" flex="1" pl="2" pr={2}>
          <HStack justifyContent="space-between">
            <Text style={globleStyles.drawerUsername}>{auth.info.firstname}</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => { props.navigation.navigate("Profile") }}>
              <Text style={globleStyles.drawerChangeLink}>change</Text>
            </TouchableOpacity>
          </HStack>
          <Text style={globleStyles.drawerUserEmail}>{auth.info.email}</Text>
        </VStack>
      </HStack>
      <View style={globleStyles.drawerAvatarCont}>
        {/* <AvatarItem email={userData.email} onPress={() => onItemPress(1)} index={0} userName={fullName} /> */}
      </View>
      <View style={globleStyles.drawerItemCont}>
        <ScrollView bounces={false} >
          <DrawerItem onPress={() => onItemPress(1)} index={1} label={"Home"} iconname={"home-outline"} />
          <DrawerItem onPress={() => onItemPress(2)} index={2} label={"User Management"} iconname={"person-outline"} />
          <DrawerItem onPress={() => onItemPress(3)} index={3} label={"Received Quote"} iconname={"download-outline"} />
          <DrawerItem onPress={() => onItemPress(4)} index={4} label={"Send Quote"} iconname={"send-outline"} />
          <DrawerItem onPress={() => onItemPress(5)} index={5} label={"Complete Orders"} iconname={"checkmark-done-circle-outline"} />
          {/* <DrawerItem onPress={() => onItemPress(6)} index={6} label={"Chat"} iconname={"chatbox-ellipses-outline"} /> */}
          <DrawerItem onPress={() => onItemPress(7)} index={7} label={"Reports"} iconname={"receipt-outline"} />
          <DrawerItem onPress={() => onItemPress(8)} index={8} label={"Profiles"} iconname={"person-circle-outline"} />
          {/* {showSubscriptionBtn()} */}
          {/* {showRestoreButton()} */}
          {/* <DrawerItem onPress={() => onItemPress(9)} index={9} label={"Notifications"} iconname={"notifications-outline"} switch /> */}
          <DrawerItem onPress={() => onItemPress(9)} index={9} label={"Notification Broadcast"} iconname={"radio-outline"} />
          <DrawerItem onPress={() => onItemPress(10)} index={10} label={"Logout"} iconname={"log-out-outline"} />
        </ScrollView>
      </View>
      {showLoader()}
    </View>
  );
}
