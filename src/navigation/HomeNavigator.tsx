import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Home from "../screens/HomeScreen";
import QuizOverView from "../screens/QuizOverviewScreen";
import DoQuizScreen from "../screens/DoQuizScreen";
import ViewAllQuizzesScreen from "../screens/ViewAllQuizzesScreen";


export type HomeStackParamList = {
  Home: undefined;
  QuizOverview: { quiz: any };
  DoQuiz: { quiz: any };
  ViewAllQuizzes: undefined;
};


const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function DocumentsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuizOverview"
        component={QuizOverView}
        options={{ headerShown: false, title: "Quiz Overview" }}
      />
      <Stack.Screen
        name="DoQuiz"
        component={DoQuizScreen}
        options={{ headerShown: false, title: "Do Quiz" }}
      />
      <Stack.Screen
        name="ViewAllQuizzes"
        component={ViewAllQuizzesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
