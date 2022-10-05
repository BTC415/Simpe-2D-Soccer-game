import { useContext } from 'react';

import { modalContext } from '../context/modal.context';

export const useModal = () => {
  const { openModal, closeModal, modal } = useContext(modalContext);
  return { openModal, closeModal, modal };
};
