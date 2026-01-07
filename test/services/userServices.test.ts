import { apiEndpoints } from '../../src/services/endpoints';

// Create mock axios
const mockAxiosGet = jest.fn();
const mockAxiosPut = jest.fn();

jest.mock('../../src/services/api', () => ({
    __esModule: true,
    default: {
        get: (...args: any[]) => mockAxiosGet(...args),
        put: (...args: any[]) => mockAxiosPut(...args),
    },
}));

import { getUserInfor, changeLanguage } from '../../src/services/userServices';

describe('userServices', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserInfor', () => {
        it('should fetch user information', async () => {
            const mockUser = {
                id: 'user1',
                username: 'testuser',
                email: 'test@example.com',
                role: 'user',
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01',
            };
            mockAxiosGet.mockResolvedValue({
                status: 200,
                data: mockUser,
            });

            const result = await getUserInfor();

            expect(mockAxiosGet).toHaveBeenCalledWith(apiEndpoints.getUserInfor);
            expect(result.status).toBe(200);
            expect(result.data).toEqual(mockUser);
        });

        it('should handle API errors', async () => {
            mockAxiosGet.mockRejectedValue(new Error('API Error'));

            await expect(getUserInfor()).rejects.toThrow('API Error');
        });
    });

    describe('changeLanguage', () => {
        it('should change language to English', async () => {
            mockAxiosPut.mockResolvedValue({
                status: 200,
                data: 'en',
            });

            const result = await changeLanguage('en');

            expect(mockAxiosPut).toHaveBeenCalledWith(
                apiEndpoints.changeLanguyege,
                {},
                { params: { language: 'en' } }
            );
            expect(result.status).toBe(200);
        });

        it('should change language to Vietnamese', async () => {
            mockAxiosPut.mockResolvedValue({
                status: 200,
                data: 'vi',
            });

            const result = await changeLanguage('vi');

            expect(mockAxiosPut).toHaveBeenCalledWith(
                apiEndpoints.changeLanguyege,
                {},
                { params: { language: 'vi' } }
            );
            expect(result.status).toBe(200);
        });

        it('should handle API errors', async () => {
            mockAxiosPut.mockRejectedValue(new Error('API Error'));

            await expect(changeLanguage('en')).rejects.toThrow('API Error');
        });
    });
});
