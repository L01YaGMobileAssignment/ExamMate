import { create } from "zustand";
import { QuizzesType, QuestionType } from "../types/document";

interface GeneratingQuiz {
  documentId: string;
  documentTitle: string;
}

interface QuizState {
  quizzes: QuizzesType[];
  generatingQuizzes: GeneratingQuiz[];
  isLoading: boolean;
  setQuizzes: (quizzes: QuizzesType[]) => void;
  addQuiz: (quiz: QuizzesType) => void;
  removeQuiz: (quizId: string) => void;
  clearQuizzes: () => void;
  updateQuiz: (quizId: string, question: QuestionType[]) => void;
  addGeneratingQuiz: (quiz: GeneratingQuiz) => void;
  removeGeneratingQuiz: (documentId: string) => void;
}

export const useQuizStore = create<QuizState>(set => ({
  quizzes: [],
  isLoading: false,

  generatingQuizzes: [],

  setQuizzes: quizzes => set({ quizzes }),

  addQuiz: quiz =>
    set(state => ({
      quizzes: [...state.quizzes, quiz],
    })),

  removeQuiz: quizId =>
    set(state => ({
      quizzes: state.quizzes.filter(item => item.quiz_id !== quizId),
    })),

  clearQuizzes: () =>
    set(state => ({
      quizzes: [],
    })),
  updateQuiz: (quizId: string, questions: QuestionType[]) =>
    set(state => ({
      quizzes: state.quizzes.map(item => {
        if (item.quiz_id === quizId) {
          return { ...item, questions };
        }
        return item;
      }),
    })),

  addGeneratingQuiz: (quiz) =>
    set(state => ({
      generatingQuizzes: [...state.generatingQuizzes, quiz]
    })),

  removeGeneratingQuiz: (documentId) =>
    set(state => ({
      generatingQuizzes: state.generatingQuizzes.filter(item => item.documentId !== documentId)
    })),
}));
