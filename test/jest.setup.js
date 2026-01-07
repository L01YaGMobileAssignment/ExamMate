// Mock generic external modules
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock navigation
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
            dispatch: jest.fn(),
            setOptions: jest.fn(),
        }),
        useRoute: () => ({
            params: {},
        }),
    };
});

// Mock translation
jest.mock('../src/utils/i18n/useTranslation', () => ({
    useTranslation: () => ({
        t: new Proxy({}, {
            get: (target, prop) => prop,
        }),
        setLanguage: jest.fn(),
    }),
}));

// Mock Ionicons and other vector icons to avoid rendering issues
jest.mock('@expo/vector-icons', () => {
    const { View } = require('react-native');
    return {
        Ionicons: View,
        FontAwesome5: View,
        MaterialIcons: View,
        Feather: View,
    };
});

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
    init: jest.fn(),
    wrap: (component) => component,
    captureException: jest.fn(),
    addBreadcrumb: jest.fn(),
    startSpan: jest.fn((_, callback) => callback({ setStatus: jest.fn() })),
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
    StatusBar: () => null,
}));

// Mock expo-document-picker
jest.mock('expo-document-picker', () => ({
    getDocumentAsync: jest.fn(),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
    launchCameraAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    MediaTypeOptions: { Images: 'Images' },
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
    scheduleNotificationAsync: jest.fn(),
    cancelScheduledNotificationAsync: jest.fn(),
    getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
    documentDirectory: 'file:///test-directory/',
    writeAsStringAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
    deleteAsync: jest.fn(),
    getInfoAsync: jest.fn(() => Promise.resolve({ exists: true })),
    makeDirectoryAsync: jest.fn(),
    downloadAsync: jest.fn(() => Promise.resolve({ uri: 'file:///test.pdf' })),
}));

jest.mock('expo-file-system/legacy', () => ({
    documentDirectory: 'file:///test-directory/',
    cacheDirectory: 'file:///test-cache/',
    writeAsStringAsync: jest.fn(),
}));

// Mock expo-sharing
jest.mock('expo-sharing', () => ({
    shareAsync: jest.fn(),
    isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

// Mock expo-asset
jest.mock('expo-asset', () => ({
    Asset: {
        fromModule: jest.fn(() => ({ uri: 'test-uri', localUri: 'test-local-uri' })),
        loadAsync: jest.fn(),
    },
}));

// Mock react-native-webview
jest.mock('react-native-webview', () => {
    const { View } = require('react-native');
    return {
        WebView: View,
    };
});

// Mock API services
jest.mock('../src/services/docApiService', () => ({
    getDocuments: jest.fn(() => Promise.resolve({
        status: 200,
        data: []
    })),
    getDocumentsByTitleKey: jest.fn(() => Promise.resolve({
        status: 200,
        data: []
    })),
    getDocumentById: jest.fn(),
    uploadDocument: jest.fn(),
    deleteDocument: jest.fn(),
}));

jest.mock('../src/services/scheduleService', () => ({
    getAllSchedules: jest.fn(() => Promise.resolve({
        status: 200,
        data: []
    })),
    createSchedule: jest.fn(),
    updateScheduleById: jest.fn(),
    deleteScheduleById: jest.fn(),
    getScheduleById: jest.fn(),
}));

jest.mock('../src/services/quizzesService', () => ({
    getQuizzes: jest.fn(() => Promise.resolve({
        status: 200,
        data: []
    })),
    getQuizById: jest.fn(() => Promise.resolve({
        status: 200,
        data: { quiz_id: '1', questions: [] }
    })),
    generateQuiz: jest.fn(),
    getQuizByTitle: jest.fn(() => Promise.resolve({
        status: 200,
        data: []
    })),
}));

// Mock react-native-calendars
jest.mock('react-native-calendars', () => ({
    Calendar: (props) => {
        const React = require('react');
        const { View, Text, Button } = require('react-native');
        return (
            <View testID="calendar">
                <Text>Calendar</Text>
                {props.onDayPress && (
                    <Button
                        testID="select-day"
                        title="Select Day"
                        onPress={() => props.onDayPress({ dateString: '2026-01-07' })}
                    />
                )}
            </View>
        );
    },
    LocaleConfig: {
        locales: {},
        defaultLocale: 'en',
    },
}));

// Mock Modal explicitly to avoid ReferenceError: React is not defined in RN mock
jest.mock('react-native/Libraries/Modal/Modal', () => {
    const React = require('react');
    const { View } = require('react-native');
    return (props) => {
        return props.visible ? <View testID="mock-modal">{props.children}</View> : null;
    };
});

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
    const React = require('react');
    const { View } = require('react-native');
    const DateTimePicker = (props) => {
        return React.createElement(View, { testID: 'datetimepicker' }, null);
    };
    return DateTimePicker;
});



