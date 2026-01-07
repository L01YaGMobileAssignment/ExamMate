import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { AxiosResponse } from "axios";
import { QuizzesType } from "../types/document";
import { useQuizStore } from "../store/quizStore";
import * as Sentry from "@sentry/react-native";

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
    Sentry.captureException(error, {
      tags: { api: "getQuizById" },
      extra: { quizId: id },
    });
    throw error;
  }
};

export const generateQuiz = async (document_id: string, numberOfQuestions: number = 20): Promise<AxiosResponse<QuizzesType>> => {
  return Sentry.startSpan(
    {
      name: "generateQuiz API",
      op: "http.client",
      attributes: { document_id, numberOfQuestions }
    },
    async (span) => {
      try {
        const res = await axios.post(apiEndpoints.genQuiz, {
          document_id: document_id,
          num_questions: numberOfQuestions
        });
        span.setStatus({ code: 1, message: "ok" }); // SpanStatusCode.OK = 1
        return res;
      } catch (error) {
        span.setStatus({ code: 2, message: "error" }); // SpanStatusCode.ERROR = 2
        Sentry.captureException(error, {
          tags: { api: "generateQuiz" },
          extra: { document_id, numberOfQuestions },
        });
        throw error;
      }
    }
  );
};

export const getQuizByTitle = async (title: string): Promise<AxiosResponse<QuizzesType[]>> => {
  const res = await axios.get<QuizzesType[]>(apiEndpoints.searchQuizzes, { params: { q: title } });
  return res;
}
