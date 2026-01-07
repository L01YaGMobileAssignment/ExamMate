import { navigationRef, navigate, resetAndNavigate } from '../../src/navigation/navigationRef';

// Mock the navigation container ref
jest.mock('@react-navigation/native', () => ({
    createNavigationContainerRef: jest.fn(() => ({
        isReady: jest.fn(),
        navigate: jest.fn(),
        reset: jest.fn(),
    })),
}));

describe('navigationRef', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('navigate', () => {
        it('should navigate when navigation is ready', () => {
            (navigationRef.isReady as jest.Mock).mockReturnValue(true);

            navigate('Home');

            expect(navigationRef.navigate).toHaveBeenCalledWith('Home', undefined);
        });

        it('should navigate with params when provided', () => {
            (navigationRef.isReady as jest.Mock).mockReturnValue(true);

            navigate('DocumentDetail', { id: 'doc1' });

            expect(navigationRef.navigate).toHaveBeenCalledWith('DocumentDetail', { id: 'doc1' });
        });

        it('should not navigate when navigation is not ready', () => {
            (navigationRef.isReady as jest.Mock).mockReturnValue(false);

            navigate('Home');

            expect(navigationRef.navigate).not.toHaveBeenCalled();
        });
    });

    describe('resetAndNavigate', () => {
        it('should reset navigation stack when ready', () => {
            (navigationRef.isReady as jest.Mock).mockReturnValue(true);

            resetAndNavigate('Login');

            expect(navigationRef.reset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        });

        it('should not reset when navigation is not ready', () => {
            (navigationRef.isReady as jest.Mock).mockReturnValue(false);

            resetAndNavigate('Login');

            expect(navigationRef.reset).not.toHaveBeenCalled();
        });
    });
});
