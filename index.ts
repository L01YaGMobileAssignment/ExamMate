import * as Sentry from "@sentry/react-native";
import { registerRootComponent } from "expo";

import App from "./src/App";

// Initialize Sentry at the earliest point in your app
Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

    // Performance Monitoring - lower sample rate in production
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    profilesSampleRate: __DEV__ ? 1.0 : 0.2,

    // Enable automatic session tracking
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,

    // Enable Sentry if DSN is provided
    enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,

    // Native performance tracking
    enableNativeFramesTracking: true,
    enableStallTracking: true,
    enableAppStartTracking: true,
    enableUserInteractionTracing: true,

    // Environment based on __DEV__
    environment: __DEV__ ? "development" : "production",

    // Debug mode for development
    debug: __DEV__,
});

registerRootComponent(Sentry.wrap(App));
