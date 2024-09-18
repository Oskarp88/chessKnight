import React, { createContext, useContext, useEffect, useState } from 'react';
import { colorBoard, colorChess } from '../utils/Colors';
import { PieceType } from '../Types';
import { piecesTheme } from '../utils/pieces';

const ChessboardContext = createContext();

export const useChessboardContext = () => {
  const context = useContext(ChessboardContext);
  if (!context) {
    throw new Error('useChessboardContext must be used within a ChessboardProvider');
  }
  return context;
};

export const ChessboardProvider = ({ children }) => {
  const [boardColor, setBoardColor] = useState(colorBoard[0]);
  const [themePiece, setTemePiece] = useState(piecesTheme[0]);
  const [pieces, setPieces] = useState([]);
  const [resetPieces, setResetPieces] = useState([]);
  const [chessColor, setChessColor] = useState(colorChess[0]);
  const [view, setView] = useState(window.innerWidth <= 690);

  useEffect(() => {
    const updatedPieces = [
      { image: `assets/${themePiece?.images}/wp.png`, x: 0, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/wp.png`, x: 1, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/wp.png`, x: 2, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/wp.png`, x: 3, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/wp.png`, x: 4, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/wp.png`, x: 5, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/wp.png`, x: 6, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/wp.png`, x: 7, y: 1, color: 'white', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/wk.png`, x: 4, y: 0, color: 'white', hasMoved: false, type: PieceType.KING },
      { image: `assets/${themePiece?.images}/bb.png`, x: 2, y: 7, color: 'black', hasMoved: false, type: PieceType.BISHOP },
      { image: `assets/${themePiece?.images}/bb.png`, x: 5, y: 7, color: 'black', hasMoved: false, type: PieceType.BISHOP },
      { image: `assets/${themePiece?.images}/wr.png`, x: 0, y: 0, color: 'white', hasMoved: false, type: PieceType.ROOK },
      { image: `assets/${themePiece?.images}/wr.png`, x: 7, y: 0, color: 'white', hasMoved: false, type: PieceType.ROOK },
      { image: `assets/${themePiece?.images}/wq.png`, x: 3, y: 0, color: 'white', hasMoved: false, type: PieceType.QUEEN },
      { image: `assets/${themePiece?.images}/wb.png`, x: 2, y: 0, color: 'white', hasMoved: false, type: PieceType.BISHOP },
      { image: `assets/${themePiece?.images}/wb.png`, x: 5, y: 0, color: 'white', hasMoved: false, type: PieceType.BISHOP },
      { image: `assets/${themePiece?.images}/wn.png`, x: 1, y: 0, color: 'white', hasMoved: false, type: PieceType.KNIGHT},
      { image: `assets/${themePiece?.images}/wn.png`, x: 6, y: 0, color: 'white', hasMoved: false, type: PieceType.KNIGHT },
      { image: `assets/${themePiece?.images}/br.png`, x: 0, y: 7, color: 'black', hasMoved: false, type: PieceType.ROOK },
      { image: `assets/${themePiece?.images}/br.png`, x: 7, y: 7, color: 'black', hasMoved: false, type: PieceType.ROOK },
      { image: `assets/${themePiece?.images}/bn.png`, x: 1, y: 7, color: 'black', hasMoved: false, type: PieceType.KNIGHT },
      { image: `assets/${themePiece?.images}/bn.png`, x: 6, y: 7, color: 'black', hasMoved: false, type: PieceType.KNIGHT },
      { image: `assets/${themePiece?.images}/bk.png`, x: 4, y: 7, color: 'black', hasMoved: false, type: PieceType.KING },
      { image: `assets/${themePiece?.images}/bq.png`, x: 3, y: 7, color: 'black', hasMoved: false, type: PieceType.QUEEN },
      { image: `assets/${themePiece?.images}/bp.png`, x: 0, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN },
      { image: `assets/${themePiece?.images}/bp.png`, x: 1, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
      { image: `assets/${themePiece?.images}/bp.png`, x: 2, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
      { image: `assets/${themePiece?.images}/bp.png`, x: 3, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
      { image: `assets/${themePiece?.images}/bp.png`, x: 4, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
      { image: `assets/${themePiece?.images}/bp.png`, x: 5, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
      { image: `assets/${themePiece?.images}/bp.png`, x: 6, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  },
      { image: `assets/${themePiece?.images}/bp.png`, x: 7, y: 6, color: 'black', hasMoved: false, type: PieceType.PAWN  }
    ];
    
    setPieces(updatedPieces);
    setResetPieces(updatedPieces)
  }, [themePiece]);

  useEffect(()=>{
    const themeLocal = localStorage.getItem('theme');
    
    if(!isNaN(themeLocal) && themeLocal) {
      setChessColor(colorChess[parseInt(themeLocal)]);
    }

    const board = localStorage.getItem('colorBoard');
    
    if(!isNaN(board) && board) {
      setBoardColor(colorBoard[parseInt(board)]);
    }
    
    const themePieza = localStorage.getItem('pieceTheme');
    
    if(!isNaN(themePieza) && themePieza) {
      setTemePiece(piecesTheme[parseInt(themePieza)]);
    }


  },[chessColor, boardColor, themePiece]);


  return (
    <ChessboardContext.Provider value={{ 
       boardColor, 
       setBoardColor ,
       view,
       setView,
       chessColor,
       setChessColor,
       pieces, setPieces,
       themePiece, setTemePiece
    }}>
      {children}
    </ChessboardContext.Provider>
  );
};
