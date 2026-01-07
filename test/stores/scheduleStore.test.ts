import { useScheduleStore } from '../../src/store/schedule';
import { ScheduleType } from '../../src/types/schedule';

describe('scheduleStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useScheduleStore.setState({
            schedules: [],
            isLoading: false,
        });
    });

    const mockSchedule: ScheduleType = {
        id: 'schedule1',
        title: 'Test Schedule',
        description: 'Test Description',
        start_date: '2026-01-07T10:00:00Z',
        end_date: '2026-01-07T11:00:00Z',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
    };

    describe('setSchedules', () => {
        it('should set schedules array', () => {
            const schedules = [mockSchedule];
            useScheduleStore.getState().setSchedules(schedules);

            expect(useScheduleStore.getState().schedules).toEqual(schedules);
        });

        it('should replace existing schedules', () => {
            useScheduleStore.setState({ schedules: [mockSchedule] });

            const newSchedule: ScheduleType = { ...mockSchedule, id: 'schedule2', title: 'New Schedule' };
            useScheduleStore.getState().setSchedules([newSchedule]);

            expect(useScheduleStore.getState().schedules).toHaveLength(1);
            expect(useScheduleStore.getState().schedules[0].id).toBe('schedule2');
        });
    });

    describe('addSchedule', () => {
        it('should add a new schedule to the list', () => {
            useScheduleStore.getState().addSchedule(mockSchedule);

            expect(useScheduleStore.getState().schedules).toHaveLength(1);
            expect(useScheduleStore.getState().schedules[0]).toEqual(mockSchedule);
        });

        it('should append schedule to existing schedules', () => {
            useScheduleStore.setState({ schedules: [mockSchedule] });

            const newSchedule: ScheduleType = { ...mockSchedule, id: 'schedule2' };
            useScheduleStore.getState().addSchedule(newSchedule);

            expect(useScheduleStore.getState().schedules).toHaveLength(2);
        });
    });

    describe('removeSchedule', () => {
        it('should remove a schedule by id', () => {
            useScheduleStore.setState({ schedules: [mockSchedule] });

            useScheduleStore.getState().removeSchedule('schedule1');

            expect(useScheduleStore.getState().schedules).toHaveLength(0);
        });

        it('should not remove anything if schedule id not found', () => {
            useScheduleStore.setState({ schedules: [mockSchedule] });

            useScheduleStore.getState().removeSchedule('nonexistent');

            expect(useScheduleStore.getState().schedules).toHaveLength(1);
        });

        it('should remove only the matching schedule from multiple', () => {
            const schedule2: ScheduleType = { ...mockSchedule, id: 'schedule2' };
            useScheduleStore.setState({ schedules: [mockSchedule, schedule2] });

            useScheduleStore.getState().removeSchedule('schedule1');

            expect(useScheduleStore.getState().schedules).toHaveLength(1);
            expect(useScheduleStore.getState().schedules[0].id).toBe('schedule2');
        });
    });

    describe('updateSchedule', () => {
        it('should update a schedule by id', () => {
            useScheduleStore.setState({ schedules: [mockSchedule] });

            const updatedSchedule: ScheduleType = {
                ...mockSchedule,
                title: 'Updated Title',
                description: 'Updated Description'
            };

            useScheduleStore.getState().updateSchedule('schedule1', updatedSchedule);

            expect(useScheduleStore.getState().schedules[0].title).toBe('Updated Title');
            expect(useScheduleStore.getState().schedules[0].description).toBe('Updated Description');
        });

        it('should not update if schedule id not found', () => {
            useScheduleStore.setState({ schedules: [mockSchedule] });

            const updatedSchedule: ScheduleType = {
                ...mockSchedule,
                title: 'Updated Title'
            };

            useScheduleStore.getState().updateSchedule('nonexistent', updatedSchedule);

            expect(useScheduleStore.getState().schedules[0].title).toBe('Test Schedule');
        });

        it('should update only matching schedule from multiple', () => {
            const schedule2: ScheduleType = { ...mockSchedule, id: 'schedule2', title: 'Schedule 2' };
            useScheduleStore.setState({ schedules: [mockSchedule, schedule2] });

            const updatedSchedule: ScheduleType = { ...mockSchedule, title: 'Updated Title' };
            useScheduleStore.getState().updateSchedule('schedule1', updatedSchedule);

            expect(useScheduleStore.getState().schedules[0].title).toBe('Updated Title');
            expect(useScheduleStore.getState().schedules[1].title).toBe('Schedule 2');
        });
    });

    describe('clearSchedules', () => {
        it('should clear all schedules', () => {
            useScheduleStore.setState({
                schedules: [mockSchedule, { ...mockSchedule, id: 'schedule2' }]
            });

            useScheduleStore.getState().clearSchedules();

            expect(useScheduleStore.getState().schedules).toHaveLength(0);
        });

        it('should work when schedules is already empty', () => {
            useScheduleStore.getState().clearSchedules();

            expect(useScheduleStore.getState().schedules).toHaveLength(0);
        });
    });
});
