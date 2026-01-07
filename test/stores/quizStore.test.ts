import { useQuizStore } from '../../src/store/quizStore';
import { QuizzesType, QuestionType } from '../../src/types/document';

describe('quizStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useQuizStore.setState({
            quizzes: [],
            generatingQuizzes: [],
            isLoading: false,
        });
    });

    const mockQuestion: QuestionType = {
        id: 'q1',
        question: 'Test Question?',
        options: ['A', 'B', 'C', 'D'] as unknown as [string],
        answer_index: 0,
        correct_answer: 'A',
        why_correct: 'Because A is correct',
    };

    const mockQuiz: QuizzesType = {
        quiz_id: 'quiz1',
        owned_by: 'user1',
        quiz_title: 'Test Quiz',
        questions: [mockQuestion],
        created_at: '2026-01-01',
    };

    describe('setQuizzes', () => {
        it('should set quizzes array', () => {
            const quizzes = [mockQuiz];
            useQuizStore.getState().setQuizzes(quizzes);

            expect(useQuizStore.getState().quizzes).toEqual(quizzes);
        });

        it('should replace existing quizzes', () => {
            useQuizStore.setState({ quizzes: [mockQuiz] });

            const newQuiz: QuizzesType = { ...mockQuiz, quiz_id: 'quiz2', quiz_title: 'New Quiz' };
            useQuizStore.getState().setQuizzes([newQuiz]);

            expect(useQuizStore.getState().quizzes).toHaveLength(1);
            expect(useQuizStore.getState().quizzes[0].quiz_id).toBe('quiz2');
        });
    });

    describe('addQuiz', () => {
        it('should add a new quiz to the list', () => {
            useQuizStore.getState().addQuiz(mockQuiz);

            expect(useQuizStore.getState().quizzes).toHaveLength(1);
            expect(useQuizStore.getState().quizzes[0]).toEqual(mockQuiz);
        });

        it('should append quiz to existing quizzes', () => {
            useQuizStore.setState({ quizzes: [mockQuiz] });

            const newQuiz: QuizzesType = { ...mockQuiz, quiz_id: 'quiz2' };
            useQuizStore.getState().addQuiz(newQuiz);

            expect(useQuizStore.getState().quizzes).toHaveLength(2);
        });
    });

    describe('removeQuiz', () => {
        it('should remove a quiz by id', () => {
            useQuizStore.setState({ quizzes: [mockQuiz] });

            useQuizStore.getState().removeQuiz('quiz1');

            expect(useQuizStore.getState().quizzes).toHaveLength(0);
        });

        it('should not remove anything if quiz id not found', () => {
            useQuizStore.setState({ quizzes: [mockQuiz] });

            useQuizStore.getState().removeQuiz('nonexistent');

            expect(useQuizStore.getState().quizzes).toHaveLength(1);
        });
    });

    describe('clearQuizzes', () => {
        it('should clear all quizzes', () => {
            useQuizStore.setState({ quizzes: [mockQuiz, { ...mockQuiz, quiz_id: 'quiz2' }] });

            useQuizStore.getState().clearQuizzes();

            expect(useQuizStore.getState().quizzes).toHaveLength(0);
        });
    });

    describe('updateQuiz', () => {
        it('should update questions for a specific quiz', () => {
            useQuizStore.setState({ quizzes: [mockQuiz] });

            const newQuestions: QuestionType[] = [
                { ...mockQuestion, id: 'q2', question: 'Updated Question?' },
            ];

            useQuizStore.getState().updateQuiz('quiz1', newQuestions);

            expect(useQuizStore.getState().quizzes[0].questions).toEqual(newQuestions);
        });

        it('should not update if quiz id not found', () => {
            useQuizStore.setState({ quizzes: [mockQuiz] });

            const newQuestions: QuestionType[] = [
                { ...mockQuestion, id: 'q2', question: 'Updated Question?' },
            ];

            useQuizStore.getState().updateQuiz('nonexistent', newQuestions);

            expect(useQuizStore.getState().quizzes[0].questions).toEqual([mockQuestion]);
        });
    });

    describe('addGeneratingQuiz', () => {
        it('should add a generating quiz', () => {
            const generatingQuiz = { documentId: 'doc1', documentTitle: 'Doc Title' };

            useQuizStore.getState().addGeneratingQuiz(generatingQuiz);

            expect(useQuizStore.getState().generatingQuizzes).toHaveLength(1);
            expect(useQuizStore.getState().generatingQuizzes[0]).toEqual(generatingQuiz);
        });
    });

    describe('removeGeneratingQuiz', () => {
        it('should remove a generating quiz by document id', () => {
            useQuizStore.setState({
                generatingQuizzes: [{ documentId: 'doc1', documentTitle: 'Doc Title' }],
            });

            useQuizStore.getState().removeGeneratingQuiz('doc1');

            expect(useQuizStore.getState().generatingQuizzes).toHaveLength(0);
        });

        it('should not remove if document id not found', () => {
            useQuizStore.setState({
                generatingQuizzes: [{ documentId: 'doc1', documentTitle: 'Doc Title' }],
            });

            useQuizStore.getState().removeGeneratingQuiz('nonexistent');

            expect(useQuizStore.getState().generatingQuizzes).toHaveLength(1);
        });
    });
});
