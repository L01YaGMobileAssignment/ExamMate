import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { getDocuments } from '../src/services/docApiService';
import { getAllSchedules } from '../src/services/scheduleService';
import { getUser } from '../src/store/secureStore';
import { useDocStore } from '../src/store/docStore';
import { useScheduleStore } from '../src/store/schedule';
import { useQuizStore } from '../src/store/quizStore';

jest.mock('../src/services/docApiService', () => ({
    getDocuments: jest.fn(),
}));

jest.mock('../src/services/scheduleService', () => ({
    getAllSchedules: jest.fn(),
}));

jest.mock('../src/store/secureStore', () => ({
    getUser: jest.fn(),
}));

const mockNavigation = {
    navigate: jest.fn(),
};

const mockUser = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
};

const mockDocuments = [
    { id: '1', title: 'Doc 1', filename: 'doc1.pdf', fileType: 'pdf', created_at: '2026-01-01' },
    { id: '2', title: 'Doc 2', filename: 'doc2.pdf', fileType: 'pdf', created_at: '2026-01-02' },
];

const mockSchedules = [
    {
        id: 'schedule1',
        title: 'Study Session',
        description: 'Math study',
        start_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        end_date: new Date(Date.now() + 86400000 + 3600000).toISOString(),
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
    },
];

describe('HomeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useDocStore.setState({ docs: [] });
        useScheduleStore.setState({ schedules: [] });
        useQuizStore.setState({ quizzes: [], generatingQuizzes: [] });

        (getUser as jest.Mock).mockResolvedValue(mockUser);
        (getDocuments as jest.Mock).mockResolvedValue({
            status: 200,
            data: mockDocuments,
        });
        (getAllSchedules as jest.Mock).mockResolvedValue({
            status: 200,
            data: mockSchedules,
        });
    });

    describe('rendering', () => {
        it('renders correctly', async () => {
            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('ExamMate')).toBeTruthy();
            });
        });

        it('displays welcome message with username', async () => {
            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText(/hello/i)).toBeTruthy();
                expect(getByText('welcome')).toBeTruthy();
            });
        });

        it('displays quick actions section', async () => {
            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('quick_actions')).toBeTruthy();
                expect(getByText('create_quiz')).toBeTruthy();
                expect(getByText('my_quizzes')).toBeTruthy();
            });
        });

        it('displays recent documents section', async () => {
            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('recent_documents')).toBeTruthy();
            });
        });

        it('displays upcoming sessions section', async () => {
            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('upcoming_sessions')).toBeTruthy();
            });
        });
    });

    describe('data fetching', () => {
        it('fetches user data on mount', async () => {
            render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getUser).toHaveBeenCalled();
            });
        });

        it('fetches documents on mount', async () => {
            render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getDocuments).toHaveBeenCalledWith(1, 8);
            });
        });

        it('fetches schedules on mount', async () => {
            render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getAllSchedules).toHaveBeenCalled();
            });
        });
    });

    describe('empty states', () => {
        it('shows no recent documents message when empty', async () => {
            (getDocuments as jest.Mock).mockResolvedValue({
                status: 200,
                data: [],
            });

            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('no_recent_docs')).toBeTruthy();
            });
        });

        it('shows no upcoming sessions message when empty', async () => {
            (getAllSchedules as jest.Mock).mockResolvedValue({
                status: 200,
                data: [],
            });

            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('no_upcoming_sessions')).toBeTruthy();
            });
        });
    });

    describe('navigation', () => {
        it('navigates to documents tab when create quiz is pressed', async () => {
            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('create_quiz')).toBeTruthy();
            });

            fireEvent.press(getByText('create_quiz'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentsTab', {
                screen: 'Documents'
            });
        });

        it('navigates to view all quizzes when my quizzes is pressed', async () => {
            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('my_quizzes')).toBeTruthy();
            });

            fireEvent.press(getByText('my_quizzes'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('ViewAllQuizzes');
        });

        it('navigates to document detail when document card is pressed', async () => {
            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Doc 1')).toBeTruthy();
            });

            fireEvent.press(getByText('Doc 1'));

            expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', {
                document: expect.objectContaining({ id: '1' })
            });
        });
    });

    describe('generating quizzes', () => {
        it('displays generating quizzes section when quizzes are being generated', async () => {
            useQuizStore.setState({
                quizzes: [],
                generatingQuizzes: [{ documentId: 'doc1', documentTitle: 'Generating Quiz Doc' }],
            });

            const { getByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('generating_quizzes')).toBeTruthy();
                expect(getByText('Generating Quiz Doc')).toBeTruthy();
            });
        });

        it('hides generating quizzes section when no quizzes are being generated', async () => {
            const { queryByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(queryByText('generating_quizzes')).toBeNull();
            });
        });
    });

    describe('upcoming schedules filtering', () => {
        it('shows only schedules within next 3 days', async () => {
            const farFutureSchedule = {
                id: 'schedule2',
                title: 'Far Future Session',
                description: 'Future study',
                start_date: new Date(Date.now() + 10 * 86400000).toISOString(), // 10 days from now
                end_date: new Date(Date.now() + 10 * 86400000 + 3600000).toISOString(),
                created_at: '2026-01-01',
                updated_at: '2026-01-01',
            };

            (getAllSchedules as jest.Mock).mockResolvedValue({
                status: 200,
                data: [...mockSchedules, farFutureSchedule],
            });

            const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Study Session')).toBeTruthy();
                // Far future schedule should not appear
                expect(queryByText('Far Future Session')).toBeNull();
            });
        });
    });
});
