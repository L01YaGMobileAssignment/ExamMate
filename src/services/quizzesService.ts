import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { AxiosResponse } from "axios";
import { QuizzesType } from "../types/document";
import { useQuizStore } from "../store/quizStore";

export const getQuizzes = async (currentPage: number, pageSize: number): Promise<AxiosResponse<QuizzesType[]>> => {
  const quizzes = useQuizStore.getState().quizzes;
  if (quizzes.length === 0) {
    const res = await axios.get<QuizzesType[]>(apiEndpoints.getAllQuizzes);
    useQuizStore.getState().setQuizzes(res.data);
    return res;
  } else {
    const res = {
      status: 200,
      data: quizzes,
    };
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

export const generateQuiz = async (document_id: string): Promise<AxiosResponse<QuizzesType>> => {
  const res = await axios.post(apiEndpoints.genQuiz, { document_id: document_id });
  return res;
};

export const getQuizByTitle = async (title: string): Promise<AxiosResponse<QuizzesType[]>> => {
  // const res = await axios.get(apiEndpoints.getQuizByTitle.replace(":title", title));
  // var res = await axios.get<QuizzesType[]>(apiEndpoints.getAllQuizzes);
  // const filtered = res.data.filter(item => {
  //     if (!item.quiz_id || !item.quiz_title) return false;
  //     return item?.quiz_title?.toLowerCase().includes(title.toLowerCase());
  // });
  // res.data = filtered;
  const res = await axios.get<QuizzesType[]>(apiEndpoints.searchQuizzes,{params:{q:title}});
  return res;
}