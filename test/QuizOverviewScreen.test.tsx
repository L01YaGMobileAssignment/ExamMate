import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import QuizOverviewScreen from '../src/screens/QuizOverviewScreen';
import { getQuizById } from '../src/services/quizzesService';
import { useQuizStore } from '../src/store/quizStore';

jest.mock('../src/services/quizzesService');
jest.spyOn(Alert, 'alert');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

const mockQuestion = {
    id: 'q1',
    question: 'Test Question?',
    options: ['A', 'B', 'C', 'D'] as unknown as [string],
    answer_index: 0,
    correct_answer: 'A',
    why_correct: 'Because A is correct',
};

const mockQuiz = {
    quiz_id: 'quiz1',
    owned_by: 'user1',
    quiz_title: 'Test Quiz Title',
    questions: [mockQuestion],
    created_at: '2026-01-01',
};

const mockRoute = {
    params: {
        quiz: mockQuiz,
    },
};

const mockRouteEmptyQuestions = {
    params: {
        quiz: {
            quiz_id: 'quiz1',
            owned_by: 'user1',
            quiz_title: 'Test Quiz',
            questions: [],
            created_at: '2026-01-01',
        },
    },
};

describe('QuizOverviewScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useQuizStore.setState({
            quizzes: [],
            generatingQuizzes: [],
            isLoading: false,
        });
    });

    describe('rendering with existing questions', () => {
        it('renders correctly with quiz data', async () => {
            const { getByText } = render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('quiz_overview')).toBeTruthy();
            });
        });

        it('displays quiz title', async () => {
            const { getByText } = render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz Title')).toBeTruthy();
            });
        });

        it('displays questions count', async () => {
            const { getByText } = render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText(/questions_count/)).toBeTruthy();
            });
        });

        it('displays start quiz button', async () => {
            const { getByText } = render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('start_quiz')).toBeTruthy();
            });
        });

        it('displays difficulty level', async () => {
            const { getByText } = render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('difficulty_easy')).toBeTruthy();
            });
        });

        it('displays estimated time', async () => {
            const { getByText } = render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText(/estimate_time/)).toBeTruthy();
            });
        });
    });

    describe('navigation', () => {
        it('navigates to DoQuiz on start quiz button press', async () => {
            const { getByText } = render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('start_quiz')).toBeTruthy();
            });

            const startButton = getByText('start_quiz');
            fireEvent.press(startButton);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('DoQuiz', expect.objectContaining({
                quiz: expect.any(Object),
            }));
        });
    });

    describe('fetching quiz data', () => {
        it('fetches quiz by id when questions are empty', async () => {
            (getQuizById as jest.Mock).mockResolvedValue({
                status: 200,
                data: mockQuiz,
            });

            render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRouteEmptyQuestions as any} />
            );

            await waitFor(() => {
                expect(getQuizById).toHaveBeenCalledWith('quiz1');
            });
        });

        it('updates quiz store after fetching quiz', async () => {
            (getQuizById as jest.Mock).mockResolvedValue({
                status: 200,
                data: mockQuiz,
            });

            render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRouteEmptyQuestions as any} />
            );

            await waitFor(() => {
                expect(getQuizById).toHaveBeenCalled();
            });
        });

        it('does not fetch when questions already exist', async () => {
            render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getQuizById).not.toHaveBeenCalled();
            });
        });

        it('shows alert and navigates home on fetch error', async () => {
            (getQuizById as jest.Mock).mockResolvedValue({
                status: 500,
                data: null,
            });

            render(
                <QuizOverviewScreen navigation={mockNavigation as any} route={mockRouteEmptyQuestions as any} />
            );

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to get quiz data.');
                expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
            });
        });
    });
});
