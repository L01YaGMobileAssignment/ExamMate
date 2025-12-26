import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/providers/queryClient";
import AppNavigator from "./navigation/AppNavigator";
import { useSettingStore } from "./store/settingStore";

import { Alert, AppState, Linking } from "react-native";
import { registerForPushNotificationsAsync } from "./services/notificationService";

export default function App() {
  React.useEffect(() => {
    useSettingStore.getState().loadSettings();

    const checkNotificationPermission = async () => {
      try {
        const granted = await registerForPushNotificationsAsync();
        if (!granted) {
          Alert.alert(
            "Permission Required",
            "This app requires notification permissions to function properly. Please enable them in settings.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          );
        }
      } catch (error) {
        console.error("Failed to check notification permissions:", error);
      }
    };

    checkNotificationPermission();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkNotificationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  );
}
