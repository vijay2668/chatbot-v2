import { create } from 'zustand';

export type ModalType = 'file'| 'editFile' | 'website' | 'editWebsite' | 'starterQuestions' | 'learnMore' | 'newchatbot';

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: any;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
