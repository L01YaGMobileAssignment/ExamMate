// Test the endpoints configuration
import { apiEndpoints } from '../../src/services/endpoints';

describe('endpoints', () => {
    it('should have correct getDocuments endpoint', () => {
        expect(apiEndpoints.getDocuments).toBe('/documents');
    });

    it('should have correct getDocumentById endpoint', () => {
        expect(apiEndpoints.getDocumentById).toBe('/documents/:id');
    });

    it('should have correct searchDocumentByKey endpoint', () => {
        expect(apiEndpoints.searchDocumentByKey).toBe('/documents/search');
    });

    it('should have correct deleteDocument endpoint', () => {
        expect(apiEndpoints.deleteDocument).toBe('/documents/:id');
    });

    it('should have correct downloadDocument endpoint', () => {
        expect(apiEndpoints.downloadDocument).toBe('/documents/:id/download');
    });

    it('should have correct uploadDocument endpoint', () => {
        expect(apiEndpoints.uploadDocument).toBe('/documents');
    });

    it('should have correct summaryDocument endpoint', () => {
        expect(apiEndpoints.summaryDocument).toBe('/documents/:id/summary');
    });

    it('should have correct getUserInfor endpoint', () => {
        expect(apiEndpoints.getUserInfor).toBe('/users/me');
    });

    it('should have correct changeLanguyege endpoint', () => {
        expect(apiEndpoints.changeLanguyege).toBe('/users/me/language');
    });

    it('should have correct getAllQuizzes endpoint', () => {
        expect(apiEndpoints.getAllQuizzes).toBe('/quizzes');
    });

    it('should have correct genQuiz endpoint', () => {
        expect(apiEndpoints.genQuiz).toBe('/quizzes/generate');
    });

    it('should have correct getQuizById endpoint', () => {
        expect(apiEndpoints.getQuizById).toBe('/quizzes/:id');
    });

    it('should have correct searchQuizzes endpoint', () => {
        expect(apiEndpoints.searchQuizzes).toBe('/quizzes/search');
    });

    it('should have correct getAllSchedules endpoint', () => {
        expect(apiEndpoints.getAllSchedules).toBe('/schedule');
    });

    it('should have correct createSchedule endpoint', () => {
        expect(apiEndpoints.createSchedule).toBe('/schedule');
    });

    it('should have correct getScheduleById endpoint', () => {
        expect(apiEndpoints.getScheduleById).toBe('/schedule/:id');
    });

    it('should have correct updateScheduleById endpoint', () => {
        expect(apiEndpoints.updateScheduleById).toBe('/schedule/:id');
    });

    it('should have correct deleteScheduleById endpoint', () => {
        expect(apiEndpoints.deleteScheduleById).toBe('/schedule/:id');
    });

    it('should replace :id placeholder correctly', () => {
        const docId = '123';
        const resolvedEndpoint = apiEndpoints.getDocumentById.replace(':id', docId);

        expect(resolvedEndpoint).toBe('/documents/123');
    });

    it('should have health endpoint', () => {
        expect(apiEndpoints.health).toBe('/health');
    });

    it('should have register endpoint', () => {
        expect(apiEndpoints.register).toBe('/register');
    });

    it('should have signin endpoint', () => {
        expect(apiEndpoints.signin).toBe('/token');
    });
});

// Test the service functions using the mocked module from jest.setup.js
describe('docApiService (mocked)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should import getDocuments function', async () => {
        const { getDocuments } = require('../../src/services/docApiService');
        expect(getDocuments).toBeDefined();
        expect(typeof getDocuments).toBe('function');
    });

    it('should import getDocumentsByTitleKey function', async () => {
        const { getDocumentsByTitleKey } = require('../../src/services/docApiService');
        expect(getDocumentsByTitleKey).toBeDefined();
        expect(typeof getDocumentsByTitleKey).toBe('function');
    });

    it('should import getDocumentById function', async () => {
        const { getDocumentById } = require('../../src/services/docApiService');
        expect(getDocumentById).toBeDefined();
        expect(typeof getDocumentById).toBe('function');
    });

    it('should import uploadDocument function', async () => {
        const { uploadDocument } = require('../../src/services/docApiService');
        expect(uploadDocument).toBeDefined();
        expect(typeof uploadDocument).toBe('function');
    });

    it('should import deleteDocument function', async () => {
        const { deleteDocument } = require('../../src/services/docApiService');
        expect(deleteDocument).toBeDefined();
        expect(typeof deleteDocument).toBe('function');
    });

    it('getDocuments returns expected structure', async () => {
        const { getDocuments } = require('../../src/services/docApiService');

        const result = await getDocuments();

        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('data');
        expect(result.status).toBe(200);
        expect(Array.isArray(result.data)).toBe(true);
    });

    it('getDocumentsByTitleKey returns expected structure', async () => {
        const { getDocumentsByTitleKey } = require('../../src/services/docApiService');

        const result = await getDocumentsByTitleKey('test');

        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('data');
        expect(result.status).toBe(200);
    });
});
