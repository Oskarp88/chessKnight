import React, { createContext, useContext, useState } from 'react';

const TokenPasswordContext = createContext();
const TokenPasswordProvider = ({ children }) => {
  const [tokenPassword, setTokenPassword] = useState({ token: '' });

  return (
    <TokenPasswordContext.Provider value={{ tokenPassword, setTokenPassword }}>
      {children}
    </TokenPasswordContext.Provider>
  );
};

const useTokenPasswordContext = () => {
  const context = useContext(TokenPasswordContext);
  if (!context) {
    throw new Error('useTokenPasswordContext must be used within a TokenPasswordProvider');
  }
  return context;
};

export { TokenPasswordProvider, useTokenPasswordContext };
