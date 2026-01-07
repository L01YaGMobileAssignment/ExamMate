import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
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

    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<SettingScreen />);
        expect(getByText('settings_title')).toBeTruthy();
        expect(getByPlaceholderText('input_placeholder_questions')).toBeTruthy();
        expect(getByPlaceholderText('input_placeholder_notify')).toBeTruthy();
    });

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

    it('shows error for invalid number of questions', async () => {
        const { getByText, getByPlaceholderText } = render(<SettingScreen />);

        const questionsInput = getByPlaceholderText('input_placeholder_questions');
        const saveButton = getByText('save_changes');

        fireEvent.changeText(questionsInput, '2'); // Invalid: < 5
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('invalid_input', 'error_num_questions');
            expect(mockSetNumberOfQuestions).not.toHaveBeenCalled();
            expect(mockNavigation.goBack).not.toHaveBeenCalled();
        });
    });

    it('shows error for invalid notification time', async () => {
        const { getByText, getByPlaceholderText } = render(<SettingScreen />);

        const notifyInput = getByPlaceholderText('input_placeholder_notify');
        const saveButton = getByText('save_changes');

        fireEvent.changeText(notifyInput, '-5'); // Invalid: <= 0
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('invalid_input', 'error_notify_time');
            expect(mockSetNotifyTime).not.toHaveBeenCalled();
        });
    });
});
