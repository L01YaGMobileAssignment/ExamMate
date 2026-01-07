import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { SignInService } from '../src/services/authService';
import { getUserInfor } from '../src/services/userServices';
import { Alert } from 'react-native';

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
        (getUserInfor as jest.Mock).mockResolvedValue({ data: { username: 'testuser', id: 1 } });

        const { getAllByText, getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

        fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
        fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');

        const signInButtons = getAllByText('Sign In');
        fireEvent.press(signInButtons[signInButtons.length - 1]);

        await waitFor(() => {
            expect(SignInService).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
            expect(getUserInfor).toHaveBeenCalled();
            expect(mockNavigation.navigate).toHaveBeenCalledWith('Main');
        });
    });

    it('handles login error', async () => {
        (SignInService as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        const { getAllByText, getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation as any} route={{} as any} />);

        fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
        fireEvent.changeText(getByPlaceholderText('Enter your password'), '123');

        const signInButtons = getAllByText('Sign In');
        fireEvent.press(signInButtons[signInButtons.length - 1]);

        await waitFor(() => {
            expect(SignInService).toHaveBeenCalledWith({ username: 'testuser', password: '123' });
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
        });
    });
});
