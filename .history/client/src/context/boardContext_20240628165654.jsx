import React, { createContext, useContext, useState } from 'react';

const ChessboardContext = createContext();

export const useChessboardContext = () => {
  const context = useContext(ChessboardContext);
  if (!context) {
    throw new Error('useChessboardContext must be used within a ChessboardProvider');
  }
  return context;
};

export const ChessboardProvider = ({ children }) => {
  const [boardColor, setBoardColor] = useState({
    blackTile: '',
    whiteTile: '',
    register: '',
    whiteRow: '',
    blackRow: ''
  });
  const [chessColor, setChessColor] = useState({
    navbar: '',
    boxShadow: '',
    border: '',
    fondo: '',
    titulo: '',
    color: '',
  })
  const [view, setView] = useState(window.innerWidth <= 690);
  
  return (
    <ChessboardContext.Provider value={{ boardColor, setBoardColor ,
       view,
       setView,
       chessColor,
       setChessColor
    }}>
      {children}
    </ChessboardContext.Provider>
  );
};
