import { createContext, Dispatch, SetStateAction, useState } from 'react';

const adminContext = createContext<{
  admin: {
    id: string;
    name: string;
  };
  setAdmin: Dispatch<
    SetStateAction<{
      id: string;
      name: string;
    }>
  >;
}>({
  admin: {
    id: '',
    name: '',
  },
  setAdmin: () => {},
});

const AdminProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [admin, setAdmin] = useState({
    id: '',
    name: '',
  });

  return (
    <adminContext.Provider
      value={{
        admin,
        setAdmin,
      }}
    >
      {children}
    </adminContext.Provider>
  );
};

export { adminContext };

export default AdminProvider;
