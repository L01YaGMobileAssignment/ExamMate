import { queryClient } from '../../src/components/providers/queryClient';

describe('queryClient', () => {
    describe('configuration', () => {
        it('should have correct default options', () => {
            const defaultOptions = queryClient.getDefaultOptions();

            expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000);
            expect(defaultOptions.queries?.gcTime).toBe(10 * 60 * 1000);
            expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
            expect(defaultOptions.mutations?.retry).toBe(false);
        });
    });

    describe('retry logic', () => {
        it('should not retry on 4xx errors', () => {
            const defaultOptions = queryClient.getDefaultOptions();
            const retryFn = defaultOptions.queries?.retry as Function;

            const error400 = { response: { status: 400 } };
            const error401 = { response: { status: 401 } };
            const error404 = { response: { status: 404 } };
            const error499 = { response: { status: 499 } };

            expect(retryFn(0, error400)).toBe(false);
            expect(retryFn(0, error401)).toBe(false);
            expect(retryFn(0, error404)).toBe(false);
            expect(retryFn(0, error499)).toBe(false);
        });

        it('should retry on 5xx errors up to 3 times', () => {
            const defaultOptions = queryClient.getDefaultOptions();
            const retryFn = defaultOptions.queries?.retry as Function;

            const error500 = { response: { status: 500 } };

            expect(retryFn(0, error500)).toBe(true);
            expect(retryFn(1, error500)).toBe(true);
            expect(retryFn(2, error500)).toBe(true);
            expect(retryFn(3, error500)).toBe(false);
        });

        it('should retry on network errors up to 3 times', () => {
            const defaultOptions = queryClient.getDefaultOptions();
            const retryFn = defaultOptions.queries?.retry as Function;

            const networkError = { message: 'Network Error' };

            expect(retryFn(0, networkError)).toBe(true);
            expect(retryFn(1, networkError)).toBe(true);
            expect(retryFn(2, networkError)).toBe(true);
            expect(retryFn(3, networkError)).toBe(false);
        });

        it('should handle errors without response', () => {
            const defaultOptions = queryClient.getDefaultOptions();
            const retryFn = defaultOptions.queries?.retry as Function;

            const errorNoResponse = {};

            // Should retry as it's not a 4xx error
            expect(retryFn(0, errorNoResponse)).toBe(true);
        });
    });
});
