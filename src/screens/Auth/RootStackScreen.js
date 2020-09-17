import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SelectScreen from './SelectScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ResumeSignUpScreen from './ResumeSignUp';
import ForgotPasswordScreen from './ForgotPassword/ForgotPasswordScreen';
import ResendEmailScreen from './ForgotPassword/ResendEmail';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SelectScreen" component={SelectScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <RootStack.Screen name="ResumeSignUpScreen" component={ResumeSignUpScreen}/>
        <RootStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
        <RootStack.Screen name="ResendEmailScreen" component={ResendEmailScreen}/>
    </RootStack.Navigator>
);

export default RootStackScreen;