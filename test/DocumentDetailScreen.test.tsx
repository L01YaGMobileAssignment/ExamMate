import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';
import DocumentDetailScreen from '../src/screens/DocumentDetailScreen';
import { generateQuiz } from '../src/services/quizzesService';
import { removeDocument, getDocumentById, getDocumentSummary, viewFullDocument } from '../src/services/docApiService';
import { useQuizStore } from '../src/store/quizStore';
import { useDocStore } from '../src/store/docStore';
import * as Sharing from 'expo-sharing';

// Mock services
jest.mock('../src/services/quizzesService', () => ({
    generateQuiz: jest.fn(),
}));

jest.mock('../src/services/docApiService', () => ({
    removeDocument: jest.fn(),
    getDocumentById: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
    getDocumentSummary: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
    viewFullDocument: jest.fn(() => Promise.resolve({
        status: 200,
        data: new Blob(['test']),
        headers: { 'content-type': 'application/pdf' }
    })),
}));

jest.mock('expo-sharing', () => ({
    isAvailableAsync: jest.fn(() => Promise.resolve(true)),
    shareAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-file-system/legacy', () => ({
    cacheDirectory: '/cache/',
    writeAsStringAsync: jest.fn(() => Promise.resolve()),
}));

jest.spyOn(Alert, 'alert');

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

const mockDocument = {
    id: '1',
    title: 'Test Document',
    content: 'Test Content',
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    user_id: 'user1',
    fileType: 'pdf',
    filename: 'test.pdf',
    summary: 'Summary',
    questions: [],
};

const mockDocumentNoSummary = {
    ...mockDocument,
    summary: null,
};

const mockRoute = {
    params: {
        document: mockDocument,
    },
};

const mockRouteNoSummary = {
    params: {
        document: mockDocumentNoSummary,
    },
};

