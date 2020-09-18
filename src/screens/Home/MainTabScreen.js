import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import Layer from '../../assets/img/svg/Layer.svg';

import HomeScreen from '../Stacks/HomeScreen';
import DetailsScreen from '../Stacks/DetailsScreen';
import ExploreScreen from '../Stacks/ExploreScreen';
import ProfileScreen from '../Stacks/ProfileScreen';
import BlankScreen from '../Stacks/BlankScreen';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#01CD01"
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: '',
          tabBarColor: '#424242',
          tabBarIcon: ({ color }) => (
            <Icon name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={DetailsStackScreen}
        options={{
          tabBarLabel: '',
          tabBarColor: '#424242',
          tabBarIcon: ({ color }) => (
            <Icon name="compass" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
          tabBarColor: '#424242',
          tabBarIcon: ({ color }) => (
            <Icon name="disc-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: '',
          tabBarColor: '#424242',
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Blank"
        component={BlankScreen}
        options={{
          tabBarLabel: '',
          tabBarColor: '#424242',
          tabBarIcon: ({ color }) => (
            <Icon name="person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
<HomeStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#212121',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'
        }
    }}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
        title:' ',
        headerLeft: () => (
          <Layer width="35" style={{marginLeft: 10}}/>
        )
        }} />
</HomeStack.Navigator>
);

const DetailsStackScreen = ({navigation}) => (
<DetailsStack.Navigator screenOptions={{
        headerStyle: {
        backgroundColor: '#212121',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold'
        }
    }}>
        <DetailsStack.Screen name="Details" component={DetailsScreen} options={{
        title:' ',
        headerLeft: () => (
          <Layer width="35" style={{marginLeft: 10}}/>
        )
        }} />
</DetailsStack.Navigator>
);
  