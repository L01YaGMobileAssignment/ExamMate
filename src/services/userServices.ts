import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { UserType } from "../types/user";
import { AxiosResponse } from "axios";

export const getUserInfor = async (): Promise<AxiosResponse<UserType>> => {
  const res = await axios.get<UserType>(apiEndpoints.getUserInfor);
  return res;
};

export const changeLanguage = async (language: string): Promise<AxiosResponse<string>> => {
  const res = await axios.put<string>(apiEndpoints.changeLanguyege, {}, {
    params: { language: language }
  });
  return res;
}