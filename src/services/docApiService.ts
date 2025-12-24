import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { DocumentType, QuizzesType } from "../types/document";
import { AxiosResponse } from "axios";

export const getDocuments = async (
  page: number = 1,
  pageSize: number = 8
): Promise<AxiosResponse<DocumentType[]>> => {

  var res: AxiosResponse<DocumentType[]>;
  const documents = useDocStore.getState().docs;
  if (documents.length === 0) {
    res = await axios.get<DocumentType[]>(apiEndpoints.getDocuments, {
      params: { page, pageSize },
    });
    useDocStore.getState().setDocs(res.data);
    return res;
  } else {
    res = {
      status: 200,
      data: documents,
    };
    return res;
  }

};

export const getDocumentById = async (id: string) => {
  const data = await axios.get<DocumentType>(
    apiEndpoints.getDocumentById.replace(":id", id.toString())
  );
  return data;
};

export const getDocumentsByTitleKey = async (
  title: string
): Promise<AxiosResponse<DocumentType[]>> => {
  // var res = await axios.get<DocumentType[]>(apiEndpoints.getDocuments);
  // const filtered = res.data.filter(item => {
  //     if (!item.title && !item.filename) return false;
  //     return item?.title?.toLowerCase().includes(title.toLowerCase()) || item?.filename?.toLowerCase().includes(title.toLowerCase());
  // });
  // res.data = filtered;
  const res = await axios.get<DocumentType[]>(apiEndpoints.searchDocumentByKey, { params: { q: title } });
  return res;
};

import { getToken } from "../store/secureStore";
import { useDocStore } from "../store/docStore";

export const uploadDocument = async (data: any) => {
  const token = await getToken();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";
  const url = `${baseUrl}${apiEndpoints.uploadDocument}`;

  const headers: any = {
    // "ngrok-skip-browser-warning": "true",
    "Accept": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: data,
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error: any = new Error(responseData.message || "Upload failed");
    error.response = {
      status: response.status,
      data: responseData,
    };
    throw error;
  }

  return {
    status: response.status,
    data: responseData,
  };
};

export const getDocumentSummary = async (id: string) => {
  const res = await axios.post<DocumentType>(apiEndpoints.summaryDocument.replace(":id", id));
  return res;
};

export const removeDocument = async (quizId: string) => {
  const res = await axios.delete(apiEndpoints.getDocumentById.replace(":id", quizId));
  return res;
};

export const viewFullDocument = async (id: string) => {
  const res = await axios.get(apiEndpoints.downloadDocument.replace(":id", id), {
    responseType: "blob",
  });
  return res;
};

export const deleteDocument = async (id: string) => {
  const res = await axios.delete(apiEndpoints.deleteDocument.replace(":id", id));
  return res;
};

export const downloadDocument = async (id: string) => {
  const res = await axios.get(apiEndpoints.downloadDocument.replace(":id", id));
  return res;
};