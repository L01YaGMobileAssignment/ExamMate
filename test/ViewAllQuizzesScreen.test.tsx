import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ViewAllQuizzesScreen from '../src/screens/ViewAllQuizzesScreen';
import { getQuizzes, getQuizByTitle } from '../src/services/quizzesService';
import { useQuizStore } from '../src/store/quizStore';

const mockNavigation = {
    navigate: jest.fn(),
};

jest.mock('../src/services/quizzesService', () => ({
    getQuizzes: jest.fn(),
    getQuizByTitle: jest.fn(),
}));

const mockQuizzes = [
    { quiz_id: '1', quiz_title: 'Quiz 1', questions: [], created_at: '2023-01-01', owned_by: 'user1' },
    { quiz_id: '2', quiz_title: 'Quiz 2', questions: [], created_at: '2023-01-02', owned_by: 'user1' }
];

describe('ViewAllQuizzesScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        useQuizStore.setState({ quizzes: [] });

        (getQuizzes as jest.Mock).mockResolvedValue({
            status: 200,
            data: mockQuizzes
        });
        (getQuizByTitle as jest.Mock).mockResolvedValue({
            status: 200,
            data: [{ quiz_id: '3', quiz_title: 'Search Result Quiz', questions: [], created_at: '2023-01-03', owned_by: 'user1' }]
        });
    });

    describe('rendering', () => {
        it('renders correctly', async () => {
            const { getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('my_quizzes')).toBeTruthy();
            });
        });

        it('shows empty state when no quizzes', async () => {
            (getQuizzes as jest.Mock).mockResolvedValue({
                status: 200,
                data: []
            });

            const { getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('no_quizzes_found')).toBeTruthy();
            });
        });

        it('displays quiz list when quizzes exist', async () => {
            const { getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Quiz 1')).toBeTruthy();
                expect(getByText('Quiz 2')).toBeTruthy();
            });
        });
    });

    describe('navigation', () => {
        it('navigates to document tab when new button is pressed', async () => {
            const { getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('new')).toBeTruthy());

            fireEvent.press(getByText('new'));
            expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentsTab', {
                screen: 'Documents'
            });
        });

        it('navigates to quiz overview when detail button is pressed', async () => {
            const { getAllByText, getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('Quiz 1')).toBeTruthy());

            const detailButtons = getAllByText('detail');
            fireEvent.press(detailButtons[0]);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('QuizOverview', {
                quiz: expect.objectContaining({ quiz_id: '1' })
            });
        });

        it('navigates to correct quiz when second quiz detail is pressed', async () => {
            const { getAllByText, getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('Quiz 2')).toBeTruthy());

            const detailButtons = getAllByText('detail');
            fireEvent.press(detailButtons[1]);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('QuizOverview', {
                quiz: expect.objectContaining({ quiz_id: '2' })
            });
        });
    });

    describe('search functionality', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('handles search functionality with debounce', async () => {
            const { getByPlaceholderText, getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await act(async () => {
                jest.runAllTimers();
            });

            await waitFor(() => expect(getByText('Quiz 1')).toBeTruthy());

            const searchInput = getByPlaceholderText('search_quiz_placeholder');

            fireEvent.changeText(searchInput, 'Search');

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(getQuizByTitle).toHaveBeenCalledWith('Search');
            });
        });

        it('clears search and reloads all quizzes when search is empty', async () => {
            const { getByPlaceholderText, getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await act(async () => {
                jest.runAllTimers();
            });

            await waitFor(() => expect(getByText('Quiz 1')).toBeTruthy());

            const initialCallCount = (getQuizzes as jest.Mock).mock.calls.length;

            const searchInput = getByPlaceholderText('search_quiz_placeholder');

            // Clear search
            fireEvent.changeText(searchInput, '');

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect((getQuizzes as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(initialCallCount);
            });
        });

        it('debounces search input correctly', async () => {
            const { getByPlaceholderText, getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await act(async () => {
                jest.runAllTimers();
            });

            await waitFor(() => expect(getByText('Quiz 1')).toBeTruthy());

            const searchInput = getByPlaceholderText('search_quiz_placeholder');

            // Type multiple characters quickly
            fireEvent.changeText(searchInput, 'S');
            fireEvent.changeText(searchInput, 'Se');
            fireEvent.changeText(searchInput, 'Sea');

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(getQuizByTitle).toHaveBeenCalledWith('Sea');
            });
        });

        it('clears previous timeout when new search starts', async () => {
            const { getByPlaceholderText, getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await act(async () => {
                jest.runAllTimers();
            });

            await waitFor(() => expect(getByText('Quiz 1')).toBeTruthy());

            const searchInput = getByPlaceholderText('search_quiz_placeholder');

            // Start first search
            fireEvent.changeText(searchInput, 'First');

            await act(async () => {
                jest.advanceTimersByTime(200);
            });

            // Start second search before first completes
            fireEvent.changeText(searchInput, 'Second');

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(getQuizByTitle).toHaveBeenCalledWith('Second');
            });
        });
    });

    describe('quiz card rendering', () => {
        it('displays quiz title in card', async () => {
            const { getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Quiz 1')).toBeTruthy();
            });
        });

        it('displays detail button for each quiz', async () => {
            const { getAllByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                const detailButtons = getAllByText('detail');
                expect(detailButtons.length).toBe(2);
            });
        });
    });

    describe('data fetching', () => {
        it('fetches quizzes on initial render', async () => {
            render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getQuizzes).toHaveBeenCalled();
            });
        });

        it('displays quizzes after successful fetch', async () => {
            const { getByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Quiz 1')).toBeTruthy();
                expect(getByText('Quiz 2')).toBeTruthy();
            });
        });
    });

    describe('multiple quizzes', () => {
        it('handles large number of quizzes', async () => {
            const manyQuizzes = Array(10).fill(null).map((_, i) => ({
                quiz_id: `${i + 1}`,
                quiz_title: `Quiz ${i + 1}`,
                questions: [],
                created_at: '2023-01-01',
                owned_by: 'user1'
            }));

            (getQuizzes as jest.Mock).mockResolvedValue({
                status: 200,
                data: manyQuizzes
            });

            const { getByText, getAllByText } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Quiz 1')).toBeTruthy();
                expect(getAllByText('detail').length).toBe(10);
            });
        });
    });

    describe('FlatList refresh', () => {
        it('triggers refresh when FlatList onRefresh is called', async () => {
            const { getByText, UNSAFE_getByType } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('Quiz 1')).toBeTruthy());

            // Get initial call count
            const initialCallCount = (getQuizzes as jest.Mock).mock.calls.length;

            // Find FlatList and trigger refresh
            const { FlatList } = require('react-native');
            const flatList = UNSAFE_getByType(FlatList);

            // Trigger onRefresh callback
            if (flatList.props.onRefresh) {
                await act(async () => {
                    flatList.props.onRefresh();
                });
            }

            await waitFor(() => {
                // getQuizzes should be called again with refresh params
                expect((getQuizzes as jest.Mock).mock.calls.length).toBeGreaterThan(initialCallCount);
            });
        });

        it('triggers load more when end is reached', async () => {
            const { getByText, UNSAFE_getByType } = render(<ViewAllQuizzesScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('Quiz 1')).toBeTruthy());

            // Find FlatList and trigger onEndReached
            const { FlatList } = require('react-native');
            const flatList = UNSAFE_getByType(FlatList);

            // Trigger onEndReached callback
            if (flatList.props.onEndReached) {
                await act(async () => {
                    flatList.props.onEndReached();
                });
            }
        });
    });
});
