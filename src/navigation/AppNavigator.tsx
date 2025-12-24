import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import LandingScreen from "../screens/LandingScreen";
import BottomAppNavigator from "./BottomAppNavigator";
import DocumentsDetailScreen from "../screens/DocumentDetailScreen";
import { DocumentType } from "../types/document";
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  OnBoarding: undefined;
  Landing: undefined;
  Main: undefined;
  DocumentDetail: { document: DocumentType };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="OnBoarding"
          component={OnBoardingScreen}
          options={{ title: "OnBoarding", headerShown: false }}
        />
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ title: "Landing", headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Register", headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomAppNavigator}
          options={{ title: "LanBottomTabsding", headerShown: false }}
        />
        <Stack.Screen
          name="DocumentDetail"
          component={DocumentsDetailScreen}
          options={{ title: "DocumentDetail", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
