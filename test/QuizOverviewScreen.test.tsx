import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import QuizOverviewScreen from '../src/screens/QuizOverviewScreen';

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

const mockQuiz = {
    id: '1',
    title: 'Test Quiz',
    description: 'Test Description',
    questions: [],
};

const mockRoute = {
    params: {
        quiz: mockQuiz,
    },
};

describe('QuizOverviewScreen', () => {
    it('renders correctly', async () => {
        const { getByText } = render(<QuizOverviewScreen navigation={mockNavigation as any} route={mockRoute as any} />);
        await waitFor(() => {
            // expect(getByText('start_quiz')).toBeTruthy();
        });
    });
});
