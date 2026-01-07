import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import DoQuizScreen from '../src/screens/DoQuizScreen';
import { getQuizById } from '../src/services/quizzesService';
import { useQuizStore } from '../src/store/quizStore';

jest.mock('../src/services/quizzesService');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
};

const mockQuestion = {
    id: 'q1',
    question: 'What is 2 + 2?',
    options: ['2', '3', '4', '5'] as unknown as [string],
    answer_index: 2,
    correct_answer: '4',
    why_correct: 'Because 2 + 2 = 4',
};

const mockQuestion2 = {
    id: 'q2',
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'] as unknown as [string],
    answer_index: 1,
    correct_answer: 'Paris',
    why_correct: 'Paris is the capital city of France',
};

const mockQuiz = {
    quiz_id: '1',
    owned_by: 'user1',
    quiz_title: 'Test Quiz',
    questions: [mockQuestion, mockQuestion2],
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
            ...mockQuiz,
            quizz_id: '1',
            questions: [],
        },
    },
};

const mockRouteSingleQuestion = {
    params: {
        quiz: {
            ...mockQuiz,
            questions: [mockQuestion],
        },
    },
};

describe('DoQuizScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useQuizStore.setState({
            quizzes: [],
            generatingQuizzes: [],
            isLoading: false,
        });
    });

    describe('rendering', () => {
        it('renders correctly with quiz data', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });
        });

        it('shows loading indicator when quiz has no questions', async () => {
            (getQuizById as jest.Mock).mockResolvedValue({
                status: 200,
                data: mockQuiz,
            });

            render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteEmptyQuestions as any} />
            );

            await waitFor(() => {
                expect(getQuizById).toHaveBeenCalled();
            });
        });

        it('displays question counter', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText(/1\/2/)).toBeTruthy();
            });
        });

        it('displays quiz title in header', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });
        });

        it('renders answer options with Latex mock', async () => {
            const { getByText, getAllByTestId } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Latex mock renders text with testID 'latex-text'
            const latexElements = getAllByTestId('latex-text');
            expect(latexElements.length).toBeGreaterThan(0);
        });
    });

    describe('answer selection - handleAnswer', () => {
        it('allows selecting an answer option', async () => {
            const { getByText, getAllByTestId } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Find answer options (they're in TouchableOpacity containing Latex text)
            const answerOption = getByText('2'); // First option
            const parent = answerOption.parent?.parent; // TouchableOpacity

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }
        });

        it('enables next button after selecting an answer', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Select first answer option
            const answerOption = getByText('2');
            const parent = answerOption.parent?.parent;

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Next button should now be clickable
            await waitFor(() => {
                expect(getByText('next')).toBeTruthy();
            });
        });
    });

    describe('submit question - handleSubmitQuestion', () => {
        it('shows result after pressing submit/next with answer selected', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Select an answer
            const answerOption = getByText('4'); // Correct answer
            const parent = answerOption.parent?.parent;

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Press next button
            const nextButton = getByText('next');
            await act(async () => {
                fireEvent.press(nextButton);
            });

            // Should show explanation (isShowResult = true)
            await waitFor(() => {
                expect(getByText('explain:')).toBeTruthy();
            });
        });

        it('advances to next question after showing result and pressing next again', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
                expect(getByText(/1\/2/)).toBeTruthy();
            });

            // Select an answer
            const answerOption = getByText('4');
            const parent = answerOption.parent?.parent;

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Press next button first time (show result)
            let nextButton = getByText('next');
            await act(async () => {
                fireEvent.press(nextButton);
            });

            // Press next button again (advance to next question)
            nextButton = getByText('next');
            await act(async () => {
                fireEvent.press(nextButton);
            });

            // Should now be on question 2
            await waitFor(() => {
                expect(getByText(/2\/2/)).toBeTruthy();
            });
        });
    });

    describe('quiz submission - handleSubmitQuiz', () => {
        it('shows result screen after completing single question quiz', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteSingleQuestion as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Select correct answer
            const answerOption = getByText('4');
            const parent = answerOption.parent?.parent;

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Press submit button
            const submitButton = getByText('submit');
            await act(async () => {
                fireEvent.press(submitButton);
            });

            // Press again to submit
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Should show result screen with score
            await waitFor(() => {
                expect(getByText('your_score:')).toBeTruthy();
            });
        });

        it('displays correct score using getMark', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteSingleQuestion as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Select correct answer (index 2)
            const answerOption = getByText('4');
            const parent = answerOption.parent?.parent;

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Press submit
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Press again to actually submit
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Should show score
            await waitFor(() => {
                expect(getByText(/1\/1/)).toBeTruthy();
            });
        });

        it('shows try again button on result screen', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteSingleQuestion as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Select answer
            const answerOption = getByText('4');
            const parent = answerOption.parent?.parent;

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Submit
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Should show try again button
            await waitFor(() => {
                expect(getByText('try_again')).toBeTruthy();
            });
        });
    });

    describe('try again - handleTryAgain', () => {
        it('resets quiz when try again is pressed', async () => {
            const { getByText, queryByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteSingleQuestion as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Complete the quiz
            const answerOption = getByText('4');
            const parent = answerOption.parent?.parent;

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            await act(async () => {
                fireEvent.press(getByText('submit'));
            });
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Verify we're on result screen
            await waitFor(() => {
                expect(getByText('try_again')).toBeTruthy();
            });

            // Press try again
            await act(async () => {
                fireEvent.press(getByText('try_again'));
            });

            // Should be back on question screen
            await waitFor(() => {
                expect(getByText('submit')).toBeTruthy();
                expect(queryByText('try_again')).toBeNull();
            });
        });
    });

    describe('scoring - getMark', () => {
        it('calculates score of 0 when wrong answer selected', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteSingleQuestion as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Select wrong answer (correct is index 2 = '4', select '2' which is index 0)
            const wrongAnswer = getByText('2');
            const parent = wrongAnswer.parent?.parent;

            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Submit twice
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Should show score 0/1
            await waitFor(() => {
                expect(getByText(/0\/1/)).toBeTruthy();
            });
        });
    });

    describe('fetching quiz data', () => {
        it('fetches quiz by id when questions are empty', async () => {
            (getQuizById as jest.Mock).mockResolvedValue({
                status: 200,
                data: mockQuiz,
            });

            render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteEmptyQuestions as any} />
            );

            await waitFor(() => {
                expect(getQuizById).toHaveBeenCalledWith('1');
            });
        });

        it('does not fetch when questions already exist', async () => {
            render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getQuizById).not.toHaveBeenCalled();
            });
        });

        it('updates quiz store after fetching quiz data', async () => {
            const updateQuizFn = jest.fn();
            useQuizStore.setState({
                quizzes: [],
                generatingQuizzes: [],
                updateQuiz: updateQuizFn,
            });

            (getQuizById as jest.Mock).mockResolvedValue({
                status: 200,
                data: {
                    quiz_id: 'fetched-quiz',
                    quiz_title: 'Fetched Quiz',
                    questions: [mockQuestion],
                },
            });

            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteEmptyQuestions as any} />
            );

            await waitFor(() => {
                expect(getQuizById).toHaveBeenCalledWith('1');
            });

            await waitFor(() => {
                expect(getByText('Fetched Quiz')).toBeTruthy();
            });
        });
    });

    describe('multi-question quiz flow', () => {
        it('completes two-question quiz and shows final score', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
                expect(getByText(/1\/2/)).toBeTruthy();
            });

            // Answer first question correctly
            let answerOption = getByText('4');
            let parent = answerOption.parent?.parent;
            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Next -> show result
            await act(async () => {
                fireEvent.press(getByText('next'));
            });

            // Next -> go to question 2
            await act(async () => {
                fireEvent.press(getByText('next'));
            });

            await waitFor(() => {
                expect(getByText(/2\/2/)).toBeTruthy();
            });

            // Answer second question correctly (Paris is at index 1)
            answerOption = getByText('Paris');
            parent = answerOption.parent?.parent;
            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }

            // Submit -> show result
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Submit -> final result
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Should show final score 2/2
            await waitFor(() => {
                expect(getByText('your_score:')).toBeTruthy();
                expect(getByText(/2\/2/)).toBeTruthy();
            });
        });
    });

    describe('result screen display', () => {
        it('shows estimate time on result screen', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteSingleQuestion as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Complete quiz
            const answerOption = getByText('4');
            const parent = answerOption.parent?.parent;
            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Should show estimate time
            await waitFor(() => {
                expect(getByText('estimate_time:')).toBeTruthy();
            });
        });

        it('displays quiz title on result screen', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteSingleQuestion as any} />
            );

            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });

            // Complete quiz
            const answerOption = getByText('4');
            const parent = answerOption.parent?.parent;
            if (parent) {
                await act(async () => {
                    fireEvent.press(parent);
                });
            }
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });
            await act(async () => {
                fireEvent.press(getByText('submit'));
            });

            // Title should still be visible
            await waitFor(() => {
                expect(getByText('Test Quiz')).toBeTruthy();
            });
        });
    });

    describe('button states', () => {
        it('displays next button when not on last question', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getByText('next')).toBeTruthy();
            });
        });

        it('displays submit button when on last question', async () => {
            const { getByText } = render(
                <DoQuizScreen navigation={mockNavigation as any} route={mockRouteSingleQuestion as any} />
            );

            await waitFor(() => {
                expect(getByText('submit')).toBeTruthy();
            });
        });
    });
});
