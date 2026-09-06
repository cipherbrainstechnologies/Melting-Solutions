# Component Patterns & UI Architecture

## Component Architecture Patterns

### 1. Screen Component Pattern
```javascript
// Standard screen component structure
function ScreenName(props) {
  const { api } = useContext(FirebaseContext);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const screenData = useSelector(state => state.screendata);

  useEffect(() => {
    // Data fetching
    dispatch(api.fetchData());
  }, [dispatch, api.fetchData]);

  useEffect(() => {
    // Error handling
    if (screenData.error && screenData.error.msg) {
      showToastError(screenData.error.msg);
    }
  }, [screenData.error]);

  const showLoader = () => {
    if (screenData.loading) {
      return <Spinner />;
    }
  };

  return (
    <View style={globleStyles.mainView}>
      <StatusBar backgroundColor={colors.WHITE} barStyle={'dark-content'} />
      <Header title={'Screen Title'} />
      
      {/* Screen content */}
      
      {showLoader()}
    </View>
  );
}

const mapStateToProps = (state) => ({
  // Map state to props
});

export default connect(mapStateToProps, actions)(ScreenName);
```

**Key Characteristics:**
- Functional component with hooks
- Redux integration via connect HOC
- Firebase context for API calls
- Consistent error handling
- Loading state management
- Standard styling approach

### 2. Reusable Component Pattern
```javascript
// Custom input component
export function InputCard({
  onChangeText,
  value,
  placeholder,
  keyboardType = "default",
  secureEntry = false,
  maxLength,
  children,
  cardInputStyle,
  textInputStyle,
  rightIcon
}) {
  return (
    <View style={[globleStyles.inputCard, cardInputStyle]}>
      <View style={globleStyles.inputIconView}>
        {children}
      </View>
      <TextInput
        style={[globleStyles.inputText, textInputStyle]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureEntry}
        maxLength={maxLength}
      />
      {rightIcon && (
        <View style={globleStyles.inputRightIconView}>
          {rightIcon}
        </View>
      )}
    </View>
  );
}
```

**Key Characteristics:**
- Props-based configuration
- Default parameter values
- Flexible styling options
- Icon support
- Reusable across screens

### 3. Button Component Pattern
```javascript
// Material design button
export default function MaterialButtonDark({ onPress, children, style }) {
  return (
    <TouchableOpacity
      style={[globleStyles.materialButtonDark, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={globleStyles.materialButtonDarkText}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
```

**Key Characteristics:**
- Consistent styling
- Touch feedback
- Flexible content
- Reusable across app

## Navigation Patterns

### 1. Stack Navigation Pattern
```javascript
// Screen definition with navigation options
export const UserNavigator = createStackNavigator({
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
  }
}, {
  initialRouteName: 'Menu',
  mode: 'slide',
  navigationOptions: {
    gesturesEnabled: false
  }
});
```

### 2. Tab Navigation Pattern
```javascript
// Bottom tab navigation with icons
export const TabNavigator = createBottomTabNavigator({
  Home: { name: 'Home', screen: Home },
  Search: { name: 'Search', screen: SearchProduct },
  Order: { name: 'Order', screen: Orders },
  Profile: { name: 'Profile', screen: Profile }
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Home') {
        iconName = `ios-home`;
      } else if (routeName === 'Search') {
        iconName = `ios-search`;
      }
      // ... other routes
      return <IconComponent name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: colors.PRIMARY_DARK,
    inactiveTintColor: colors.BLACK,
    showLabel: true,
    style: {
      backgroundColor: colors.WHITE,
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
    }
  },
});
```

### 3. Drawer Navigation Pattern
```javascript
// Admin drawer navigation
export const AdminNavigator = createDrawerNavigator({
  Dashboard: {
    screen: AdminNavigation,
    navigationOptions: {
      header: null,
    }
  },
}, {
  initialRouteName: 'Dashboard',
  drawerPosition: 'left',
  drawerWidth: width,
  contentComponent: (props) => <Drawer {...props} />
});
```

## Styling Patterns

### 1. Global Styles Pattern
```javascript
// Centralized styling
export default StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  mainViewWithColor: {
    flex: 1,
    backgroundColor: colors.PRIMARY_LIGHT,
  },
  subMainView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  headerView: {
    height: 60,
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // ... more styles
});
```

### 2. Theme System Pattern
```javascript
// Color and typography system
export const colors = {
  PRIMARY_LIGHT: '#E8EDFF',
  PRIMARY_DARK: '#2A53D8',
  WHITE: '#fff',
  BLACK: '#000',
  DARK_BLUE: '#2d3182',
  // ... more colors
};

export const fontStyles = {
  fontBold: { fontFamily: 'Sofia-Pro-Bold' },
  fontSemiBold: { fontFamily: 'Sofia-Pro-SemiBold' },
  fontRegular: { fontFamily: 'Sofia-Pro-Regular' },
  fontMedium: { fontFamily: 'Sofia-Pro-Medium' },
  fontLight: { fontFamily: 'Sofia-Pro-Light' },
};
```

