import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from 'react-native-vector-icons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Platform } from 'react-native';
import Home from '../screens/Home';
import Register from '../screens/Register';
import Login from '../screens/Login';
import { colors, shadows } from '../common/theme';
import globleStyles from '../common/globleStyles';
import Profile from '../screens/Profile';
import ProductDetail from '../screens/ProductDetail';
import Orders from '../screens/Orders';
import OrderDetails from '../screens/OrderDetails';
import ChatBoard from '../screens/ChatBoard';
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
import AnimatedTabIcon from '../components/AnimatedTabIcon';

const tabBarStyle = {
    backgroundColor: colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    position: 'absolute',
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    ...shadows.tabBar,
};

const tabBarLabelStyle = {
    ...globleStyles.fontSemiBold,
    fontSize: 11,
    marginBottom: 2,
};

function getUserTabIcon(routeName, focused, tintColor) {
    const icons = {
        Home: focused ? 'ios-home' : 'ios-home-outline',
        Search: focused ? 'ios-search' : 'ios-search-outline',
        Order: focused ? 'ios-cart' : 'ios-cart-outline',
        Profile: focused ? 'ios-person-circle' : 'ios-person-circle-outline',
    };
    return <AnimatedTabIcon name={icons[routeName]} focused={focused} color={tintColor} />;
}

function getAdminTabIcon(routeName, focused, tintColor) {
    const icons = {
        Home: focused ? 'ios-home' : 'ios-home-outline',
        Users: focused ? 'ios-people' : 'ios-people-outline',
        Products: focused ? 'ios-cube' : 'ios-cube-outline',
        Order: focused ? 'ios-cart' : 'ios-cart-outline',
        Profile: focused ? 'ios-person-circle' : 'ios-person-circle-outline',
    };
    return <AnimatedTabIcon name={icons[routeName]} focused={focused} color={tintColor} />;
}

export const AuthStack = createStackNavigator({
    Login: { screen: Login, navigationOptions: { gestureEnabled: false } },
    Register: { screen: Register, navigationOptions: { gestureEnabled: false } },
    ForgotPassword: { screen: ForgotPassword, navigationOptions: { gestureEnabled: false } },
}, {
    initialRouteName: 'Login',
    headerMode: 'none',
    header: null,
    cardStyle: { shadowColor: 'transparent' },
});

export const TabNavigator = createBottomTabNavigator({
    Home: { name: 'Home', screen: Home },
    Search: { name: 'Search', screen: SearchProduct },
    Order: { name: 'Order', screen: Orders },
    Profile: { name: 'Profile', screen: Profile },
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => getUserTabIcon(navigation.state.routeName, focused, tintColor),
    }),
    initialRouteName: 'Home',
    tabBarOnPress: onTabPress,
    tabBarOptions: {
        activeTintColor: colors.PRIMARY_DARK,
        inactiveTintColor: colors.TEXT_SECONDARY,
        showLabel: true,
        labelStyle: tabBarLabelStyle,
        style: tabBarStyle,
    },
});

const TabNavigatorAdmin = createBottomTabNavigator({
    Home: { name: 'Home', screen: HomeAdmin },
    Users: { name: 'Users', screen: Users },
    Products: { name: 'Products', screen: Products },
    Order: { name: 'Order', screen: Orders },
    Profile: { name: 'Profile', screen: Profile },
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => getAdminTabIcon(navigation.state.routeName, focused, tintColor),
    }),
    initialRouteName: 'Home',
    tabBarOnPress: onTabPress,
    tabBarOptions: {
        activeTintColor: colors.PRIMARY_DARK,
        inactiveTintColor: colors.TEXT_SECONDARY,
        showLabel: true,
        labelStyle: tabBarLabelStyle,
        style: tabBarStyle,
    },
});

export const UserNavigator = createStackNavigator(
    {
        Menu: { screen: TabNavigator, navigationOptions: { gesturesEnabled: false, header: null } },
        ProductDetail: { screen: ProductDetail, navigationOptions: { gesturesEnabled: false, header: null } },
        OrderDetails: { screen: OrderDetails, navigationOptions: { gesturesEnabled: false, header: null } },
        ChatBoard: { screen: ChatBoard, navigationOptions: { gesturesEnabled: false, header: null } },
        AddUser: { screen: AddUser, navigationOptions: { gesturesEnabled: false, header: null } },
        AddProduct: { screen: AddProduct, navigationOptions: { gesturesEnabled: false, header: null } },
        OrderManagement: { screen: OrderManagement, navigationOptions: { gesturesEnabled: false, header: null } },
        Cart: { screen: Cart, navigationOptions: { gesturesEnabled: false, header: null } },
        ChooseDeliveryLocation: { screen: ChooseDeliveryLocation, navigationOptions: { gesturesEnabled: false, header: null } },
    },
    { initialRouteName: 'Menu', mode: 'slide', navigationOptions: { gesturesEnabled: false } }
);

const AdminNavigation = createStackNavigator(
    {
        Menu: { screen: TabNavigatorAdmin, navigationOptions: { gesturesEnabled: false, header: null } },
        ProductDetail: { screen: ProductDetail, navigationOptions: { gesturesEnabled: false, header: null } },
        OrderDetails: { screen: OrderDetails, navigationOptions: { gesturesEnabled: false, header: null } },
        ChatBoard: { screen: ChatBoard, navigationOptions: { gesturesEnabled: false, header: null } },
        AddUser: { screen: AddUser, navigationOptions: { gesturesEnabled: false, header: null } },
        ViewUser: { screen: ViewUser, navigationOptions: { gesturesEnabled: false, header: null } },
        AddProduct: { screen: AddProduct, navigationOptions: { gesturesEnabled: false, header: null } },
        ViewProduct: { screen: ViewProduct, navigationOptions: { gesturesEnabled: false, header: null } },
        OrderManagement: { screen: OrderManagement, navigationOptions: { gesturesEnabled: false, header: null } },
        NotificationBroadcast: { screen: NotificationBroadcast, navigationOptions: { gesturesEnabled: false, header: null } },
        Reports: { screen: Reports, navigationOptions: { gesturesEnabled: false, header: null } },
    },
    { initialRouteName: 'Menu', mode: 'slide', navigationOptions: { gesturesEnabled: false } }
);

export const AdminNavigator = createStackNavigator({
    Dashboard: { screen: AdminNavigation, navigationOptions: { header: null } },
}, {
    initialRouteName: 'Dashboard',
    cardStyle: { shadowColor: 'transparent' },
});

export const ProfileNavigator = createStackNavigator({
    Profile: { screen: Profile, navigationOptions: { headerShown: false } },
});

const onTabPress = () => {};
