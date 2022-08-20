import { useContext } from 'react';

import { adminContext } from '../context/adminContext';

export const useAdmin = () => {
  const { admin, setAdmin } = useContext(adminContext);

  return { admin, setAdmin };
};
