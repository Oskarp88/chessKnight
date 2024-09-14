import React, { createContext, useContext, useEffect, useState } from 'react';
import { colorChess } from '../utils/Colors';
import { PieceType } from '../Types';

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
  const [pieces, setPieces] = useState(
  [
    { image: `assets/images01/wp.png`, x: 0, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/wp.png`, x: 1, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/wp.png`, x: 2, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/wp.png`, x: 3, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/wp.png`, x: 4, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/wp.png`, x: 5, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/wp.png`, x: 6, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/wp.png`, x: 7, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/wk.png`, x: 4, y: 0, color: 'white', hasMoved: false, type: PieceType.KING },
    { image: `assets/images01/bb.png`, x: 2, y: 7, color: 'black', hasMoved: false, type: PieceType.BISHOP },
    { image: `assets/images01/bb.png`, x: 5, y: 7, color: 'black', hasMoved: false, type: PieceType.BISHOP },
    { image: `assets/images01/wr.png`, x: 0, y: 0, color: 'white', hasMoved: false, type: PieceType.ROOK },
    { image: `assets/images01/wr.png`, x: 7, y: 0, color: 'white', hasMoved: false, type: PieceType.ROOK },
    { image: `assets/images01/wq.png`, x: 3, y: 0, color: 'white', hasMoved: false, type: PieceType.QUEEN },
    { image: `assets/images01/wb.png`, x: 2, y: 0, color: 'white', hasMoved: false, type: PieceType.BISHOP },
    { image: `assets/images01/wb.png`, x: 5, y: 0, color: 'white', hasMoved: false, type: PieceType.BISHOP },
    { image: `assets/images01/wn.png`, x: 1, y: 0, color: 'white', hasMoved: false, type: PieceType.KNIGHT},
    { image: `assets/images01/wn.png`, x: 6, y: 0, color: 'white', hasMoved: false, type: PieceType.KNIGHT },
    { image: `assets/images01/br.png`, x: 0, y: 7, color: 'black', hasMoved: false, type: PieceType.ROOK },
    { image: `assets/images01/br.png`, x: 7, y: 7, color: 'black', hasMoved: false, type: PieceType.ROOK },
    { image: `assets/images01/bn.png`, x: 1, y: 7, color: 'black', hasMoved: false, type: PieceType.KNIGHT },
    { image: `assets/images01/bn.png`, x: 6, y: 7, color: 'black', hasMoved: false, type: PieceType.KNIGHT },
    { image: `assets/images01/bk.png`, x: 4, y: 7, color: 'black', hasMoved: false, type: PieceType.KING },
    { image: `assets/images01/bq.png`, x: 3, y: 7, color: 'black', hasMoved: false, type: PieceType.QUEEN },
    { image: `assets/images01/bp.png`, x: 0, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN },
    { image: `assets/images01/bp.png`, x: 1, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images01/bp.png`, x: 2, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images01/bp.png`, x: 3, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images01/bp.png`, x: 4, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images01/bp.png`, x: 5, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images01/bp.png`, x: 6, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
    { image: `assets/images01/bp.png`, x: 7, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  }
  ]);
  const [chessColor, setChessColor] = useState(colorChess[0]);
  const [view, setView] = useState(window.innerWidth <= 690);

  useEffect(()=>{
    const themeLocal = localStorage.getItem('theme');
    
    if(!isNaN(themeLocal) && themeLocal) {
      setChessColor(colorChess[parseInt(themeLocal)]);
    }
  },[chessColor])
  
  return (
    <ChessboardContext.Provider value={{ 
       boardColor, 
       setBoardColor ,
       view,
       setView,
       chessColor,
       setChessColor,
       pieces, setPieces
    }}>
      {children}
    </ChessboardContext.Provider>
  );
};
