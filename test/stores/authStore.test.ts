import { useAuthStore } from '../../src/store/useAuthStore';
import { UserType } from '../../src/types/user';

describe('authStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useAuthStore.setState({
            user: null,
            isLoading: false,
        });
    });

    const mockUser: UserType = {
        id: 'user1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    };

    describe('setUser', () => {
        it('should set user', () => {
            useAuthStore.getState().setUser(mockUser);

            expect(useAuthStore.getState().user).toEqual(mockUser);
        });

        it('should set user to null', () => {
            useAuthStore.setState({ user: mockUser });

            useAuthStore.getState().setUser(null);

            expect(useAuthStore.getState().user).toBeNull();
        });

        it('should replace existing user', () => {
            useAuthStore.setState({ user: mockUser });

            const newUser: UserType = { ...mockUser, username: 'newuser' };
            useAuthStore.getState().setUser(newUser);

            expect(useAuthStore.getState().user?.username).toBe('newuser');
        });
    });

    describe('setLoading', () => {
        it('should set loading to true', () => {
            useAuthStore.getState().setLoading(true);

            expect(useAuthStore.getState().isLoading).toBe(true);
        });

        it('should set loading to false', () => {
            useAuthStore.setState({ isLoading: true });

            useAuthStore.getState().setLoading(false);

            expect(useAuthStore.getState().isLoading).toBe(false);
        });
    });

    describe('logout', () => {
        it('should clear user on logout', () => {
            useAuthStore.setState({ user: mockUser });

            useAuthStore.getState().logout();

            expect(useAuthStore.getState().user).toBeNull();
        });

        it('should work when user is already null', () => {
            useAuthStore.getState().logout();

            expect(useAuthStore.getState().user).toBeNull();
        });
    });
});
