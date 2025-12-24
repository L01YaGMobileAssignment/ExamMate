import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DocumentsScreen from "../screens/DocumentsScreen";
import DocumentDetailScreen from "../screens/DocumentDetailScreen";
import DocumentUploadScreen from "../screens/UploadDocumentScreen";
import { DocumentType } from "../types/document";

export type DocumentsStackParamList = {
  Documents: undefined;
  DocumentDetail: { document: DocumentType };
  DocumentUploadScreen: undefined;
};

const Stack = createNativeStackNavigator<DocumentsStackParamList>();

export default function DocumentsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DocumentDetail"
        component={DocumentDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DocumentUploadScreen"
        component={DocumentUploadScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
