import axios from "./api";
import { apiEndpoints } from "./endpoints";
import { AxiosResponse } from "axios";
import { ScheduleType } from "../types/schedule";
import { useScheduleStore } from "../store/schedule";

export const getAllSchedules = async (): Promise<AxiosResponse<ScheduleType[]>> => {
  // const schedules = useScheduleStore.getState().schedules;
  const res = await axios.get<ScheduleType[]>(apiEndpoints.getAllSchedules);
  return res;
};

export const createSchedule = async (data: ScheduleType): Promise<AxiosResponse<ScheduleType>> => {
  const res = await axios.post<ScheduleType>(apiEndpoints.createSchedule, data);
  return res;
};

export const getScheduleById = async (id: string): Promise<AxiosResponse<ScheduleType>> => {
  const res = await axios.get<ScheduleType>(apiEndpoints.getScheduleById.replace(":id", id));
  return res;
};

export const updateScheduleById = async (id: string, data: ScheduleType): Promise<AxiosResponse<ScheduleType>> => {
  const res = await axios.put<ScheduleType>(apiEndpoints.updateScheduleById.replace(":id", id), data);
  return res;
};

export const deleteScheduleById = async (id: string): Promise<AxiosResponse<ScheduleType>> => {
  const res = await axios.delete<ScheduleType>(apiEndpoints.deleteScheduleById.replace(":id", id));
  return res;
};