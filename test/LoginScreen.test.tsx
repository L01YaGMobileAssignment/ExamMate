import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { SignInService } from '../src/services/authService';
import { getUserInfor } from '../src/services/userServices';
import { getUser } from '../src/store/secureStore';
import { useAuthStore } from '../src/store/useAuthStore';
import { Alert } from 'react-native';
import { MOCK_USER } from './testConstants';

// Mock services
jest.mock('../src/services/authService', () => ({
    SignInService: jest.fn(),
}));

jest.mock('../src/services/userServices', () => ({
    getUserInfor: jest.fn(),
}));

jest.mock('../src/store/secureStore', () => ({
    getUser: jest.fn(),
    saveUser: jest.fn(),
}));

jest.mock('../src/navigation/navigationRef', () => ({
    resetAndNavigate: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

describe('LoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAuthStore.setState({ user: null, isLoading: false });
        (getUser as jest.Mock).mockResolvedValue(null);
    });

    describe('rendering', () => {
        it('renders correctly', () => {
            const { getAllByText, getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            expect(getAllByText('Sign In').length).toBeGreaterThan(0);
            expect(getByPlaceholderText('Enter your username')).toBeTruthy();
            expect(getByPlaceholderText('Enter your password')).toBeTruthy();
            expect(getByText('Sign up')).toBeTruthy();
        });

        it('displays sign in header text', () => {
            const { getAllByText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            expect(getAllByText('Sign In').length).toBeGreaterThan(0);
        });

        it('displays footer with sign up link', () => {
            const { getByText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            expect(getByText("Don't have an account?")).toBeTruthy();
            expect(getByText('Sign up')).toBeTruthy();
        });
    });

    describe('input handling', () => {
        it('updates username input', () => {
            const { getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            const usernameInput = getByPlaceholderText('Enter your username');
            fireEvent.changeText(usernameInput, 'testuser');

            expect(usernameInput.props.value).toBe('testuser');
        });

        it('updates password input', () => {
            const { getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            const passwordInput = getByPlaceholderText('Enter your password');
            fireEvent.changeText(passwordInput, 'testpass');

            expect(passwordInput.props.value).toBe('testpass');
        });
    });

    describe('login flow', () => {
        it('handles login success', async () => {
            (SignInService as jest.Mock).mockResolvedValue({ status: 200 });
            (getUserInfor as jest.Mock).mockResolvedValue({ data: { username: MOCK_USER.username, id: 1 } });

            const { getAllByText, getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.changeText(getByPlaceholderText('Enter your username'), MOCK_USER.username);
            fireEvent.changeText(getByPlaceholderText('Enter your password'), MOCK_USER.password);

            const signInButtons = getAllByText('Sign In');
            fireEvent.press(signInButtons[signInButtons.length - 1]);

            await waitFor(() => {
                expect(SignInService).toHaveBeenCalledWith({ username: MOCK_USER.username, password: MOCK_USER.password });
                expect(getUserInfor).toHaveBeenCalled();
                expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
            });
        });

        it('handles login error', async () => {
            (SignInService as jest.Mock).mockRejectedValue(new Error('loginFail'));

            const { getAllByText, getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.changeText(getByPlaceholderText('Enter your username'), MOCK_USER.username);
            fireEvent.changeText(getByPlaceholderText('Enter your password'), MOCK_USER.password);

            const signInButtons = getAllByText('Sign In');
            fireEvent.press(signInButtons[signInButtons.length - 1]);

            await waitFor(() => {
                expect(SignInService).toHaveBeenCalledWith({ username: MOCK_USER.username, password: MOCK_USER.password });
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'loginFail');
            });
        });
    });

    describe('auto-login', () => {
        it('auto-navigates when user is already logged in', async () => {
            const { resetAndNavigate } = require('../src/navigation/navigationRef');

            (getUser as jest.Mock).mockResolvedValue({ username: 'existinguser', id: 1 });

            render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getUser).toHaveBeenCalled();
                expect(resetAndNavigate).toHaveBeenCalledWith('Main');
            });
        });

        it('does not auto-navigate when no user is stored', async () => {
            (getUser as jest.Mock).mockResolvedValue(null);

            render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getUser).toHaveBeenCalled();
            });

            expect(mockNavigation.navigate).not.toHaveBeenCalled();
        });
    });

    describe('navigation', () => {
        it('navigates to register screen on sign up press', async () => {
            const { getByText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

            const signUpLink = getByText('Sign up');
            fireEvent.press(signUpLink);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
        });
    });
});
