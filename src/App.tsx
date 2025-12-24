import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/providers/queryClient";
import AppNavigator from "./navigation/AppNavigator";
import BottomAppNavigator from "./navigation/BottomAppNavigator";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  );
}
