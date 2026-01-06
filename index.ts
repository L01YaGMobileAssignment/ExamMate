import * as Sentry from "@sentry/react-native";
import { registerRootComponent } from "expo";

import App from "./src/App";

// Initialize Sentry at the earliest point in your app
Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

    // Performance Monitoring - 20% sample rate for production
    tracesSampleRate: 0.2,
    profilesSampleRate: 0.2,

    // Enable automatic session tracking
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,

    // Only enable in production
    enabled: !__DEV__,

    // Native performance tracking
    enableNativeFramesTracking: true,
    enableStallTracking: true,
    enableAppStartTracking: true,
    enableUserInteractionTracing: true,

    // Environment
    environment: __DEV__ ? "development" : "production",

    // Debug mode disabled in production
    debug: false,
});

registerRootComponent(Sentry.wrap(App));
