import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import RegisterScreen from '../src/screens/RegisterScreen';
import { SignUpService } from '../src/services/authService';
import { Alert } from 'react-native';
import { MOCK_USER } from './testConstants';

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

    describe('rendering', () => {
        it('renders correctly', () => {
            const { getAllByText, getByPlaceholderText, getByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            expect(getAllByText('Sign up').length).toBeGreaterThan(0);
            expect(getByPlaceholderText('Enter your username')).toBeTruthy();
            expect(getByPlaceholderText('name@email.com')).toBeTruthy();
            expect(getByPlaceholderText('Create a password')).toBeTruthy();
            expect(getByPlaceholderText('Confirm password')).toBeTruthy();
            expect(getByText('Create an account to get started')).toBeTruthy();
        });

        it('displays terms and conditions checkbox', () => {
            const { getByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            expect(getByText(/Terms and Conditions/)).toBeTruthy();
            expect(getByText(/Privacy Policy/)).toBeTruthy();
        });

        it('displays footer with sign in link', () => {
            const { getByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            expect(getByText('Already have account?')).toBeTruthy();
            expect(getByText('Sign in')).toBeTruthy();
        });
    });

    describe('input handling', () => {
        it('updates username input', () => {
            const { getByPlaceholderText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            const usernameInput = getByPlaceholderText('Enter your username');
            fireEvent.changeText(usernameInput, 'newuser');

            expect(usernameInput.props.value).toBe('newuser');
        });

        it('updates email input', () => {
            const { getByPlaceholderText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            const emailInput = getByPlaceholderText('name@email.com');
            fireEvent.changeText(emailInput, 'test@example.com');

            expect(emailInput.props.value).toBe('test@example.com');
        });

        it('updates password input', () => {
            const { getByPlaceholderText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            const passwordInput = getByPlaceholderText('Create a password');
            fireEvent.changeText(passwordInput, 'password123');

            expect(passwordInput.props.value).toBe('password123');
        });

        it('updates confirm password input', () => {
            const { getByPlaceholderText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            const confirmPasswordInput = getByPlaceholderText('Confirm password');
            fireEvent.changeText(confirmPasswordInput, 'password123');

            expect(confirmPasswordInput.props.value).toBe('password123');
        });
    });

    describe('form validation', () => {
        it('disables submit button when fields are empty', () => {
            const { getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);
            const buttons = getAllByText('Sign up');
            const submitButton = buttons[buttons.length - 1];

            // Button should be disabled initially
            fireEvent.press(submitButton);
            expect(SignUpService).not.toHaveBeenCalled();
        });
    });

    describe('registration flow', () => {
        it('handles registration success', async () => {
            (SignUpService as jest.Mock).mockResolvedValue({ status: 201 });

            const { getByText, getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.changeText(getByPlaceholderText('Enter your username'), MOCK_USER.newUsername);
            fireEvent.changeText(getByPlaceholderText('name@email.com'), MOCK_USER.email);
            fireEvent.changeText(getByPlaceholderText('Create a password'), MOCK_USER.password);
            fireEvent.changeText(getByPlaceholderText('Confirm password'), MOCK_USER.password);

            // Toggle checkbox
            const checkbox = getByText(/Terms and Conditions/);
            fireEvent.press(checkbox);

            // Press Sign up button
            const buttons = getAllByText('Sign up');
            fireEvent.press(buttons[buttons.length - 1]);

            await waitFor(() => {
                expect(SignUpService).toHaveBeenCalledWith({
                    username: MOCK_USER.newUsername,
                    email: MOCK_USER.email,
                    password: MOCK_USER.password,
                });
                expect(Alert.alert).toHaveBeenCalledWith('Success', expect.any(String), expect.any(Array));
            });
        });

        it('handles registration with status 200', async () => {
            (SignUpService as jest.Mock).mockResolvedValue({ status: 200 });

            const { getByText, getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.changeText(getByPlaceholderText('Enter your username'), 'newuser');
            fireEvent.changeText(getByPlaceholderText('name@email.com'), 'new@test.com');
            fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
            fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');

            const checkbox = getByText(/Terms and Conditions/);
            fireEvent.press(checkbox);

            const buttons = getAllByText('Sign up');
            fireEvent.press(buttons[buttons.length - 1]);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Success', expect.any(String), expect.any(Array));
            });
        });

        it('handles registration failure with non-200/201 status', async () => {
            (SignUpService as jest.Mock).mockResolvedValue({ status: 400 });

            const { getByText, getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.changeText(getByPlaceholderText('Enter your username'), 'newuser');
            fireEvent.changeText(getByPlaceholderText('name@email.com'), 'new@test.com');
            fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
            fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');

            const checkbox = getByText(/Terms and Conditions/);
            fireEvent.press(checkbox);

            const buttons = getAllByText('Sign up');
            fireEvent.press(buttons[buttons.length - 1]);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Registration failed. Please try again.');
            });
        });

        it('handles registration error with response detail', async () => {
            const error: any = new Error('Registration failed');
            error.response = { data: { detail: 'Email already exists' } };
            (SignUpService as jest.Mock).mockRejectedValue(error);

            const { getByText, getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.changeText(getByPlaceholderText('Enter your username'), 'newuser');
            fireEvent.changeText(getByPlaceholderText('name@email.com'), 'existing@test.com');
            fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
            fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');

            const checkbox = getByText(/Terms and Conditions/);
            fireEvent.press(checkbox);

            const buttons = getAllByText('Sign up');
            fireEvent.press(buttons[buttons.length - 1]);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Email already exists');
            });
        });

        it('handles registration error without response detail', async () => {
            (SignUpService as jest.Mock).mockRejectedValue(new Error('Network error'));

            const { getByText, getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.changeText(getByPlaceholderText('Enter your username'), 'newuser');
            fireEvent.changeText(getByPlaceholderText('name@email.com'), 'new@test.com');
            fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
            fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');

            const checkbox = getByText(/Terms and Conditions/);
            fireEvent.press(checkbox);

            const buttons = getAllByText('Sign up');
            fireEvent.press(buttons[buttons.length - 1]);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Registration failed. Please try again.');
            });
        });
    });

    describe('navigation', () => {
        it('navigates to login screen on sign in press', () => {
            const { getByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            const signInLink = getByText('Sign in');
            fireEvent.press(signInLink);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
        });

        it('navigates to login after successful registration', async () => {
            (SignUpService as jest.Mock).mockResolvedValue({ status: 201 });

            const { getByText, getByPlaceholderText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            fireEvent.changeText(getByPlaceholderText('Enter your username'), 'newuser');
            fireEvent.changeText(getByPlaceholderText('name@email.com'), 'new@test.com');
            fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
            fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');

            const checkbox = getByText(/Terms and Conditions/);
            fireEvent.press(checkbox);

            const buttons = getAllByText('Sign up');
            fireEvent.press(buttons[buttons.length - 1]);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Success', expect.any(String), expect.any(Array));
            });

            // Simulate pressing OK on the success alert
            const alertCall = (Alert.alert as jest.Mock).mock.calls.find(
                call => call[0] === 'Success'
            );
            if (alertCall && alertCall[2] && alertCall[2][0]?.onPress) {
                alertCall[2][0].onPress();
            }

            expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
        });
    });

    describe('checkbox toggle', () => {
        it('toggles terms checkbox when pressed', () => {
            const { getByText, getAllByText } = render(<RegisterScreen navigation={mockNavigation as any} route={{} as any} />);

            // Find the checkbox container
            const checkbox = getByText(/Terms and Conditions/);

            // Initial state: checkbox not checked, button should be disabled
            const buttons = getAllByText('Sign up');
            fireEvent.press(buttons[buttons.length - 1]);
            expect(SignUpService).not.toHaveBeenCalled();

            // Toggle checkbox
            fireEvent.press(checkbox);
        });
    });
});
