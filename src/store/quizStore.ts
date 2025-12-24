import { create } from "zustand";
import { QuizzesType,QuestionType } from "../types/document";

interface QuizState {
  quizzes: QuizzesType[];
  isLoading: boolean;
  setQuizzes: (quizzes: QuizzesType[]) => void;
  addQuiz: (quiz: QuizzesType) => void;
  removeQuiz: (quizId: string) => void;
  clearQuizzes: () => void;
}

export const useQuizStore = create<QuizState>(set => ({
  quizzes: [],
  isLoading: false,

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
}));
