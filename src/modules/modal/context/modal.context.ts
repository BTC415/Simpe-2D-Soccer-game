import { createContext } from 'react';

export const modalContext = createContext<{
  modal: JSX.Element | JSX.Element[] | null;
  openModal: (modal: JSX.Element | JSX.Element[]) => void;
  closeModal: () => void;
}>({ modal: null, openModal: () => {}, closeModal: () => {} });
