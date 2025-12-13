import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import LandingScreen from '../screens/LandingScreen';
import BottomAppNavigator from './BottomAppNavigator';
import DocumentsDetailScreen from '../screens/DocumentDetailScreen';
export type RootStackParamList = {
  Login: undefined;
  OnBoarding: undefined;
  Landing: undefined;
  Main: undefined;
  DocumentDetail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="OnBoarding"
          component={OnBoardingScreen}
          options={{ title: 'OnBoarding',headerShown: false }}
        />
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ title: 'Landing',headerShown: false, }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login',headerShown: false }}
        />
        <Stack.Screen 
          name="Main"
          component={BottomAppNavigator} 
          options={{ title: 'LanBottomTabsding',headerShown: false, }}
          />
        <Stack.Screen 
          name="DocumentDetail"
          component={DocumentsDetailScreen} 
          options={{ title: 'DocumentDetail',headerShown: false, }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}