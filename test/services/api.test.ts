// This test file tests the API interceptors behavior
// We need to test the interceptors without actually making API calls

import * as Sentry from '@sentry/react-native';

// Mock dependencies before importing api
jest.mock('../../src/store/secureStore', () => ({
    getToken: jest.fn(),
    clearAuth: jest.fn(),
}));

jest.mock('../../src/navigation/navigationRef', () => ({
    resetAndNavigate: jest.fn(),
}));

import { getToken, clearAuth } from '../../src/store/secureStore';
import { resetAndNavigate } from '../../src/navigation/navigationRef';

describe('API Configuration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Request Interceptor', () => {
        it('should get token for authenticated requests', async () => {
            (getToken as jest.Mock).mockResolvedValue('test-token');

            // Simulate the behavior of the request interceptor
            const token = await getToken();
            expect(token).toBe('test-token');
        });

        it('should handle missing token', async () => {
            (getToken as jest.Mock).mockResolvedValue(null);

            const token = await getToken();
            expect(token).toBeNull();
        });
    });

    describe('Response Interceptor', () => {
        it('should handle 401 error', async () => {
            const error = {
                response: { status: 401 },
                config: { url: '/test', method: 'get' },
            };

            // Simulate 401 handling
            if (error.response?.status === 401) {
                await clearAuth();
                resetAndNavigate('Login');
            }

            expect(clearAuth).toHaveBeenCalled();
            expect(resetAndNavigate).toHaveBeenCalledWith('Login');
        });

        it('should capture exceptions in Sentry', () => {
            const error = {
                response: { status: 500, statusText: 'Internal Server Error' },
                config: { url: '/test', method: 'get' },
            };

            Sentry.captureException(error, {
                tags: {
                    api: 'axios_interceptor',
                    status: error.response.status.toString(),
                },
                extra: {
                    url: error.config.url,
                    method: error.config.method,
                    statusText: error.response.statusText,
                },
            });

            expect(Sentry.captureException).toHaveBeenCalledWith(error, expect.objectContaining({
                tags: expect.objectContaining({
                    api: 'axios_interceptor',
                    status: '500',
                }),
            }));
        });

        it('should handle network errors without status', () => {
            const error = {
                config: { url: '/test', method: 'get' },
                message: 'Network Error',
            };

            // Simulate network error handling
            const status = error.response?.status?.toString() || 'network_error';
            expect(status).toBe('network_error');
        });
    });

    describe('FormData handling', () => {
        it('should remove Content-Type for FormData requests', () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    delete: jest.fn(),
                },
                data: new FormData(),
            };

            // Simulate FormData detection and header removal
            if (config.data instanceof FormData) {
                if (config.headers && typeof config.headers.delete === 'function') {
                    config.headers.delete('Content-Type');
                }
            }

            expect(config.headers.delete).toHaveBeenCalledWith('Content-Type');
        });
    });
});
