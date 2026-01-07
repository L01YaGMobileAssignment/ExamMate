import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import LandingScreen from '../src/screens/LandingScreen';
import { saveIsFirstUse } from '../src/store/secureStore';

// Mock saveIsFirstUse
jest.mock('../src/store/secureStore', () => ({
    saveIsFirstUse: jest.fn(() => Promise.resolve()),
}));

// Mock Linking
jest.spyOn(Linking, 'canOpenURL').mockImplementation(() => Promise.resolve(true));
jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());

const mockNavigation = {
    navigate: jest.fn(),
};

describe('LandingScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('rendering', () => {
        it('renders correctly', () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            expect(getByText('landing_slogan')).toBeTruthy();
            expect(getByText('landing_headline')).toBeTruthy();
        });

        it('displays hero subline', () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            expect(getByText('landing_subline')).toBeTruthy();
        });

        it('displays problem section', () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            expect(getByText('landing_problem_title')).toBeTruthy();
            expect(getByText('landing_problem_desc')).toBeTruthy();
        });

        it('displays feature section title', () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            expect(getByText('landing_feature_title')).toBeTruthy();
        });

        it('displays feature items', () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            expect(getByText('landing_feature_1_title')).toBeTruthy();
            expect(getByText('landing_feature_2_title')).toBeTruthy();
            expect(getByText('landing_feature_3_title')).toBeTruthy();
            expect(getByText('landing_feature_4_title')).toBeTruthy();
        });

        it('displays showcase section', () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            expect(getByText('landing_showcase_title')).toBeTruthy();
            expect(getByText('landing_showcase_desc')).toBeTruthy();
        });

        it('displays footer section', () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            expect(getByText('landing_design_process')).toBeTruthy();
            expect(getByText('landing_view_behance')).toBeTruthy();
            expect(getByText('landing_view_design_system')).toBeTruthy();
        });

        it('displays copyright text', () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            expect(getByText('© 2025 ExamMate. All rights reserved.')).toBeTruthy();
        });
    });

    describe('navigation', () => {
        it('navigates to Login on primary button press', async () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            const button = getByText('landing_join_now');
            fireEvent.press(button);
            await waitFor(() => {
                expect(saveIsFirstUse).toHaveBeenCalled();
                expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
            });
        });

        it('navigates to Login on sticky button press', async () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            const button = getByText('landing_start_learning');
            fireEvent.press(button);
            await waitFor(() => {
                expect(saveIsFirstUse).toHaveBeenCalled();
                expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
            });
        });
    });

    describe('external links', () => {
        it('opens Behance link when button is pressed', async () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            const behanceButton = getByText('landing_view_behance');
            fireEvent.press(behanceButton);

            await waitFor(() => {
                expect(Linking.canOpenURL).toHaveBeenCalledWith('https://www.behance.net/gallery/240281337/ExamMate');
            });
        });

        it('opens Figma link when button is pressed', async () => {
            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            const figmaButton = getByText('landing_view_design_system');
            fireEvent.press(figmaButton);

            await waitFor(() => {
                expect(Linking.canOpenURL).toHaveBeenCalled();
            });
        });

        it('handles unsupported URLs gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            (Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(false);

            const { getByText } = render(<LandingScreen navigation={mockNavigation as any} route={{} as any} />);
            const behanceButton = getByText('landing_view_behance');
            fireEvent.press(behanceButton);

            await waitFor(() => {
                expect(Linking.canOpenURL).toHaveBeenCalled();
            });

            consoleSpy.mockRestore();
        });
    });
});
