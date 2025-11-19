import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Documents: undefined;
  Schedule: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function BottomAppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ) 
          }}
        />
        <Tab.Screen 
          name="Documents" 
          component={DocumentsScreen} 
          options={{ 
            title: 'Documents',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen 
          name="Schedule" 
          component={ScheduleScreen} 
          options={{ 
            title: 'Schedule',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" color={color} size={size} />
            )
          }}
        />
        
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}