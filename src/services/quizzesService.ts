import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { AxiosResponse } from "axios";
import { QuizzesType } from "../types/document";
import { useQuizStore } from "../store/quizStore";

export const getQuizzes = async (currentPage: number, pageSize: number, refresh: boolean = false): Promise<AxiosResponse<QuizzesType[]>> => {
  const quizzes = useQuizStore.getState().quizzes;
  if (refresh || quizzes.length === 0) {
    const res = await axios.get<QuizzesType[]>(apiEndpoints.getAllQuizzes);
    useQuizStore.getState().setQuizzes(res.data);
    return res;
  } else {
    const res = {
      status: 200,
      data: quizzes,
    };
    // @ts-ignore
    return res;
  }
};

export const getQuizById = async (id: string): Promise<AxiosResponse<QuizzesType>> => {
  try {
    const res = await axios.get<QuizzesType>(apiEndpoints.getQuizById.replace(":id", id));
    return res;
  } catch (error) {
    return error;
  }
};

export const generateQuiz = async (document_id: string, numberOfQuestions: number = 20): Promise<AxiosResponse<QuizzesType>> => {
  const res = await axios.post(apiEndpoints.genQuiz, { document_id: document_id, num_questions: numberOfQuestions });
  return res;
};

export const getQuizByTitle = async (title: string): Promise<AxiosResponse<QuizzesType[]>> => {
  const res = await axios.get<QuizzesType[]>(apiEndpoints.searchQuizzes, { params: { q: title } });
  return res;
}