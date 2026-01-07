import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { getDocuments } from '../src/services/docApiService';
import { getAllSchedules } from '../src/services/scheduleService';
import { getUser } from '../src/store/secureStore';
import { useQuizStore } from '../src/store/quizStore';

const mockNavigation = {
    navigate: jest.fn(),
};

jest.mock('../src/services/docApiService', () => ({
    getDocuments: jest.fn(),
}));

jest.mock('../src/services/scheduleService', () => ({
    getAllSchedules: jest.fn(),
}));

jest.mock('../src/store/secureStore', () => ({
    getUser: jest.fn(),
}));

jest.mock('../src/store/quizStore', () => ({
    useQuizStore: jest.fn(),
}));

describe('HomeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks
        (getDocuments as jest.Mock).mockResolvedValue({
            status: 200,
            data: [{ id: 1, title: 'Recent Doc', fileType: 'pdf' }]
        });
        (getAllSchedules as jest.Mock).mockResolvedValue({
            status: 200,
            data: []
        });
        (getUser as jest.Mock).mockResolvedValue({
            username: 'Test User'
        });
        // Mock store implementation
        (useQuizStore as unknown as jest.Mock).mockImplementation((selector) => {
            if (selector) return selector({ generatingQuizzes: [] });
            return { generatingQuizzes: [] };
        });
    });

    it('renders correctly', async () => {
        const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => {
            expect(getByText('ExamMate')).toBeTruthy();
            expect(getByText('hello, Test User')).toBeTruthy();
            expect(getByText('create_quiz')).toBeTruthy();
            expect(getByText('my_quizzes')).toBeTruthy();
            expect(getByText('recent_documents')).toBeTruthy();
        });
    });

    it('navigates to My Quizzes', async () => {
        const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => expect(getByText('my_quizzes')).toBeTruthy());

        fireEvent.press(getByText('my_quizzes'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('ViewAllQuizzes');
    });

    it('navigates to create quiz (Documents tab)', async () => {
        const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => expect(getByText('create_quiz')).toBeTruthy());

        fireEvent.press(getByText('create_quiz'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentsTab', {
            screen: 'Documents'
        });
    });

    it('navigates to document detail when clicking a recent document', async () => {
        const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => expect(getByText('Recent Doc')).toBeTruthy());

        fireEvent.press(getByText('Recent Doc'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', {
            document: expect.objectContaining({ title: 'Recent Doc' })
        });
    });
});
