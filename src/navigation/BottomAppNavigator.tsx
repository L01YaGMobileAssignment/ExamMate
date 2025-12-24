import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeNavigator";
import ScheduleScreen from "../screens/ScheduleScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DocumentsStackNavigator from "./DocumentStackNavigator";

const Tab = createBottomTabNavigator();

export default function BottomAppNavigator() {
  return (
    <Tab.Navigator initialRouteName="HomeTab">
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="DocumentsTab"
        component={DocumentsStackNavigator}
        options={{
          headerShown: false,
          title: "Documents",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
