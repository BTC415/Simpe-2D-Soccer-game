import { useContext, useEffect, useState } from 'react';

import { adminContext } from '../context/adminContext';

export const useAdmin = () => {
  const { admin, setAdmin } = useContext(adminContext);
  const [prevAdminId, setPrevAdminId] = useState('');

  useEffect(() => {
    return () => {
      setPrevAdminId(admin.id);
    };
  }, [admin.id]);

  return { admin, setAdmin, prevAdminId };
};
