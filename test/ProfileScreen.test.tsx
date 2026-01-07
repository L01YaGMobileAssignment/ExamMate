import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../src/screens/ProfileScreen';
import { useAuthStore } from '../src/store/useAuthStore';
import { clearAuth } from '../src/store/secureStore';
import { Alert } from 'react-native';

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    setOptions: jest.fn(),
};

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => mockNavigation,
    };
});

// Mock SecureStore and Store methods
jest.mock('../src/store/secureStore', () => ({
    clearAuth: jest.fn(),
    getUser: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('ProfileScreen', () => {
    beforeEach(() => {
        useAuthStore.setState({
            user: {
                id: '1',
                username: 'Test User',
                email: 'test@example.com',
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        });
        jest.clearAllMocks();
    });

    it('renders user info correctly', () => {
        const { getByText } = render(<ProfileScreen />);
        expect(getByText('profile_title')).toBeTruthy();
        expect(getByText('Test User')).toBeTruthy();
        expect(getByText('test@example.com')).toBeTruthy();
    });

    it('handles logout flow', async () => {
        const { getByText } = render(<ProfileScreen />);
        const logoutButton = getByText('logout');

        fireEvent.press(logoutButton);

        expect(Alert.alert).toHaveBeenCalled();
        // Simulate confirming logout from Alert
        const alertCalls = (Alert.alert as jest.Mock).mock.calls;
        const buttons = alertCalls[0][2];
        const logoutConfirmButton = buttons.find((btn: any) => btn.style === 'destructive');

        await logoutConfirmButton.onPress();

        expect(clearAuth).toHaveBeenCalled();
        // We verify that the store was cleared or resetAndNavigate was called in real app, 
        // but since resetAndNavigate is imported from navRef, we rely on clearAuth mock for now.
    });
});
