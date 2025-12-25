import { create } from "zustand";
import { ScheduleType } from "../types/schedule";

interface ScheduleState {
    schedules: ScheduleType[];
    isLoading: boolean;
    setSchedules: (schedules: ScheduleType[]) => void;
    addSchedule: (schedule: ScheduleType) => void;
    removeSchedule: (scheduleId: string) => void;
    updateSchedule: (scheduleId: string, schedule: ScheduleType) => void;
    clearSchedules: () => void;
}

export const useScheduleStore = create<ScheduleState>(set => ({
    schedules: [],
    isLoading: false,

    setSchedules: schedules => set({ schedules }),

    addSchedule: schedule =>
        set(state => {
            const newSchedules = [...state.schedules, schedule];
            return { schedules: newSchedules };
        }),

    removeSchedule: scheduleId =>
        set(state => ({
            schedules: state.schedules.filter(item => item.id !== scheduleId),
        })),
    updateSchedule: (scheduleId: string, schedule: ScheduleType) => {
        set(state => ({
            schedules: state.schedules.map(item => {
                if (item.id === scheduleId) {
                    return { ...item, ...schedule };
                }
                return item;
            }),
        }));
    },
    clearSchedules: () =>
        set(state => ({
            schedules: [],
        })),
}));