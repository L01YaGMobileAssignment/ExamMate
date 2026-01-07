import React from 'react';
import { render } from '@testing-library/react-native';
import DoQuizScreen from '../src/screens/DoQuizScreen';

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
};

const mockQuiz = {
    id: '1',
    title: 'Test Quiz',
    questions: [
        {
            id: 'q1',
            question: 'Question 1?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            answer: 'Option A',
        },
    ],
};

const mockRoute = {
    params: {
        quiz: mockQuiz,
    },
};

describe('DoQuizScreen', () => {
    it('renders correctly', () => {
        const { getByText } = render(<DoQuizScreen navigation={mockNavigation as any} route={mockRoute as any} />);
    });
});
