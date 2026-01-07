import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ViewAllQuizzesScreen from '../src/screens/ViewAllQuizzesScreen';
import { getQuizzes, getQuizByTitle } from '../src/services/quizzesService';

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

// Mock dependencies
jest.mock('../src/services/quizzesService', () => ({
    getQuizzes: jest.fn(),
    getQuizByTitle: jest.fn(),
}));

jest.mock('../src/store/quizStore', () => ({
    useQuizStore: jest.fn((selector) => {
        const mockState = { quizzes: [] };
        return selector ? selector(mockState) : mockState;
    }),
}));


// Remove jest.useFakeTimers() from global scope
// jest.useFakeTimers();

describe('ViewAllQuizzesScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset to real timers ensures clean slate for each test if we leak
        jest.useRealTimers();

        (getQuizzes as jest.Mock).mockResolvedValue({
            status: 200,
            data: [
                { quiz_id: 1, quiz_title: 'Math Quiz 1', created_at: '2023-01-01' },
                { quiz_id: 2, quiz_title: 'History Quiz', created_at: '2023-01-02' }
            ]
        });
        (getQuizByTitle as jest.Mock).mockResolvedValue({
            status: 200,
            data: [{ quiz_id: 3, quiz_title: 'Search Result Quiz', created_at: '2023-01-03' }]
        });
    });

    it('renders correctly and loads data', async () => {
        const { getByText, getByPlaceholderText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

        // Wait for loading to finish and content to appear
        await waitFor(() => {
            expect(getByText('my_quizzes')).toBeTruthy();
            expect(getByText('new')).toBeTruthy();
        });

        expect(getByPlaceholderText('search_quiz_placeholder')).toBeTruthy();
        expect(getByText('Math Quiz 1')).toBeTruthy();
        expect(getByText('History Quiz')).toBeTruthy();
    });

    it('navigates to create new quiz', async () => {
        const { getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => expect(getByText('new')).toBeTruthy());

        fireEvent.press(getByText('new'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentsTab', { screen: 'Documents' });
    });

    it('navigates to quiz detail', async () => {
        const { getAllByText, getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => expect(getByText('Math Quiz 1')).toBeTruthy());

        const detailButtons = getAllByText('detail');
        fireEvent.press(detailButtons[0]);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('QuizOverview', {
            quiz: expect.objectContaining({ quiz_title: 'Math Quiz 1' })
        });
    });

    it('handles search functionality', async () => {
        jest.useFakeTimers();
        const { getByPlaceholderText, getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

        // Wait for render
        await waitFor(() => expect(getByText('my_quizzes')).toBeTruthy());

        const searchInput = getByPlaceholderText('search_quiz_placeholder');

        fireEvent.changeText(searchInput, 'Search');

        act(() => {
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(getQuizByTitle).toHaveBeenCalledWith('Search');
            expect(getByText('Search Result Quiz')).toBeTruthy();
        });
        jest.useRealTimers();
    });

    it('shows no results message when empty', async () => {
        (getQuizzes as jest.Mock).mockResolvedValue({ status: 200, data: [] });

        const { getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => {
            expect(getByText('no_quizzes_found')).toBeTruthy();
        });
    });
});
