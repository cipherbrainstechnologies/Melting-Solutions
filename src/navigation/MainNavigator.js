import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from 'react-native-vector-icons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Home from '../screens/Home';
import Register from '../screens/Register';
import Login from '../screens/Login';
import { colors } from '../common/theme';
import globleStyles, { width } from '../common/globleStyles';
import Profile from '../screens/Profile';
import ProductDetail from '../screens/ProductDetail';
import Orders from '../screens/Orders';
import OrderDetails from '../screens/OrderDetails';
import ChatBoard from '../screens/ChatBoard';
import Drawer from '../components/Drawer';
import HomeAdmin from '../screens/HomeAdmin';
import Users from '../screens/Users';
import Products from '../screens/Products';
import AddUser from '../screens/AddUser';
import AddProduct from '../screens/AddProduct';
import OrderManagement from '../screens/OrderManagement';
import ViewUser from '../screens/ViewUser';
import ViewProduct from '../screens/ViewProduct';
import Cart from '../screens/Cart';
import ChooseDeliveryLocation from '../screens/ChooseDeliveryLocation';
import SearchProduct from '../screens/SearchProduct';
import NotificationBroadcast from '../screens/NotificationBroadcast';
import Reports from '../screens/Reports';
import ForgotPassword from '../screens/ForgotPassword';

// export const AppStack = {
//     ProductDetail: { screen: ProductDetail },
//     OrderDetails: { screen: OrderDetails },
//     ChatBoard: { screen: ChatBoard },
//     AddUser: { screen: AddUser },
//     AddProduct: { screen: AddProduct },
//     OrderManagement: { screen: OrderManagement },
// }

export const AuthStack = createStackNavigator({

    Login: {
        screen: Login,
        navigationOptions: {
            gestureEnabled: false,
        },
    },
    Register: {
        screen: Register,
        navigationOptions: {
            gestureEnabled: false,
        },
    },
    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: {
            gestureEnabled: false,
        },
    },
}, {
    initialRouteName: 'Login',
    headerMode: 'none',
    header: null,
    cardStyle: { shadowColor: 'transparent' },
});

//tab natigation routes, you can add routes here for bottom tab natigation
export const TabNavigator = createBottomTabNavigator({
    Home: { name: 'Home', screen: Home },
    Search: { name: 'Search', screen: SearchProduct },
    Order: { name: 'Order', screen: Orders },
    Profile: { name: 'Profile', screen: Profile }
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let IconComponent = Ionicons;
            let iconName;
            if (routeName === 'Home') {
                iconName = `ios-home`;
            } else if (routeName === 'Search') {
                iconName = `ios-search`;
            } else if (routeName === 'Order') {
                iconName = `ios-cart`;
            } else if (routeName === 'Profile') {
                iconName = `ios-person-circle-outline`;
            }
            return <IconComponent name={iconName} size={25} color={tintColor} />;
        },
    }),
    initialRouteName: 'Home',
    tabBarOnPress: onTabPress,
    tabBarOptions: {
        activeTintColor: colors.PRIMARY_DARK,
        inactiveTintColor: colors.BLACK,
        showLabel: true,
        labelStyle: {
            ...globleStyles.fontSemiBold
        },
        style: {
            backgroundColor: colors.WHITE,
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
            position: 'absolute',
            // borderLeftWidth:2,
            // borderRightWidth:2,
            // borderTopWidth: 1,
            borderTopColor: colors.WHITE,
            overflow: "hidden",
        }
    },
}
);

const TabNavigatorAdmin = createBottomTabNavigator({
    Home: { name: 'Home', screen: HomeAdmin },
    Users: { name: 'Users', screen: Users },
    Products: { name: 'Products', screen: Products },
    Order: { name: 'Order', screen: Orders },
    Profile: { name: 'Profile', screen: Profile }
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            let IconComponent = Ionicons;
            let iconName;
            if (routeName === 'Home') {
                iconName = `ios-home-outline`;
            } else if (routeName === 'Users') {
                iconName = `ios-people-outline`;
            } else if (routeName === 'Products') {
                iconName = `ios-cube-outline`;
            } else if (routeName === 'Order') {
                iconName = `ios-cart-outline`;
            } else if (routeName === 'Profile') {
                iconName = `ios-person-circle-outline`;
            }
            return <IconComponent name={iconName} size={25} color={tintColor} />;
        },
    }),
    initialRouteName: 'Home',
    tabBarOnPress: onTabPress,
    tabBarOptions: {
        activeTintColor: colors.PRIMARY_DARK,
        inactiveTintColor: colors.BLACK,
        showLabel: true,
        labelStyle: {
            ...globleStyles.fontSemiBold
        },
        style: {
            backgroundColor: colors.WHITE,
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
            position: 'absolute',
            // borderLeftWidth:2,
            // borderRightWidth:2,
            // borderTopWidth: 1,
            borderTopColor: colors.WHITE,
            overflow: "hidden",
        }
    },
}
);

export const UserNavigator = createStackNavigator(
    {
        Menu: {
            screen: TabNavigator,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        ProductDetail: {
            screen: ProductDetail,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        OrderDetails: {
            screen: OrderDetails,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        ChatBoard: {
            screen: ChatBoard,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        AddUser: {
            screen: AddUser,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        AddProduct: {
            screen: AddProduct,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        OrderManagement: {
            screen: OrderManagement,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        Cart: {
            screen: Cart,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        ChooseDeliveryLocation: {
            screen: ChooseDeliveryLocation,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },

    },
    {
        initialRouteName: 'Menu',
        mode: 'slide',
        navigationOptions: {
            gesturesEnabled: false
        }
    });

const AdminNavigation = createStackNavigator(
    {
        Menu: {
            screen: TabNavigatorAdmin,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        ProductDetail: {
            screen: ProductDetail,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        OrderDetails: {
            screen: OrderDetails,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        ChatBoard: {
            screen: ChatBoard,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        AddUser: {
            screen: AddUser,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        ViewUser: {
            screen: ViewUser,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        AddProduct: {
            screen: AddProduct,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        ViewProduct: {
            screen: ViewProduct,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        OrderManagement: {
            screen: OrderManagement,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        NotificationBroadcast: {
            screen: NotificationBroadcast,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
        Reports: {
            screen: Reports,
            navigationOptions: {
                gesturesEnabled: false,
                header: null,
            }
        },
    },
    {
        initialRouteName: 'Menu',
        mode: 'slide',
        navigationOptions: {
            gesturesEnabled: false
        }
    });

// Using StackNavigator as DrawerNavigator has reanimated issues
export const AdminNavigator = createStackNavigator({
    Dashboard: {
        screen: AdminNavigation,
        navigationOptions: {
            header: null,
        }
    },
}, {
    initialRouteName: 'Dashboard',
    cardStyle: { shadowColor: 'transparent' },
}
);

export const ProfileNavigator = createStackNavigator({

    Profile: {
        screen: Profile,
        navigationOptions: {
            headerShown: false,
        }
    }
});

const onTabPress = (scene, navigation) => {
    console.log(scene);
    //navigation.navigate("Prescription");
}


// export const AdminRootNavigator = createStackNavigator(AppStack, {
//     initialRouteName: "Dashboard",
//     headerMode: 'none',
//     header: null,
//     cardStyle: { shadowColor: 'transparent' },
// });

