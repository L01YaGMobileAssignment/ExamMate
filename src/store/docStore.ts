import { create } from "zustand";
import { DocumentType } from "../types/document";

interface DocState {
  docs: DocumentType[];
  isLoading: boolean;
  setDocs: (docs: DocumentType[]) => void;
  addDoc: (doc: DocumentType) => void;
  removeDoc: (docId: string) => void;
  clearDocs: () => void;
}

export const useDocStore = create<DocState>(set => ({
  docs: [],
  isLoading: false,

  setDocs: docs => set({ docs }),

  addDoc: doc =>
    set(state => {
      const newDocs = [...state.docs, doc];
      return {docs: newDocs};
      }
),

  removeDoc: docId =>
    set(state => ({
      docs: state.docs.filter(item => item.id !== docId),
    })),
  clearDocs: () =>
    set(state => ({
      docs: [],
    })),
}));
