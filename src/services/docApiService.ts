import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { DocumentType } from "../types/document";
import { AxiosResponse } from "axios";


export const getDocuments = async (page: number = 1, pageSize: number = 8): Promise<AxiosResponse<DocumentType[]>> => {
  const res = await axios.get<DocumentType[]>(apiEndpoints.getDocuments,{
    params: { page, pageSize },
  });
  res.data = res.data.filter((item: DocumentType,index) => {
    return index < pageSize*page && index >= (page - 1) * pageSize;
  });
  return res;
};

export const getDocumentById = async (id: string) => {
  const data = await axios.get<DocumentType>(apiEndpoints.getDocumentById.replace(":id", id.toString()));
  return data;
};

export const getDocumentsByTitleKey = async (title: string): Promise<AxiosResponse<DocumentType[]>> => {
//   const res = await axios.get<DocumentType[]>(apiEndpoints.getDocumentByTitle.replace(":title", title));

  const temp = await getDocuments();
  var res = temp;
  res.data = temp.data.filter((item: DocumentType) => item.title.includes(title));
  return res;
};

export const uploadDocument = async (data: any) => {
  return await axios.post(apiEndpoints.uploadDocument, data);
};

