import * as SecureStore from 'expo-secure-store';
import {
    saveToken,
    getToken,
    removeToken,
    getUser,
    saveUser,
    clearAuth,
    getIsFirstUse,
    saveIsFirstUse,
} from '../../src/store/secureStore';
import { UserType } from '../../src/types/user';

// Mock Platform
jest.mock('react-native', () => ({
    Platform: {
        OS: 'ios', // Default to iOS, change to 'web' for web tests
    },
}));

describe('secureStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockUser: UserType = {
        id: 'user1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    };

    describe('saveToken', () => {
        it('should save token using SecureStore', async () => {
            await saveToken('test-token');

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('access_token', 'test-token');
        });
    });

    describe('getToken', () => {
        it('should get token from SecureStore', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-token');

            const token = await getToken();

            expect(token).toBe('test-token');
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith('access_token');
        });

        it('should return null when no token exists', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            const token = await getToken();

            expect(token).toBeNull();
        });
    });

    describe('removeToken', () => {
        it('should remove token from SecureStore', async () => {
            await removeToken();

            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('access_token');
        });
    });

    describe('getUser', () => {
        it('should get and parse user from SecureStore', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

            const user = await getUser();

            expect(user).toEqual(mockUser);
        });

        it('should return null when no user exists', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            const user = await getUser();

            expect(user).toBeNull();
        });

        it('should return null when parsing fails', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('invalid-json');

            const user = await getUser();

            expect(user).toBeNull();
        });
    });

    describe('saveUser', () => {
        it('should save user as JSON string', async () => {
            await saveUser(mockUser);

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
        });
    });

    describe('clearAuth', () => {
        it('should remove both user and token', async () => {
            await clearAuth();

            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user');
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('access_token');
        });
    });

    describe('getIsFirstUse', () => {
        it('should return true when first use key is null', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            const isFirstUse = await getIsFirstUse();

            expect(isFirstUse).toBe(true);
        });

        it('should return false when first use key exists', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('false');

            const isFirstUse = await getIsFirstUse();

            expect(isFirstUse).toBe(false);
        });
    });

    describe('saveIsFirstUse', () => {
        it('should save first use flag as false', async () => {
            await saveIsFirstUse();

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith('is_first_use', 'false');
        });
    });
});
