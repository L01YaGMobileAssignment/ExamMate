import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { UserType } from "../types/user";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

const setItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const removeItem = async (key: string) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const saveToken = async (token: string) => {
  await setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await removeItem(TOKEN_KEY);
};

export const getUser = async (): Promise<UserType | null> => {
  const userStr = await getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user data", e);
      return null;
    }
  }
  return null;
};

export const saveUser = async (user: UserType) => {
  await setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = async () => {
  await removeItem(USER_KEY);
  await removeItem(TOKEN_KEY);
};
