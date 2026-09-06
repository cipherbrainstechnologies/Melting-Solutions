import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { AdminNavigator, AuthStack, ProfileNavigator, UserNavigator } from './MainNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const AppNavigator = createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    AuthRoot: AuthStack,
    AdminRoot: AdminNavigator,
    UserRoot: UserNavigator,
    ProfileRoot: ProfileNavigator,
},
    {
        initialRouteName: 'AuthLoading'
    }
);
const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
