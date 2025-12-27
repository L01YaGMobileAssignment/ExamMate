import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';
import { changeLanguage } from "../services/userServices";
import { queryClient } from "../components/providers/queryClient";

interface SettingState {
    numberOfQuestions: number;
    notifyTime: number;
    language: string;
    isLoading: boolean;
    setNumberOfQuestions: (num: number) => Promise<void>;
    setNotifyTime: (minutes: number) => Promise<void>;
    setLanguage: (lang: string) => Promise<void>;
    loadSettings: () => Promise<void>;
}

const SETTINGS_KEY = 'user_settings';

export const useSettingStore = create<SettingState>((set, get) => ({
    numberOfQuestions: 20,
    notifyTime: 60,
    language: 'en',
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
    setNotifyTime: async (minutes: number) => {
        try {
            set({ notifyTime: minutes });
            const currentSettings = await SecureStore.getItemAsync(SETTINGS_KEY);
            const settings = currentSettings ? JSON.parse(currentSettings) : {};
            await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify({ ...settings, notifyTime: minutes }));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    },
    setLanguage: async (lang: string) => {
        try {
            set({ language: lang });
            const currentSettings = await SecureStore.getItemAsync(SETTINGS_KEY);
            const settings = currentSettings ? JSON.parse(currentSettings) : {};
            await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify({ ...settings, language: lang }));
            await changeLanguage(lang);

            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
            queryClient.invalidateQueries({ queryKey: ['schedule'] });
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
                if (settings.notifyTime) {
                    set({ notifyTime: settings.notifyTime });
                }
                if (settings.language) {
                    set({ language: settings.language });
                }
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));

