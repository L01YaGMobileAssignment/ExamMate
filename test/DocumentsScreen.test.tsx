import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import DocumentsScreen from '../src/screens/DocumentsScreen';
import { getDocuments, getDocumentsByTitleKey } from '../src/services/docApiService';

const mockNavigation = {
    navigate: jest.fn(),
};

jest.mock('../src/services/docApiService', () => ({
    getDocuments: jest.fn(),
    getDocumentsByTitleKey: jest.fn(),
}));

jest.useFakeTimers();

describe('DocumentsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (getDocuments as jest.Mock).mockResolvedValue({
            status: 200,
            data: [
                { id: 1, title: 'Doc 1', fileType: 'pdf', created_at: '2023-01-01' },
                { id: 2, title: 'Doc 2', fileType: 'pdf', created_at: '2023-01-02' }
            ]
        });
        (getDocumentsByTitleKey as jest.Mock).mockResolvedValue({
            status: 200,
            data: [{ id: 3, title: 'Search Result', fileType: 'pdf', created_at: '2023-01-03' }]
        });
    });

    it('renders correctly', async () => {
        const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);
        await waitFor(() => {
            expect(getByText('tab_documents')).toBeTruthy();
            expect(getByText('Doc 1')).toBeTruthy();
        });
    });

    it('navigates to new document screen', async () => {
        const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => expect(getByText('new')).toBeTruthy());

        fireEvent.press(getByText('new'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentUploadScreen');
    });

    it('navigates to document detail screen', async () => {
        const { getAllByText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

        await waitFor(() => expect(getByText('Doc 1')).toBeTruthy());
        const selectButtons = getAllByText('select');
        fireEvent.press(selectButtons[0]);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', {
            document: expect.objectContaining({ title: 'Doc 1' })
        });
    });

    it('handles search functionality', async () => {
        const { getByPlaceholderText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

        const searchInput = getByPlaceholderText('search_docs_placeholder');

        fireEvent.changeText(searchInput, 'Search');
        act(() => {
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
            expect(getDocumentsByTitleKey).toHaveBeenCalledWith('Search');
            expect(getByText('Search Result')).toBeTruthy();
        });
    });
});

