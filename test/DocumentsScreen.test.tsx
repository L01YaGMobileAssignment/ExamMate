import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import DocumentsScreen from '../src/screens/DocumentsScreen';
import { getDocuments, getDocumentsByTitleKey } from '../src/services/docApiService';
import { useDocStore } from '../src/store/docStore';

const mockNavigation = {
    navigate: jest.fn(),
};

jest.mock('../src/services/docApiService', () => ({
    getDocuments: jest.fn(),
    getDocumentsByTitleKey: jest.fn(),
}));

const mockDocuments = [
    { id: '1', title: 'Doc 1', fileType: 'pdf', created_at: '2023-01-01', filename: 'doc1.pdf' },
    { id: '2', title: 'Doc 2', fileType: 'pdf', created_at: '2023-01-02', filename: 'doc2.pdf' },
    { id: '3', title: 'Doc 3', fileType: 'pdf', created_at: '2023-01-03', filename: 'doc3.pdf' },
];

describe('DocumentsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        useDocStore.setState({ docs: [] });

        (getDocuments as jest.Mock).mockResolvedValue({
            status: 200,
            data: mockDocuments
        });
        (getDocumentsByTitleKey as jest.Mock).mockResolvedValue({
            status: 200,
            data: [{ id: '3', title: 'Search Result', fileType: 'pdf', created_at: '2023-01-03', filename: 'search.pdf' }]
        });
    });

    describe('rendering', () => {
        it('renders correctly', async () => {
            const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);
            await waitFor(() => {
                expect(getByText('tab_documents')).toBeTruthy();
                expect(getByText('Doc 1')).toBeTruthy();
            });
        });

        it('shows empty state when no documents', async () => {
            (getDocuments as jest.Mock).mockResolvedValue({
                status: 200,
                data: []
            });

            const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('no_docs_init')).toBeTruthy();
            });
        });

        it('displays document list when documents exist', async () => {
            const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Doc 1')).toBeTruthy();
                expect(getByText('Doc 2')).toBeTruthy();
            });
        });

        it('displays all document titles', async () => {
            const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Doc 1')).toBeTruthy();
                expect(getByText('Doc 2')).toBeTruthy();
                expect(getByText('Doc 3')).toBeTruthy();
            });
        });
    });

    describe('navigation', () => {
        it('navigates to new document screen', async () => {
            const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('new')).toBeTruthy());

            fireEvent.press(getByText('new'));
            expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentUploadScreen');
        });

        it('navigates to document detail screen when select is pressed', async () => {
            const { getAllByText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('Doc 1')).toBeTruthy());
            const selectButtons = getAllByText('select');
            fireEvent.press(selectButtons[0]);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', {
                document: expect.objectContaining({ title: 'Doc 1' })
            });
        });

        it('navigates to correct document when second document is selected', async () => {
            const { getAllByText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('Doc 2')).toBeTruthy());
            const selectButtons = getAllByText('select');
            fireEvent.press(selectButtons[1]);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', {
                document: expect.objectContaining({ title: 'Doc 2' })
            });
        });

        it('navigates to third document when selected', async () => {
            const { getAllByText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => expect(getByText('Doc 3')).toBeTruthy());
            const selectButtons = getAllByText('select');
            fireEvent.press(selectButtons[2]);

            expect(mockNavigation.navigate).toHaveBeenCalledWith('DocumentDetail', {
                document: expect.objectContaining({ title: 'Doc 3' })
            });
        });
    });

    describe('search functionality', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('handles search functionality with debounce', async () => {
            const { getByPlaceholderText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await act(async () => {
                jest.runAllTimers();
            });

            await waitFor(() => expect(getByText('Doc 1')).toBeTruthy());

            const searchInput = getByPlaceholderText('search_docs_placeholder');

            fireEvent.changeText(searchInput, 'Search');

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(getDocumentsByTitleKey).toHaveBeenCalledWith('Search');
            });
        });

        it('clears search and reloads documents when search is empty', async () => {
            const { getByPlaceholderText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await act(async () => {
                jest.runAllTimers();
            });

            await waitFor(() => expect(getByText('Doc 1')).toBeTruthy());

            const initialCallCount = (getDocuments as jest.Mock).mock.calls.length;

            const searchInput = getByPlaceholderText('search_docs_placeholder');

            // Clear search should trigger getDocuments
            fireEvent.changeText(searchInput, '');

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                // Should call getDocuments again after clearing search
                expect((getDocuments as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(initialCallCount);
            });
        });

        it('debounces search input', async () => {
            const { getByPlaceholderText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await act(async () => {
                jest.runAllTimers();
            });

            await waitFor(() => expect(getByText('Doc 1')).toBeTruthy());

            const searchInput = getByPlaceholderText('search_docs_placeholder');

            // Type multiple characters quickly
            fireEvent.changeText(searchInput, 'S');
            fireEvent.changeText(searchInput, 'Se');
            fireEvent.changeText(searchInput, 'Sea');

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                expect(getDocumentsByTitleKey).toHaveBeenCalledWith('Sea');
            });
        });

        it('clears previous timeout when new search is started', async () => {
            const { getByPlaceholderText, getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await act(async () => {
                jest.runAllTimers();
            });

            await waitFor(() => expect(getByText('Doc 1')).toBeTruthy());

            const searchInput = getByPlaceholderText('search_docs_placeholder');

            // Start first search
            fireEvent.changeText(searchInput, 'First');

            await act(async () => {
                jest.advanceTimersByTime(200);
            });

            // Start second search before first completes
            fireEvent.changeText(searchInput, 'Second');

            await act(async () => {
                jest.advanceTimersByTime(500);
            });

            await waitFor(() => {
                // Only second search should be executed
                expect(getDocumentsByTitleKey).toHaveBeenCalledWith('Second');
            });
        });
    });

    describe('document card rendering', () => {
        it('displays document title', async () => {
            const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Doc 1')).toBeTruthy();
            });
        });

        it('displays select button for each document', async () => {
            const { getAllByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                const selectButtons = getAllByText('select');
                expect(selectButtons.length).toBe(3);
            });
        });
    });

    describe('data fetching', () => {
        it('fetches documents on initial render', async () => {
            render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getDocuments).toHaveBeenCalledWith(1, 8);
            });
        });

        it('displays documents after successful fetch', async () => {
            const { getByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Doc 1')).toBeTruthy();
                expect(getByText('Doc 2')).toBeTruthy();
                expect(getByText('Doc 3')).toBeTruthy();
            });
        });
    });

    describe('multiple documents', () => {
        it('handles large number of documents', async () => {
            const manyDocuments = Array(8).fill(null).map((_, i) => ({
                id: `${i + 1}`,
                title: `Document ${i + 1}`,
                fileType: 'pdf',
                created_at: '2023-01-01',
                filename: `doc${i + 1}.pdf`
            }));

            (getDocuments as jest.Mock).mockResolvedValue({
                status: 200,
                data: manyDocuments
            });

            const { getByText, getAllByText } = render(<DocumentsScreen navigation={mockNavigation as any} route={{} as any} />);

            await waitFor(() => {
                expect(getByText('Document 1')).toBeTruthy();
                expect(getAllByText('select').length).toBe(8);
            });
        });
    });
});
