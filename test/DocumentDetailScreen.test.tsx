import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import DocumentDetailScreen from '../src/screens/DocumentDetailScreen';
import { generateQuiz } from '../src/services/quizzesService';
import { removeDocument } from '../src/services/docApiService';
import { Alert } from 'react-native';
import { useQuizStore } from '../src/store/quizStore';

// Mock services
jest.mock('../src/services/quizzesService', () => ({
    generateQuiz: jest.fn(),
}));

jest.mock('../src/services/docApiService', () => ({
    ...jest.requireActual('../src/services/docApiService'),
    removeDocument: jest.fn(),
    getDocumentById: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
    getDocumentSummary: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
    viewFullDocument: jest.fn(),
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

const mockRoute = {
    params: {
        document: mockDocument,
    },
};

describe('DocumentDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useQuizStore.setState({ quizzes: [] });
    });

    it('renders correctly', () => {
        const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);
        expect(getByText('Test Document')).toBeTruthy();
        expect(getByText('generate_quiz')).toBeTruthy();
        expect(getByText('remove')).toBeTruthy();
        expect(getByText('download')).toBeTruthy();
    });

    it('handles create quiz', async () => {
        (generateQuiz as jest.Mock).mockResolvedValue({
            status: 200,
            data: { id: 'quiz1', questions: [] }
        });

        const { getByText } = render(<DocumentDetailScreen navigation={mockNavigation as any} route={mockRoute as any} />);

        const generateBtn = getByText('generate_quiz');
        fireEvent.press(generateBtn);

        await waitFor(() => {
            expect(generateQuiz).toHaveBeenCalledWith('1', expect.any(Number)); // ID and numQuestions
            expect(mockNavigation.navigate).toHaveBeenCalledWith("Main", expect.objectContaining({
                params: expect.objectContaining({
                    screen: "QuizOverview",
                })
            }));
        });
    });

    it('handles remove document', async () => {
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
});

