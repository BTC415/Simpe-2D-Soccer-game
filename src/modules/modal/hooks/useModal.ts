import { useContext } from 'react';

import { modalContext } from '../context/modal.context';

export const useModal = () => {
  const { openModal, closeModal } = useContext(modalContext);
  return { openModal, closeModal };
};
