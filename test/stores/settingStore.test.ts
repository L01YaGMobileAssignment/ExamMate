import * as SecureStore from 'expo-secure-store';
import { useSettingStore } from '../../src/store/settingStore';

// Mock the userServices
jest.mock('../../src/services/userServices', () => ({
    changeLanguage: jest.fn(() => Promise.resolve({ status: 200 })),
}));

// Mock queryClient
jest.mock('../../src/components/providers/queryClient', () => ({
    queryClient: {
        invalidateQueries: jest.fn(),
    },
}));

describe('settingStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset store state before each test
        useSettingStore.setState({
            numberOfQuestions: 20,
            notifyTime: 60,
            language: 'en',
            isLoading: true,
        });
    });

    describe('initial state', () => {
        it('should have correct default values', () => {
            expect(useSettingStore.getState().numberOfQuestions).toBe(20);
            expect(useSettingStore.getState().notifyTime).toBe(60);
            expect(useSettingStore.getState().language).toBe('en');
        });
    });

    describe('setNumberOfQuestions', () => {
        it('should update numberOfQuestions and persist to SecureStore', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            await useSettingStore.getState().setNumberOfQuestions(30);

            expect(useSettingStore.getState().numberOfQuestions).toBe(30);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
                'user_settings',
                expect.stringContaining('"numberOfQuestions":30')
            );
        });

        it('should merge with existing settings', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
                JSON.stringify({ notifyTime: 90 })
            );

            await useSettingStore.getState().setNumberOfQuestions(25);

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
                'user_settings',
                expect.stringContaining('"notifyTime":90')
            );
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
                'user_settings',
                expect.stringContaining('"numberOfQuestions":25')
            );
        });

        it('should handle SecureStore errors gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));

            await useSettingStore.getState().setNumberOfQuestions(30);

            expect(consoleSpy).toHaveBeenCalledWith('Failed to save settings:');
            consoleSpy.mockRestore();
        });
    });

    describe('setNotifyTime', () => {
        it('should update notifyTime and persist to SecureStore', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            await useSettingStore.getState().setNotifyTime(90);

            expect(useSettingStore.getState().notifyTime).toBe(90);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
                'user_settings',
                expect.stringContaining('"notifyTime":90')
            );
        });
    });

    describe('setLanguage', () => {
        it('should update language and call API', async () => {
            const { changeLanguage } = require('../../src/services/userServices');
            const { queryClient } = require('../../src/components/providers/queryClient');
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            await useSettingStore.getState().setLanguage('vi');

            expect(useSettingStore.getState().language).toBe('vi');
            expect(changeLanguage).toHaveBeenCalledWith('vi');
            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['documents'] });
            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['quizzes'] });
            expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['schedule'] });
        });
    });

    describe('loadSettings', () => {
        it('should load settings from SecureStore', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
                JSON.stringify({
                    numberOfQuestions: 15,
                    notifyTime: 45,
                    language: 'vi',
                })
            );

            await useSettingStore.getState().loadSettings();

            expect(useSettingStore.getState().numberOfQuestions).toBe(15);
            expect(useSettingStore.getState().notifyTime).toBe(45);
            expect(useSettingStore.getState().language).toBe('vi');
            expect(useSettingStore.getState().isLoading).toBe(false);
        });

        it('should keep defaults when no stored settings', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            // Reset to default values
            useSettingStore.setState({
                numberOfQuestions: 20,
                notifyTime: 60,
                language: 'en',
            });

            await useSettingStore.getState().loadSettings();

            expect(useSettingStore.getState().numberOfQuestions).toBe(20);
            expect(useSettingStore.getState().notifyTime).toBe(60);
            expect(useSettingStore.getState().language).toBe('en');
        });

        it('should handle partial settings', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
                JSON.stringify({ numberOfQuestions: 25 })
            );

            useSettingStore.setState({
                numberOfQuestions: 20,
                notifyTime: 60,
                language: 'en',
            });

            await useSettingStore.getState().loadSettings();

            expect(useSettingStore.getState().numberOfQuestions).toBe(25);
            expect(useSettingStore.getState().notifyTime).toBe(60);
            expect(useSettingStore.getState().language).toBe('en');
        });

        it('should set isLoading to false even on error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));

            await useSettingStore.getState().loadSettings();

            expect(useSettingStore.getState().isLoading).toBe(false);
            consoleSpy.mockRestore();
        });
    });
});
