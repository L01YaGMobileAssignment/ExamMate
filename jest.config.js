module.exports = {
    preset: "react-native",
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@sentry/.*)"
    ],
    rootDir: ".",
    setupFiles: [
        "./test/jest.setup.js"
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    coverageProvider: 'babel',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
        '!src/types/**',
        '!src/App.tsx',
        '!src/components/Latex.tsx',
        '!src/services/api.ts',
        '!src/navigation/AppNavigator.tsx',
        '!src/navigation/BottomAppNavigator.tsx',
        '!src/navigation/DocumentStackNavigator.tsx',
        '!src/navigation/HomeNavigator.tsx',
        '!src/screens/OnBoardingScreen.tsx',
        '!src/screens/ScheduleScreen.tsx',
        '!src/services/authService.ts',
        '!src/services/docApiService.ts',
        '!src/services/notificationService.ts',
        '!src/services/quizzesService.ts',
        '!src/services/scheduleService.ts',
        '!src/utils/i18n/**',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};
