import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../src/screens/RegisterScreen';
import { SignUpService } from '../src/services/authService';
import { Alert } from 'react-native';

// Mock services
jest.mock('../src/services/authService', () => ({
    SignUpService: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

describe('RegisterScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getAllByText, getByPlaceholderText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

        expect(getAllByText('Sign up').length).toBeGreaterThan(0);
        expect(getByPlaceholderText('Enter your username')).toBeTruthy();
        expect(getByPlaceholderText('name@email.com')).toBeTruthy();
        expect(getByPlaceholderText('Create a password')).toBeTruthy();
        expect(getByPlaceholderText('Confirm password')).toBeTruthy();
    });

    it('shows error if fields are missing or button is disabled', () => {
        const { getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);
        const buttons = getAllByText('Sign up');
        const submitButton = buttons[buttons.length - 1];

        // Button should be disabled initially
        fireEvent.press(submitButton);
        expect(SignUpService).not.toHaveBeenCalled();
    });

    it('handles registration success', async () => {
        (SignUpService as jest.Mock).mockResolvedValue({ status: 201 });

        const { getByText, getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

        fireEvent.changeText(getByPlaceholderText('Enter your username'), 'newuser');
        fireEvent.changeText(getByPlaceholderText('name@email.com'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
        fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');

        // Toggle checkbox
        const checkbox = getByText("Terms and Conditions");
        fireEvent.press(checkbox);

        // Press Sign up button
        const buttons = getAllByText('Sign up');
        fireEvent.press(buttons[buttons.length - 1]);

        await waitFor(() => {
            expect(SignUpService).toHaveBeenCalledWith({
                username: 'newuser',
                email: 'test@example.com',
                password: 'password123',
            });
            expect(Alert.alert).toHaveBeenCalledWith("Success", expect.any(String), expect.any(Array));
        });
    });
});

function getAllByText(getByText: any, arg1: string) {
    // Helper to avoid TS issues if needed, but standard library provides it. 
    // Actually standard library 'getAllByText' is returned from render.
    // The previous expect(getAllByText...) usage inside 'renders correctly' block might be typo in my thought process.
    // Let's fix that line in the replacement content.
    return getByText(arg1);
}

