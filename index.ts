import * as Sentry from "@sentry/react-native";
import { registerRootComponent } from "expo";

import App from "./src/App";

// Check if we're in production mode (either via env variable or native build)
const isProduction = process.env.EXPO_PUBLIC_ENV === "production" || !__DEV__;

// Initialize Sentry at the earliest point in your app
Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

    // Performance Monitoring - 20% sample rate for production
    tracesSampleRate: isProduction ? 0.2 : 1.0,
    profilesSampleRate: isProduction ? 0.2 : 1.0,

    // Enable automatic session tracking
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,

    // Enable based on environment
    enabled: isProduction,

    // Native performance tracking
    enableNativeFramesTracking: true,
    enableStallTracking: true,
    enableAppStartTracking: true,
    enableUserInteractionTracing: true,

    // Environment from env variable or fallback to __DEV__
    environment: process.env.EXPO_PUBLIC_ENV || (__DEV__ ? "development" : "production"),

    // Debug mode only when not in production
    debug: !isProduction,
});

registerRootComponent(Sentry.wrap(App));
