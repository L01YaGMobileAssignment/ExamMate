import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LandingScreen from '../src/screens/LandingScreen';

// Mock navigation
const mockNavigation = {
    navigate: jest.fn(),
};

describe('LandingScreen', () => {
    it('renders correctly', () => {
        const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
        expect(getByText('landing_slogan')).toBeTruthy();
        expect(getByText('landing_headline')).toBeTruthy();
    });

    it('navigates to Login on button press', async () => {
        const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
        const button = getByText('landing_join_now');
        fireEvent.press(button);
        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
        });
    });
});
