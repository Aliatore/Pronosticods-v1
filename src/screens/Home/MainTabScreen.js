import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import Layer from '../../assets/img/svg/Layer.svg';

import HomeScreen from '../Stacks/HomeScreen';
import PlansScreen from '../Stacks/PlansScreen';
import ExploreScreen from '../Stacks/ExploreScreen';
import ProfileScreen from '../Stacks/ProfileScreen';
import ForecastsScreen from '../Stacks/ForecastsScreen';

const HomeStack = createStackNavigator();
const PlansStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ForecastStack = createStackNavigator();
const CalendarStack = createStackNavigator();


const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#01CD01"
      labeled="false"
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
        component={PlansStackScreen}
        options={{
          tabBarLabel: '',
          tabBarColor: '#424242',
          tabBarIcon: ({ color }) => (
            <Icon name="compass" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Blank"
        component={ForecastStackScreen}
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
        component={CalendarStackScreen}
        options={{
          tabBarLabel: '',
          tabBarColor: '#424242',
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
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

const PlansStackScreen = ({navigation}) => (
  <PlansStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#212121',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <PlansStack.Screen name="Details" component={PlansScreen} options={{
      title:' ',
      headerLeft: () => (
        <Layer width="35" style={{marginLeft: 10}}/>
      ),
      headerRight: () => (
        <Icon.Button 
          name="ios-menu" 
          size={25} 
          color="#01CD01"
          backgroundColor="#212121" 
          onPress={() => navigation.openDrawer()} 

        />
      ),
    }} />
</PlansStack.Navigator>
);
  
const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#212121',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <ProfileStack.Screen name="Details" component={ProfileScreen} options={{
      title:' ',
      headerLeft: () => (
        <Layer width="35" style={{marginLeft: 10}}/>
      ),
      headerRight: () => (
        <Icon.Button 
          name="ios-menu" 
          size={25} 
          color="#01CD01"
          backgroundColor="#212121" 
          onPress={() => navigation.openDrawer()} 

        />
      ),
    }} />
  </ProfileStack.Navigator>
);

const ForecastStackScreen = ({navigation}) => (
  <ForecastStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#212121',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <ForecastStack.Screen name="Details" component={ForecastsScreen} options={{
      title:' ',
      headerLeft: () => (
        <Layer width="35" style={{marginLeft: 10}}/>
      ),
      headerRight: () => (
        <Icon.Button 
          name="ios-menu" 
          size={25} 
          color="#01CD01"
          backgroundColor="#212121" 
          onPress={() => navigation.openDrawer()} 
    
        />
      ),
    }} />
  </ForecastStack.Navigator>
);
const CalendarStackScreen = ({navigation}) => (
  <CalendarStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#212121',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <CalendarStack.Screen name="Details" component={ExploreScreen} options={{
      title:' ',
      headerLeft: () => (
        <Layer width="35" style={{marginLeft: 10}}/>
      ),
      headerRight: () => (
        <Icon.Button 
          name="ios-menu" 
          size={25} 
          color="#01CD01"
          backgroundColor="#212121" 
          onPress={() => navigation.openDrawer()} 
    
        />
      ),
    }} />
  </CalendarStack.Navigator>
);
  