import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { colorBoard, colorChess } from '../utils/Colors';
import { PieceType } from '../Types';
import { piecesTheme } from '../utils/pieces';
import { useSocketContext } from './socketContext';
import { useCheckMateContext } from './checkMateContext';

const ChessboardContext = createContext();

export const useChessboardContext = () => {
  const context = useContext(ChessboardContext);
  if (!context) {
    throw new Error('useChessboardContext must be used within a ChessboardProvider');
  }
  return context;
};

export const ChessboardProvider = ({ children }) => {
  const {setCheckMate} = useCheckMateContext();
  const {infUser, setInfUser, setUser, setRoom} = useSocketContext();
  const [boardColor, setBoardColor] = useState(colorBoard[0]);
  const [themePiece, setTemePiece] = useState(piecesTheme[0]);
  const [pieces, setPieces] = useState([]);
  const [resetPieces, setResetPieces] = useState([]);
  const [chessColor, setChessColor] = useState(colorChess[0]);
  const [view, setView] = useState(window.innerWidth <= 690);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [startCell, setStartCell] = useState(null);
  const [startCellRival, setStartCellRival] = useState(null);
  const [destinationCell, setDestinationCell] = useState(null);
  const [destinationCellRival, setDestinationCellRival] = useState(null);
  const [kingCheckCell, setKingCheckCell] = useState(null);
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [userWon, setUserWon] = useState(null);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [isPromotionComplete, setPromotionComplete] = useState(false);
  const [modaltime, setModalTime] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const [whiteMoveLog, setWhiteMoveLog] = useState([]);
  const [blackMoveLog, setBlackMoveLog] = useState([]);
  const [moveLog, setMoveLog] = useState([]);
  const [countNoCapture, setCountNoCapture] = useState(0);
  const [whiteTime, setWhiteTime] = useState(infUser?.time || 1);
  const [blackTime, setBlackTime] = useState(infUser?.time || 1);
  const [isWhiteTime, setIsWhiteTime] = useState('');
  const [loadingTablas, setLoadingTablas] = useState(false);
  const [modalTablas, setModalTablas] = useState(false);

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

    const piecesData = localStorage.getItem('pieces');
    if(piecesData){
      const parseData = JSON.parse(piecesData);
      setPieces(parseData);
    }


  },[chessColor, boardColor, themePiece,pieces]);

  useEffect(() => {
    const dataCellStart = localStorage.getItem('startCell');
    if(dataCellStart){
      const parseData = JSON.parse(dataCellStart);
      setStartCell({x: parseData.x, y: parseData.y});
    }

    const dataDestinationCell = localStorage.getItem('destinationCell');
    if(dataDestinationCell){
      const parseData = JSON.parse(dataDestinationCell);
      setDestinationCell({x: parseData.x, y: parseData.y})
    }
    const data = localStorage.getItem('chessboard');
    if (data) {
      const parseData = JSON.parse(data);
      setInfUser(parseData.infUser);
      setRoom(parseData.room);
      setCheckMate(parseData.checkMate);
      setInfUser(parseData.infUser);
      setUser(parseData.userChess);
      setCurrentTurn(parseData.currentTurn);
    }

    const userData = localStorage.getItem('userChess');
    if(userData){
      const parseData = JSON.parse(userData);
      setUser(parseData);
    }
    const userOpponent = localStorage.getItem('infUser');
    if(userOpponent) {
      const parseData = JSON.parse(userOpponent);
      setInfUser(parseData);
    }
    const dataTimeWhite = localStorage.getItem('whiteTime');
    
    if(!isNaN(dataTimeWhite) && dataTimeWhite) {
      setWhiteTime(parseInt(dataTimeWhite));
    }
    const dataTimeBlack = localStorage.getItem('blackTime');
    
    if(!isNaN(dataTimeBlack) && dataTimeBlack) {
      setBlackTime(parseInt(dataTimeBlack));
    }
  },[]);

  const handleOpponentMove = useCallback(async(data)=>{
     
  });


  return (
    <ChessboardContext.Provider value={{ 
       boardColor, 
       setBoardColor ,
       view,
       setView,
       chessColor,
       setChessColor,
       pieces, setPieces,
       themePiece, setTemePiece,
       resetPieces,
       currentTurn, setCurrentTurn,
       selectedPiece, setSelectedPiece,
       startCell, setStartCell,
       destinationCell, setDestinationCell,
       startCellRival, setStartCellRival,
       destinationCellRival, setDestinationCellRival,
       kingCheckCell, setKingCheckCell,
       enPassantTarget, setEnPassantTarget,
       userWon, setUserWon,
       promotionModalOpen, setPromotionModalOpen,
       isPromotionComplete, setPromotionComplete,
       modaltime, setModalTime,
       isGameOver, setGameOver,
       whiteMoveLog, setWhiteMoveLog,
       blackMoveLog, setBlackMoveLog,
       moveLog, setMoveLog,
       countNoCapture, setCountNoCapture,
       whiteTime, setWhiteTime,
       blackTime, setBlackTime,
       isWhiteTime, setIsWhiteTime,
       loadingTablas, setLoadingTablas,
       modalTablas, setModalTablas
    }}>
      {children}
    </ChessboardContext.Provider>
  );
};
