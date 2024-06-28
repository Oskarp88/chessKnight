import React, { createContext, useContext, useState } from 'react';

const PieceContext = createContext();

export const usePieceContext = () => {
  const context = useContext(PieceContext);
  if (!context) {
    throw new Error('usePieceContext must be used within a PieceProvider');
  }
  return context;
};

export const PieceProvider = ({ children }) => {
  const [pieceFile, setPieceFile] = useState({image:''});
  
  return (
    <PieceContext.Provider key={pieceFile.image} value={{ pieceFile, setPieceFile }}>
      {children}
    </PieceContext.Provider>
  );
};
