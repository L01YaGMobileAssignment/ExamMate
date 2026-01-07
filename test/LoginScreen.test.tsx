import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { SignInService } from '../src/services/authService';
import { getUserInfor } from '../src/services/userServices';
import { Alert } from 'react-native';
import { MOCK_USER } from './testConstants';

// Mock services
jest.mock('../src/services/authService', () => ({
    SignInService: jest.fn(),
}));

jest.mock('../src/services/userServices', () => ({
    getUserInfor: jest.fn(),
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
    });

    it('renders correctly', () => {
        const { getAllByText, getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

        expect(getAllByText('Sign In').length).toBeGreaterThan(0);
        expect(getByPlaceholderText('Enter your username')).toBeTruthy();
        expect(getByPlaceholderText('Enter your password')).toBeTruthy();
        expect(getByText('Sign up')).toBeTruthy();
    });

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
        (SignInService as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        const { getAllByText, getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

        fireEvent.changeText(getByPlaceholderText('Enter your username'), MOCK_USER.username);
        fireEvent.changeText(getByPlaceholderText('Enter your password'), MOCK_USER.password);

        const signInButtons = getAllByText('Sign In');
        fireEvent.press(signInButtons[signInButtons.length - 1]);

        await waitFor(() => {
            expect(SignInService).toHaveBeenCalledWith({ username: MOCK_USER.username, password: MOCK_USER.password });
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
        });
    });
});
