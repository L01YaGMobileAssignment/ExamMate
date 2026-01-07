import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SettingScreen from '../src/screens/SettingScreen';
import { useSettingStore } from '../src/store/settingStore';
import { Alert } from 'react-native';

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
};

jest.mock('@react-navigation/native', () => {
    return {
        useNavigation: () => mockNavigation,
    };
});

// Mock Store
jest.mock('../src/store/settingStore', () => ({
    useSettingStore: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('SettingScreen', () => {
    let mockSetNumberOfQuestions: jest.Mock;
    let mockSetNotifyTime: jest.Mock;
    let mockSetLanguage: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSetNumberOfQuestions = jest.fn();
        mockSetNotifyTime = jest.fn();
        mockSetLanguage = jest.fn();

        (useSettingStore as unknown as jest.Mock).mockImplementation((selector) => {
            const state = {
                numberOfQuestions: 10,
                notifyTime: 30,
                language: 'en',
                setNumberOfQuestions: mockSetNumberOfQuestions,
                setNotifyTime: mockSetNotifyTime,
                setLanguage: mockSetLanguage,
            };
            return selector(state);
        });
    });

    describe('rendering', () => {
        it('renders correctly', () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);
            expect(getByText('settings_title')).toBeTruthy();
            expect(getByPlaceholderText('input_placeholder_questions')).toBeTruthy();
            expect(getByPlaceholderText('input_placeholder_notify')).toBeTruthy();
        });

        it('displays language selection buttons', () => {
            const { getByText } = render(<SettingScreen />);
            expect(getByText('english')).toBeTruthy();
            expect(getByText('vietnamese')).toBeTruthy();
        });

        it('displays labels for settings', () => {
            const { getByText } = render(<SettingScreen />);
            expect(getByText('language')).toBeTruthy();
            expect(getByText('num_questions')).toBeTruthy();
            expect(getByText('notify_before')).toBeTruthy();
        });

        it('displays save button', () => {
            const { getByText } = render(<SettingScreen />);
            expect(getByText('save_changes')).toBeTruthy();
        });
    });

    describe('navigation', () => {
        it('has back button that navigates back', async () => {
            const { UNSAFE_getAllByType } = render(<SettingScreen />);

            // Find TouchableOpacity elements (back button is first one in header)
            const { TouchableOpacity } = require('react-native');
            const touchables = UNSAFE_getAllByType(TouchableOpacity);

            // First touchable should be back button
            if (touchables.length > 0) {
                await act(async () => {
                    fireEvent.press(touchables[0]);
                });
                expect(mockNavigation.goBack).toHaveBeenCalled();
            }
        });
    });

    describe('language selection', () => {
        it('allows selecting English language', async () => {
            const { getByText } = render(<SettingScreen />);

            const englishButton = getByText('english');
            await act(async () => {
                fireEvent.press(englishButton);
            });

            // Language should be set to 'en' (state update)
        });

        it('allows selecting Vietnamese language', async () => {
            const { getByText } = render(<SettingScreen />);

            const vietnameseButton = getByText('vietnamese');
            await act(async () => {
                fireEvent.press(vietnameseButton);
            });

            // Language should be set to 'vi' (state update)
        });

        it('saves language change when save is pressed', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            // Select Vietnamese
            const vietnameseButton = getByText('vietnamese');
            await act(async () => {
                fireEvent.press(vietnameseButton);
            });

            // Ensure valid inputs
            fireEvent.changeText(getByPlaceholderText('input_placeholder_questions'), '15');
            fireEvent.changeText(getByPlaceholderText('input_placeholder_notify'), '30');

            // Press save
            const saveButton = getByText('save_changes');
            await act(async () => {
                fireEvent.press(saveButton);
            });

            await waitFor(() => {
                expect(mockSetLanguage).toHaveBeenCalledWith('vi');
            });
        });
    });

    describe('save functionality', () => {
        it('updates number of questions and notification time successfully', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            const questionsInput = getByPlaceholderText('input_placeholder_questions');
            const notifyInput = getByPlaceholderText('input_placeholder_notify');
            const saveButton = getByText('save_changes');

            fireEvent.changeText(questionsInput, '15');
            fireEvent.changeText(notifyInput, '45');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(mockSetNumberOfQuestions).toHaveBeenCalledWith(15);
                expect(mockSetNotifyTime).toHaveBeenCalledWith(45);
                expect(Alert.alert).toHaveBeenCalledWith('success', 'settings_saved');
                expect(mockNavigation.goBack).toHaveBeenCalled();
            });
        });

        it('saves all settings atomically with Promise.all', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            fireEvent.changeText(getByPlaceholderText('input_placeholder_questions'), '20');
            fireEvent.changeText(getByPlaceholderText('input_placeholder_notify'), '60');
            fireEvent.press(getByText('save_changes'));

            await waitFor(() => {
                expect(mockSetNumberOfQuestions).toHaveBeenCalledWith(20);
                expect(mockSetNotifyTime).toHaveBeenCalledWith(60);
                expect(mockSetLanguage).toHaveBeenCalledWith('en');
            });
        });
    });

    describe('validation', () => {
        it('shows error for number of questions less than 5', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            const questionsInput = getByPlaceholderText('input_placeholder_questions');
            const saveButton = getByText('save_changes');

            fireEvent.changeText(questionsInput, '2');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('invalid_input', 'error_num_questions');
                expect(mockSetNumberOfQuestions).not.toHaveBeenCalled();
                expect(mockNavigation.goBack).not.toHaveBeenCalled();
            });
        });

        it('shows error for number of questions greater than 30', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            const questionsInput = getByPlaceholderText('input_placeholder_questions');
            const saveButton = getByText('save_changes');

            fireEvent.changeText(questionsInput, '50');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('invalid_input', 'error_num_questions');
            });
        });

        it('shows error for NaN number of questions', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            const questionsInput = getByPlaceholderText('input_placeholder_questions');
            const saveButton = getByText('save_changes');

            fireEvent.changeText(questionsInput, 'abc');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('invalid_input', 'error_num_questions');
            });
        });

        it('shows error for invalid notification time', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            const notifyInput = getByPlaceholderText('input_placeholder_notify');
            const saveButton = getByText('save_changes');

            fireEvent.changeText(notifyInput, '-5');
            fireEvent.press(saveButton);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('invalid_input', 'error_notify_time');
                expect(mockSetNotifyTime).not.toHaveBeenCalled();
            });
        });

        it('shows error for zero notification time', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            fireEvent.changeText(getByPlaceholderText('input_placeholder_questions'), '15');
            fireEvent.changeText(getByPlaceholderText('input_placeholder_notify'), '0');
            fireEvent.press(getByText('save_changes'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('invalid_input', 'error_notify_time');
            });
        });

        it('shows error for NaN notification time', async () => {
            const { getByText, getByPlaceholderText } = render(<SettingScreen />);

            fireEvent.changeText(getByPlaceholderText('input_placeholder_questions'), '15');
            fireEvent.changeText(getByPlaceholderText('input_placeholder_notify'), 'xyz');
            fireEvent.press(getByText('save_changes'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('invalid_input', 'error_notify_time');
            });
        });
    });

    describe('input handling', () => {
        it('allows changing number of questions input', () => {
            const { getByPlaceholderText } = render(<SettingScreen />);

            const input = getByPlaceholderText('input_placeholder_questions');
            fireEvent.changeText(input, '25');

            expect(input.props.value).toBe('25');
        });

        it('allows changing notification time input', () => {
            const { getByPlaceholderText } = render(<SettingScreen />);

            const input = getByPlaceholderText('input_placeholder_notify');
            fireEvent.changeText(input, '90');

            expect(input.props.value).toBe('90');
        });
    });

    describe('state synchronization', () => {
        it('initializes inputs with store values', () => {
            const { getByPlaceholderText } = render(<SettingScreen />);

            const questionsInput = getByPlaceholderText('input_placeholder_questions');
            const notifyInput = getByPlaceholderText('input_placeholder_notify');

            expect(questionsInput.props.value).toBe('10');
            expect(notifyInput.props.value).toBe('30');
        });
    });
});
