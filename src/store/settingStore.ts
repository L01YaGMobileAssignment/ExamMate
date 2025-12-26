import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';

interface SettingState {
    numberOfQuestions: number;
    isLoading: boolean;
    setNumberOfQuestions: (num: number) => Promise<void>;
    loadSettings: () => Promise<void>;
}

const SETTINGS_KEY = 'user_settings';

export const useSettingStore = create<SettingState>((set, get) => ({
    numberOfQuestions: 20,
    isLoading: true,
    setNumberOfQuestions: async (num: number) => {
        try {
            set({ numberOfQuestions: num });
            const currentSettings = await SecureStore.getItemAsync(SETTINGS_KEY);
            const settings = currentSettings ? JSON.parse(currentSettings) : {};
            await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify({ ...settings, numberOfQuestions: num }));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    },
    loadSettings: async () => {
        try {
            set({ isLoading: true });
            const storedSettings = await SecureStore.getItemAsync(SETTINGS_KEY);
            if (storedSettings) {
                const settings = JSON.parse(storedSettings);
                if (settings.numberOfQuestions) {
                    set({ numberOfQuestions: settings.numberOfQuestions });
                }
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));

