import { useDocStore } from '../../src/store/docStore';
import { DocumentType } from '../../src/types/document';

describe('docStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useDocStore.setState({
            docs: [],
            isLoading: false,
        });
    });

    const mockDoc: DocumentType = {
        id: 'doc1',
        title: 'Test Document',
        filename: 'test.pdf',
        summary: 'Test summary',
        content: 'Test content',
        fileType: 'pdf',
        created_at: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    };

    describe('setDocs', () => {
        it('should set docs array', () => {
            const docs = [mockDoc];
            useDocStore.getState().setDocs(docs);

            expect(useDocStore.getState().docs).toEqual(docs);
        });

        it('should replace existing docs', () => {
            useDocStore.setState({ docs: [mockDoc] });

            const newDoc: DocumentType = { ...mockDoc, id: 'doc2', title: 'New Document' };
            useDocStore.getState().setDocs([newDoc]);

            expect(useDocStore.getState().docs).toHaveLength(1);
            expect(useDocStore.getState().docs[0].id).toBe('doc2');
        });

        it('should handle empty array', () => {
            useDocStore.setState({ docs: [mockDoc] });
            useDocStore.getState().setDocs([]);

            expect(useDocStore.getState().docs).toHaveLength(0);
        });
    });

    describe('addDoc', () => {
        it('should add a new doc to the list', () => {
            useDocStore.getState().addDoc(mockDoc);

            expect(useDocStore.getState().docs).toHaveLength(1);
            expect(useDocStore.getState().docs[0]).toEqual(mockDoc);
        });

        it('should append doc to existing docs', () => {
            useDocStore.setState({ docs: [mockDoc] });

            const newDoc: DocumentType = { ...mockDoc, id: 'doc2' };
            useDocStore.getState().addDoc(newDoc);

            expect(useDocStore.getState().docs).toHaveLength(2);
            expect(useDocStore.getState().docs[1].id).toBe('doc2');
        });
    });

    describe('removeDoc', () => {
        it('should remove a doc by id', () => {
            useDocStore.setState({ docs: [mockDoc] });

            useDocStore.getState().removeDoc('doc1');

            expect(useDocStore.getState().docs).toHaveLength(0);
        });

        it('should not remove anything if doc id not found', () => {
            useDocStore.setState({ docs: [mockDoc] });

            useDocStore.getState().removeDoc('nonexistent');

            expect(useDocStore.getState().docs).toHaveLength(1);
        });

        it('should remove only matching doc from multiple', () => {
            const doc2: DocumentType = { ...mockDoc, id: 'doc2' };
            useDocStore.setState({ docs: [mockDoc, doc2] });

            useDocStore.getState().removeDoc('doc1');

            expect(useDocStore.getState().docs).toHaveLength(1);
            expect(useDocStore.getState().docs[0].id).toBe('doc2');
        });
    });

    describe('clearDocs', () => {
        it('should clear all docs', () => {
            useDocStore.setState({ docs: [mockDoc, { ...mockDoc, id: 'doc2' }] });

            useDocStore.getState().clearDocs();

            expect(useDocStore.getState().docs).toHaveLength(0);
        });

        it('should work when docs is already empty', () => {
            useDocStore.getState().clearDocs();

            expect(useDocStore.getState().docs).toHaveLength(0);
        });
    });
});