### 3. Component-Specific Styles Pattern
```javascript
// Local component styles
const styles = StyleSheet.create({
  mainCard: {
    width: Dimensions.get('window').width / 2.25,
    height: Dimensions.get('window').width / 2.25,
    flexDirection: 'column',
    marginHorizontal: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  box_icon: {
    width: 120,
    height: 120,
    alignSelf: 'center'
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    ...globleStyles.fontMedium,
    marginTop: 5,
  },
});
```

## Data Display Patterns

### 1. List Display Pattern
```javascript
// FlatList with custom render item
const renderData = ({ item, index }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.5} 
      style={styles.mainCard} 
      onPress={() => props.navigation.navigate("ProductDetail", { item })}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.box_icon} />
      ) : (
        <Image source={require('../../assets/icon.png')} style={styles.box_icon} />
      )}
      <Text style={styles.text}>{item.title}</Text>
    </TouchableOpacity>
  );
};

<FlatList
  keyExtractor={(item, index) => index.toString()}
  showsVerticalScrollIndicator={false}
  data={props.products}
  renderItem={renderData}
  numColumns={2}
  contentContainerStyle={{ backgroundColor: colors.fullTransparent }}
/>
```

### 2. Card Display Pattern
```javascript
// Card-based layout with actions
<HStack borderColor={colors.PRIMARY_DARK} borderWidth={1} borderRadius={5} p="1" marginY="1">
  <Image source={{ uri: item.image }} style={{ width: 85, borderRadius: 5 }} />
  <VStack justifyContent="space-between" space={1} paddingX="1.5" flex={1}>
    <Stack>
      <Text style={globleStyles.cardTextLabel}>Name</Text>
      <Text style={globleStyles.cardTextValue}>{item.title}</Text>
    </Stack>
    <VStack justifyContent="space-between" flex={1}>
      <Stack flex={1}>
        <Text style={globleStyles.cardTextLabel}>Description</Text>
        <Text style={globleStyles.cardTextValue} numberOfLines={3}>
          {item.description}
        </Text>
      </Stack>
      <Switch 
        value={item.status == "active"} 
        onValueChange={value => dispatch(api.onProductStatusChange(item.id, value))} 
      />
    </VStack>
  </VStack>
  <VStack justifyContent="space-between">
    <TouchableOpacity onPress={() => dispatch(api.setEditProductDataToState(item))}>
      <Ionicons name={'create-outline'} size={20} color={colors.PRIMARY_DARK} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
      <Ionicons name={'trash-outline'} size={20} color={colors.PRIMARY_DARK} />
    </TouchableOpacity>
  </VStack>
</HStack>
```

## Form Patterns

### 1. Input Form Pattern
```javascript
// Form with validation
<VStack space={3} mt="10">
  <FormControl isRequired isInvalid>
    <InputCard
      onChangeText={props.loginPhonenumberChange}
      value={props.phonenumber}
      returnKey={"next"}
      keyboardType={"phone-pad"}
      placeholder={"Enter Mobile Number"}
      maxLength={10}
    >
      <Entypo name="mobile" color="black" size={20} />
    </InputCard>
    {error && (
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {error}
      </FormControl.ErrorMessage>
    )}
  </FormControl>
  <MaterialButtonDark onPress={() => _attemptLogin()}>
    Send Verification Code
  </MaterialButtonDark>
</VStack>
```

### 2. Validation Pattern
```javascript
// Input validation
const _attemptLogin = () => {
  const { phonenumber } = props;
  if (phonenumber == "" || !validatePhonenumber(phonenumber)) {
    setError('Please enter valid phone number');
  } else {
    setError(null);
    dispatch(requestPhoneOtpDevice(`+91${phonenumber}`));
  }
};
```

## Modal and Alert Patterns

### 1. Alert Dialog Pattern
```javascript
// Confirmation dialog
const deleteAlertView = () => {
  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>Delete Product</AlertDialog.Header>
        <AlertDialog.Body>
          This will remove all data relating to {`${deleteModelData.title}.`} 
          This action cannot be reversed.
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button variant="unstyled" colorScheme="coolGray" onPress={onClose}>
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
};
```

## Loading and Error Patterns

### 1. Loading State Pattern
```javascript
// Conditional loading display
const showLoader = () => {
  if (props.loading === true) {
    return <Spinner />;
  }
};

// In render
{showLoader()}
```

### 2. Error Display Pattern
```javascript
// Error handling with toast
useEffect(() => {
  if (props.error && props.error.msg) {
    showToastError(props.error.msg);
  }
}, [props.error]);
```

## Best Practices

1. **Component Composition**: Use smaller, focused components
2. **Props Validation**: Use PropTypes or TypeScript for validation
3. **Consistent Styling**: Use global styles and theme system
4. **Error Boundaries**: Implement error boundaries for crash prevention
5. **Performance**: Use React.memo for expensive components
6. **Accessibility**: Add accessibility props and labels
7. **Testing**: Write unit tests for components
8. **Documentation**: Document component props and usage