describe('DocumentDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useQuizStore.setState({
            quizzes: [],
            generatingQuizzes: [],
        });
        useDocStore.setState({
            docs: [],
        });
        // Reset Platform to native
        Platform.OS = 'ios';
    });

    describe('rendering', () => {
        it('renders correctly with document data', () => {
            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
            expect(getByText('Test Document')).toBeTruthy();
            expect(getByText('generate_quiz')).toBeTruthy();
            expect(getByText('remove')).toBeTruthy();
            expect(getByText('download')).toBeTruthy();
        });

        it('displays document summary when available', () => {
            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
            expect(getByText('Test Document')).toBeTruthy();
        });

        it('shows loading state when summary is not available', async () => {
            (getDocumentById as jest.Mock).mockResolvedValue({
                status: 200,
                data: { ...mockDocumentNoSummary, summary: null }
            });
            (getDocumentSummary as jest.Mock).mockResolvedValue({
                status: 200,
                data: { ...mockDocument, summary: 'Generated Summary' }
            });

            const { getByText } = render(
                <DocumentDetailScreen navigation={mockNavigation as any} route={mockRouteNoSummary as any} />
            );

            await waitFor(() => {
                expect(getDocumentById).toHaveBeenCalledWith('1');
            });
        });
    });

    describe('quiz generation', () => {
        it('handles successful quiz generation', async () => {
            (generateQuiz as jest.Mock).mockResolvedValue({
                status: 200,
                data: { quiz_id: 'quiz1', questions: [] }
            });

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const generateBtn = getByText('generate_quiz');
            fireEvent.press(generateBtn);

            await waitFor(() => {
                expect(generateQuiz).toHaveBeenCalledWith('1', expect.any(Number));
                expect(mockNavigation.navigate).toHaveBeenCalledWith("Main", expect.objectContaining({
                    params: expect.objectContaining({
                        screen: "QuizOverview",
                    })
                }));
            });
        });

        it('handles quiz generation error', async () => {
            (generateQuiz as jest.Mock).mockRejectedValue(new Error('Generation failed'));

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const generateBtn = getByText('generate_quiz');
            fireEvent.press(generateBtn);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('error', expect.any(String));
            });
        });

        it('adds generating quiz to store during generation', async () => {
            (generateQuiz as jest.Mock).mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve({ status: 200, data: { quiz_id: 'quiz1', questions: [] } }), 100))
            );

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const generateBtn = getByText('generate_quiz');
            fireEvent.press(generateBtn);

            await waitFor(() => {
                expect(generateQuiz).toHaveBeenCalled();
            });
        });

        it('adds quiz to store after successful generation', async () => {
            const addQuizMock = jest.fn();
            useQuizStore.setState({
                quizzes: [],
                generatingQuizzes: [],
                addQuiz: addQuizMock,
            });

            (generateQuiz as jest.Mock).mockResolvedValue({
                status: 200,
                data: { quiz_id: 'quiz1', questions: [] }
            });

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            fireEvent.press(getByText('generate_quiz'));

            await waitFor(() => {
                expect(generateQuiz).toHaveBeenCalled();
            });
        });
    });

    describe('document removal', () => {
        it('shows confirmation dialog on remove press', () => {
            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const removeBtn = getByText('remove');
            fireEvent.press(removeBtn);

            expect(Alert.alert).toHaveBeenCalled();
        });

        it('handles successful document removal', async () => {
            (removeDocument as jest.Mock).mockResolvedValue({ status: 200 });

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const removeBtn = getByText('remove');
            fireEvent.press(removeBtn);

            expect(Alert.alert).toHaveBeenCalled();

            const alertCalls = (Alert.alert as jest.Mock).mock.calls;
            const buttons = alertCalls[0][2];
            const deleteConfirmButton = buttons.find((btn: any) => btn.style === 'destructive');

            await act(async () => {
                await deleteConfirmButton.onPress();
            });

            await waitFor(() => {
                expect(removeDocument).toHaveBeenCalledWith('1');
                expect(mockNavigation.navigate).toHaveBeenCalledWith("Documents");
            });
        });

        it('handles document removal error', async () => {
            (removeDocument as jest.Mock).mockRejectedValue(new Error('Delete failed'));

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const removeBtn = getByText('remove');
            fireEvent.press(removeBtn);

            const alertCalls = (Alert.alert as jest.Mock).mock.calls;
            const buttons = alertCalls[0][2];
            const deleteConfirmButton = buttons.find((btn: any) => btn.style === 'destructive');

            await act(async () => {
                await deleteConfirmButton.onPress();
            });

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('error', 'Failed to delete document');
            });
        });

        it('allows canceling document removal', () => {
            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const removeBtn = getByText('remove');
            fireEvent.press(removeBtn);

            const alertCalls = (Alert.alert as jest.Mock).mock.calls;
            const buttons = alertCalls[0][2];
            const cancelButton = buttons.find((btn: any) => btn.style === 'cancel');

            expect(cancelButton).toBeDefined();
        });

        it('removes doc from store after successful removal', async () => {
            const removeDocMock = jest.fn();
            useDocStore.setState({
                docs: [mockDocument],
                removeDoc: removeDocMock,
            });

            (removeDocument as jest.Mock).mockResolvedValue({ status: 200 });

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            fireEvent.press(getByText('remove'));

            const alertCalls = (Alert.alert as jest.Mock).mock.calls;
            const buttons = alertCalls[0][2];
            const deleteConfirmButton = buttons.find((btn: any) => btn.style === 'destructive');

            await act(async () => {
                await deleteConfirmButton.onPress();
            });

            await waitFor(() => {
                expect(removeDocument).toHaveBeenCalledWith('1');
            });
        });
    });

    describe('document download', () => {
        it('initiates download on button press', async () => {
            (viewFullDocument as jest.Mock).mockResolvedValue({
                status: 200,
                data: new Blob(['test content']),
                headers: { 'content-type': 'application/pdf' }
            });

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const downloadBtn = getByText('download');
            fireEvent.press(downloadBtn);

            await waitFor(() => {
                expect(viewFullDocument).toHaveBeenCalledWith('1');
            });
        });

        it('handles download error', async () => {
            (viewFullDocument as jest.Mock).mockRejectedValue(new Error('Download failed'));

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const downloadBtn = getByText('download');
            fireEvent.press(downloadBtn);

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('error', 'download_fail');
            });
        });

        it('handles native platform download with file sharing', async () => {
            Platform.OS = 'ios';

            const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
            (viewFullDocument as jest.Mock).mockResolvedValue({
                status: 200,
                data: mockBlob,
                headers: { 'content-type': 'application/pdf' }
            });

            (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
            (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const downloadBtn = getByText('download');
            fireEvent.press(downloadBtn);

            await waitFor(() => {
                expect(viewFullDocument).toHaveBeenCalledWith('1');
            });
        });

        it('shows error when sharing is not available', async () => {
            Platform.OS = 'ios';

            const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
            (viewFullDocument as jest.Mock).mockResolvedValue({
                status: 200,
                data: mockBlob,
                headers: { 'content-type': 'application/pdf' }
            });

            (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            const downloadBtn = getByText('download');
            fireEvent.press(downloadBtn);

            await waitFor(() => {
                expect(viewFullDocument).toHaveBeenCalledWith('1');
            });
        });
    });

    describe('summary fetching', () => {
        it('fetches summary when document has no summary', async () => {
            (getDocumentById as jest.Mock).mockResolvedValue({
                status: 200,
                data: { ...mockDocumentNoSummary, summary: null }
            });
            (getDocumentSummary as jest.Mock).mockResolvedValue({
                status: 200,
                data: { ...mockDocument, summary: 'New Summary' }
            });

            render(
                <DocumentDetailScreen navigation={mockNavigation as any} route={mockRouteNoSummary as any} />
            );

            await waitFor(() => {
                expect(getDocumentById).toHaveBeenCalledWith('1');
                expect(getDocumentSummary).toHaveBeenCalledWith('1');
            });
        });

        it('does not fetch summary when document already has summary', async () => {
            render(
                <DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />
            );

            await waitFor(() => {
                expect(getDocumentById).not.toHaveBeenCalled();
            });
        });

        it('sets document from getDocumentById response if summary exists', async () => {
            (getDocumentById as jest.Mock).mockResolvedValue({
                status: 200,
                data: { ...mockDocument, summary: 'Existing Summary' }
            });

            render(
                <DocumentDetailScreen navigation={mockNavigation as any} route={mockRouteNoSummary as any} />
            );

            await waitFor(() => {
                expect(getDocumentById).toHaveBeenCalledWith('1');
                expect(getDocumentSummary).not.toHaveBeenCalled();
            });
        });
    });

    describe('loading states', () => {
        it('shows loading indicator during quiz generation', async () => {
            (generateQuiz as jest.Mock).mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve({ status: 200, data: { quiz_id: 'quiz1', questions: [] } }), 1000))
            );

            const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

            fireEvent.press(getByText('generate_quiz'));

            // Should show loading state (button text changes to "generating")
            await waitFor(() => {
                expect(getByText('generating')).toBeTruthy();
            });
        });
    });
});
