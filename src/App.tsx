import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/providers/queryClient";
import AppNavigator from "./navigation/AppNavigator";
import { useSettingStore } from "./store/settingStore";

export default function App() {
  React.useEffect(() => {
    useSettingStore.getState().loadSettings();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  );
}
