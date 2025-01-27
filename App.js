/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

import { DrawerContent } from './src/screens/SideBar/DrawerContent';
import Pusher from 'pusher-js/react-native';
import MainTabScreen from './src/screens/Home/MainTabScreen';
import SupportScreen from './src/screens/Stacks/SupportScreen';
import SettingsScreen from './src/screens/Stacks/SettingsScreen';
import BookmarkScreen from './src/screens/Stacks/BookmarkScreen';
import EditProfile from './src/screens/Stacks/EditProfile/EditProfile';
import RestorePassword from './src/screens/Stacks/ChangePassword/ChangePassword';
import ResumePassword from './src/screens/Stacks/ChangePassword/ResumeChPass';
import PaymentScreen from './src/screens/Stacks/PaymentTdc/Payment';
import CancelSuscriptionScreen from './src/screens/Stacks/CancelSuscription/Cancel';
import EndCancelSuscriptionScreen from './src/screens/Stacks/CancelSuscription/EndCancel';

import { AuthContext } from './src/components/context';

import RootStackScreen from './src/screens/Auth/RootStackScreen';

import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";

const Drawer = createDrawerNavigator();

const App = () => {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null); 

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          // userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          // userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          // userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(foundUser, data_user) => {
      const userToken = String(foundUser);
      const dataUser = JSON.stringify(data_user)
      try {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('dataUser', dataUser);
      } catch(e) {
        console.log(e);
      }
      verifyIsUser(dataUser);
      // console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', token: userToken });
    },
    signOut: async() => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('dataUser');
      } catch(e) {
        console.log(e);
      }
      setUserActual(null);
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
    }
  }), []);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: "local-channel",
      channelName: "Local Channel"
    })
  }
  const verifyIsUser = async (data) => {
    var parsed = JSON.parse(data)
    setUserActual(parsed.id)
    console.log("id-user",parsed.id);
  }

  const [userActual, setUserActual] = React.useState(null);
  
   // Enable pusher logging - don't include this in production
   Pusher.logToConsole = false;

   var pusher = new Pusher('05ce2293f9a422ed81a7', {
     cluster: 'mt1'
   });

   var channel1 = pusher.subscribe('canal-pronosticodds');

   channel1.bind('general', function (data)  {
     channel1.unbind_all();
    const {title, message} = data
    if (data != null) {
       PushNotification.localNotification({
        /* Android Only Properties */
        channelId: "local-channel", 
        title: title, // (optional)
        message: message, // (required)
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        });
    }
   });
   channel1.bind(`notification-custom-${userActual}`, function (data)  {
    channel1.unbind_all();
    const {title, message} = data
    if (data != null) {
       PushNotification.localNotification({
        /* Android Only Properties */
        channelId: "local-channel", 
        title: title, // (optional)
        message: message, // (required)
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        });
    }
   }); 
  
   

  useEffect(() => {
    createChannels();
    setTimeout(async() => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
    <AuthContext.Provider value={authContext}>
    <NavigationContainer theme={theme}>
      { loginState.userToken !== null ? (
        <Drawer.Navigator drawerPosition="right" drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
          <Drawer.Screen name="SupportScreen" component={SupportScreen} />
          <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
          <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
          <Drawer.Screen name="EditProfileScreen" component={EditProfile} />
          <Drawer.Screen name="RestorePasswordScreen" component={RestorePassword} />
          <Drawer.Screen name="ResumePasswordScreen" component={ResumePassword} />
          <Drawer.Screen name="PaymentScreen" component={PaymentScreen} />
          <Drawer.Screen name="CancelScreen" component={CancelSuscriptionScreen} />
          <Drawer.Screen name="EndCancelScreen" component={EndCancelSuscriptionScreen} />
        </Drawer.Navigator>
      )
    :
      <RootStackScreen/>
    }
    </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;
