import React, { useEffect, useState, useRef , memo} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Chessboard.css';
import { PieceType } from '../Types';
import { useChessboardContext } from '../context/boardContext';
import { 
  getCaptureFunction, 
  getMovesFunction, 
  handleThreefoldRepetition, 
  insufficientMaterial,
  isMoveValid, 
  isStalemate } from './referee/Referee';
import { HORIZONTAL_AXIS, VERTICAL_AXIS, initPieces } from '../Constants';
import toqueSound from '../path/to/tocar.mp3';
import soltarSound from '../path/to/soltar.mp3';
import victorySound from '../path/to/VICTORIA.mp3';
import derrotaSound from '../path/to/derrota.mp3';
import jakeMateSound from '../path/to/jakemate.mp3';
import jakeSound from '../path/to/jake.mp3';
import {
  isCheckmateAfterMove,  
  isSimulatedMoveCausingCheck, 
  isSimulatedMoveCheckOpponent, 
} from './pieces/King';
import { useSocketContext } from '../context/socketContext';
import { useAuth } from '../context/authContext';
import PlayerInfo from './profileUser/PlayerInfo';
import Modal from './modal/Modal';
import ModalTablas from './modal/ModalTablas';
import ModalRevancha from './modal/ModalRevancha';
import ModalCheckMate from './modal/ModalCheckMate';
import ModalAbandonar from './modal/ModalAbandonar';
import { useCheckMateContext } from '../context/checkMateContext';
import ModalSendTablas from './modal/ModalSendTablas';
import ModalTablasAceptada from './modal/ModalTablasAceptada';
import PlayerInf2 from './profileUser/playerInf2';
import ChatChess from './ChatChess';
import BoardInfo from './board/BoardInfo';
import RecordPlays from './board/RecordPlays';
import PromotionPiece from './board/PromotionPiece';

function Chessboard() {

  const {
     socket, 
     room, 
     setRoom, 
     infUser, 
     userChess, 
     setInfUser, 
     setUser
    } = useSocketContext();
  const {auth} = useAuth();
  const {checkMate ,setCheckMate} = useCheckMateContext();
  const {
    boardColor,
    pieces, 
    setPieces, 
    resetPieces} = useChessboardContext();  
  const [currentTurn, setCurrentTurn] = useState('white');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [pieceAux, setPieceAux] = useState(null);
  const [startCell, setStartCell] = useState(null);
  const [startCellRival, setStartCellRival] = useState(null);
  const [destinationCell, setDestinationCell] = useState(null);
  const [destinationCellRival, setDestinationCellRival] = useState(null);
  const [kingCheckCell, setKingCheckCell] = useState(null);
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [frase, setFrase] = useState(null);
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
  const [modalSendTablas, setSendTablas] = useState(false);
  const [modalTablasAceptada, setModalTablasAceptada] = useState(false);
  const [aceptarRevancha, setAceptarRevancha] = useState(false);
  const [modalAbandonar, setModalAbandonar] = useState(false);
  const [modalRendicion, setModalRendicion] = useState(false);
  const [rendicion, setRendicion] = useState(false);
  const [sendRevancha, setSendRevancha] = useState(false);
  const [sendRevanchaRechada, setRevanchaRechazada] = useState(false);  
  const [confirmRefresh, setConfirmRefresh] = useState(false);
  const [tied, setTied] = useState(false);
  const [modalTiedRepetition, setModalTiedRepetition] = useState(false);
  const [stalemate, setStalemate] = useState(false);

  const toqueAudio = new Audio(toqueSound);
  const soltarAudio = new Audio(soltarSound);
  const victoryAudio = new Audio(victorySound);
  const derrotaAudio = new Audio(derrotaSound);
  const jakeAudio = new Audio(jakeSound);
  const jakeMateAudio = new Audio(jakeMateSound);
 
  const ref = useRef();
  const chessboardRef = useRef(null);


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
    const piecesData = localStorage.getItem('pieces');
    if(piecesData){
      const parseData = JSON.parse(piecesData);
      setPieces(parseData);
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

  useEffect(()=>{
    
    if(countNoCapture === 100) {
      console.log('empate por inactividad de captura');
      setFrase('por inactividad de captura');
      setModalTablasAceptada(true);
      setTied(true);
      setCheckMate(prevCheckMate => ({
        ...prevCheckMate,
        userId: auth?.user?._id,
        opponentId: infUser?.idOpponent,
        name: auth?.user?.username,
        nameOpponent: infUser?.username,
        bandera: auth?.user?.imagenBandera,
        banderaOpponent: infUser?.bandera,
        country: auth?.user?.country,
        countryOpponent: infUser?.country,
        time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                'fast' }`,
        game: 'empate',
        eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
          infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
          parseInt(userChess?.eloFast)}`,
        eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
          infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
          parseInt(infUser?.fast)}`,
        elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
          infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
          parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
          color: infUser?.color
        }));
    }
  },[countNoCapture]);

  useEffect(()=>{
    const  isInsufficientMaterial = insufficientMaterial(pieces);

    if(isInsufficientMaterial){
        setFrase('Empate por material insuficiente');
        setTied(true);
        setModalTablasAceptada(true);
        setCheckMate(prevCheckMate => ({
        ...prevCheckMate,
        userId: auth?.user?._id,
        opponentId: infUser?.idOpponent,
        name: auth?.user?.username,
        nameOpponent: infUser?.username,
        bandera: auth?.user?.imagenBandera,
        banderaOpponent: infUser?.bandera,
        country: auth?.user?.country,
        countryOpponent: infUser?.country,
        time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                'fast' }`,
        game: 'empate',
        eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
          infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
          parseInt(userChess?.eloFast)}`,
        eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
          infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
          parseInt(infUser?.fast)}`,
        elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
          infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
          parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
          color: infUser?.color
        }));
    }  
  },[pieces]);

useEffect(()=>{
  const tiedRepetition = handleThreefoldRepetition(moveLog);
  
  if(tiedRepetition){
    setFrase('Tablas por repetición');
    setTied(true);
    setModalTablasAceptada(true);
    setCheckMate(prevCheckMate => ({
      ...prevCheckMate,
      userId: auth?.user?._id,
      opponentId: infUser?.idOpponent,
      name: auth?.user?.username,
      nameOpponent: infUser?.username,
      bandera: auth?.user?.imagenBandera,
      banderaOpponent: infUser?.bandera,
      country: auth?.user?.country,
      countryOpponent: infUser?.country,
      time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
               infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
               'fast' }`,
      game: 'empate',
      eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
        infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
        parseInt(userChess?.eloFast)}`,
      eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
        infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
        parseInt(infUser?.fast)}`,
      elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
        infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
        parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
        color: infUser?.color
    }));
  }
 },[moveLog]);

  // Convierte el tiempo en segundos en un formato legible (por ejemplo, "MM:SS")
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  
  useEffect(() => {

     let timer = null;
     localStorage.setItem('whiteTime', whiteTime);
     localStorage.setItem('blackTime', blackTime);

     if(socket){
      if(infUser?.color === currentTurn){
        socket.emit('tiempo', {room, whiteTime, blackTime ,turno: currentTurn});
      }
     }
     if (whiteTime === 0 || blackTime === 0) {
        setIsWhiteTime(whiteTime === 0 ? 'white' : 'black');
        setModalTime(true);
      
     }
    
    if (!isGameOver && !tied && !stalemate && whiteTime > 0 && blackTime > 0 ) {
      // Cambiar de turno y actualizar el tiempo restante
      if (currentTurn === 'white') {
        if(infUser?.color === 'white') {
          timer = setTimeout(() => {
            setWhiteTime((prevTime) => prevTime - 1);           
          }, 1000);
        }
         
        
      } else {
        if(infUser?.color === 'black'){
        timer = setTimeout(() => {
          setBlackTime((prevTime) => prevTime - 1);
        }, 1000);}
      }
    }
  
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentTurn, whiteTime, blackTime, isWhiteTime]);
  
  useEffect(() => {
    if (whiteTime === 0 || blackTime === 0) {
      if (isWhiteTime === infUser?.color) {
        setCheckMate((prevCheckMate) => ({
          ...prevCheckMate,
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
            infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
              'fast'}`,
          game: 'derrota',
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
          color: infUser?.color
        }));
      } else {
        setCheckMate((prevCheckMate) => ({
          ...prevCheckMate,
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
            infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
              'fast'}`,
          game: 'victoria',
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
            color: infUser?.color
        }));
      }
    }
  }, [isWhiteTime]);

  useEffect(() => {
      if(socket === null) return;
       // Manejar el evento "connect" para detectar la conexión exitosa
      socket.on("connect", () => {
        console.log("Conexión al servidor establecida.");
        socket.emit('joinRoomGamePlay', room); 
      });;
      // Manejar el evento "disconnect" para detectar desconexiones
      socket.on("disconnect", (reason) => {
        console.log("Desconectado. Razón:", reason);
        //medidas específicas en caso de desconexión aquí, volver a conectar automáticamente o mostrar un mensaje de error al usuario.
      });
      socket.on("reconnect", (attemptNumber) => {
        console.log(`Reconectado en el intento ${attemptNumber}`);
        // Realiza cualquier lógica adicional que necesites después de la reconexión
      });
      socket.on("reconnect_error", (error) => {
        console.log("Error al intentar reconectar:", error);
        // Puedes implementar una lógica de manejo de errores personalizada aquí
      });

      socket.on("reconnect_failed", () => {
        console.log("Fallo al reconectar. No se pudo restablecer la conexión.");
        // Puedes implementar lógica adicional si es necesario
      });
      socket.on("pawn_promotion", (data)=>{

        setPieces(data.pieces)
        setCurrentTurn(data.currentTurn);
        setDestinationCell({x: data.destinationCell.x, y: data.destinationCell.y});
        setSelectedPiece(null);
        setStartCell(null);

        const updatedPieces = data.pieces.map((p) => {
          if (p.x === data.destinationCell.x && p.y === data.destinationCell.y && p.type === PieceType.PAWN) {
                return { ...data.promotionPiece, x: p.x, y: p.y, color: data.currentTurn === 'white' ? 'black' : 'white' };
          }
          return p;
        });

        setPieces(updatedPieces);
      });
   
      socket.on('receiveRevancha', (data) => {
        setModalTablasAceptada(false);
        setModalRendicion(false);
        setModalTiedRepetition(false);
        setAceptarRevancha(data?.revancha);    
      });

      socket.on('receiveStalemate', (data) => {
        setFrase('por Rey ahogado');
        setModalTablasAceptada(data.state);
        setTied(true);
        setCheckMate(prevCheckMate => ({
          ...prevCheckMate,
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                   infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                   'fast' }`,
          game: 'empate',
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
          color: infUser?.color
        }));
      })

      socket.on('receiveTiempo', (data) => {
        if (data?.turno === 'white') {
            setWhiteTime(parseInt(data?.whiteTime));                 
        } else {
          setBlackTime(parseInt(data?.blackTime));       
        }       
      });

      socket.on('revanchaAceptada', async(data)=>{ 
        localStorage.removeItem('pieces'); 
        localStorage.removeItem('whiteTime');
        localStorage.removeItem('blackTime');
        localStorage.removeItem('destinationCell');
        localStorage.removeItem('startCell');      
        setInfUser((prevInfUser) => ({
          ...prevInfUser,
          color: data?.color === 'white' ? 'black' : 'white',
        }));
        setUser((prevInfUser) => ({
          ...prevInfUser,
          color: data?.color === 'white' ? 'black' : 'white',
        }));
          resetBoard();
      });

      socket.on('receiveRevanchaRechazada',(data) => {
        setRevanchaRechazada(true);
        setSendRevancha(false);
      })

      socket.on('receiveTablas',(data) => {     
           setSendTablas(true);      
      });
      socket.on('receiveCancelarTablas', (data) => {
         setSendTablas(false);
      })
      socket.on('receiveRechazarTablas', () => {
        setModalTablas(false);
      })
      socket.on('receiveAceptarTablas', () => {
        localStorage.removeItem('whiteTime');
        localStorage.removeItem('blackTime'); 
        setModalTablas(false);
        setSendTablas(false);
        setModalTablasAceptada(true);
        setCheckMate(prevCheckMate => ({
          ...prevCheckMate,
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                   infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                   'fast' }`,
          game: 'empate',
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
            color: infUser?.color
        }));
      })
      socket.on('receiveCheckMate',(data) => {
        derrotaAudio.play();
        setCheckMate(prevCheckMate => ({
          ...prevCheckMate,
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                   infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                   'fast' }`,
          game: 'derrota',
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
            color: infUser?.color
        }));
        setUserWon(prev => ({
          ...prev, 
          username: auth?.user?.username, 
          nameOpponent: data?.username, 
          idUser: auth?.user?._id,
          idOpponent: data?.idUser,
          turn: data?.color,
          status: '0',
          color: infUser?.color === 'white' ? 'black' : 'white',
          photo: infUser?.photo
        }));
        setFrase('por !!Jaque Mate!!');
        setGameOver(true);
      })
      socket.on('receiveAbandonar',(data) => {
        localStorage.removeItem('whiteTime');
        localStorage.removeItem('blackTime');
        victoryAudio.play();
        setCheckMate((prevCheckMate) => ({
          ...prevCheckMate,
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
            infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
              'fast'}`,
          game: 'victoria',
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
            color: infUser?.color
        }));
        setUserWon(prev => ({
          ...prev, 
          username: auth?.user?.username, 
          nameOpponent: data?.username, 
          idUser: auth?.user?._id,
          idOpponent: data?.idUser,
          turn: data?.color === 'white' ? 'black' : 'white',
          status: '1',
          color: infUser?.color === 'white' ? 'black' : 'white',
          photo: infUser?.photo
        }));
        setFrase(`por abandono de las ${data?.color === 'white' ? 'negras' : 'blancas'}`);
        setGameOver(true);
      })
      socket.on("opponentMove", handleOpponentMove);

      return () => {
        if (socket) {
          socket.off("opponentMove", handleOpponentMove);
        }
      };
  }, [socket] );

  useEffect(() => {
    if (isPromotionComplete) {
      setPromotionComplete(false);
    }
  }, [isPromotionComplete, startCell]);

  const handleOpponentMove = async (data) => {
    const { piece, x, y, turn, pieces} = data;
      setCurrentTurn(turn);
      setStartCell(null)
      setDestinationCell(null);
      
      if (piece && piece.type === PieceType.PAWN) {
        if (piece.x !== x || piece.y !== y) {
          const dy = y - piece.y;
          if (Math.abs(dy) === 2) {
            //el peón avanzó dos casillas, y configura enPassantTarget.
            setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
          }      
        }
      }

      setStartCellRival({x: piece.x, y: piece.y});
      setDestinationCellRival({ x, y }); // Establece la casilla de destino
      // localStorage.setItem('startCell', JSON.stringify({x: piece.x, y: piece.y}));
      // localStorage.setItem('destinationCell', JSON.stringify({x,y}));

      const isCheck = isSimulatedMoveCheckOpponent(piece, x, y, pieces, enPassantTarget, turn)
      const king = pieces.find((p) => p.type === PieceType.KING && p.color === turn);
      const checkMate =  isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');

     if(isCheck){
       
       setKingCheckCell({x: king.x, y: king.y});
       !checkMate && jakeAudio.play(); 
       if(checkMate){
          jakeMateAudio.play();
       }
      }  else{
        setKingCheckCell(null);
    }
    setPieces((prevPieces) => {
      const updatedPieces = prevPieces.map((p) => {
          // Verificar si el rey está en su posición inicial y va a hacer enroque corto o largo
          if (piece.type === PieceType.KING && piece.x === 4 && (piece.y === 0 || piece.y === 7)) {
              // Enroque corto
              if (x === 6 && (y === 0 || y === 7)) {
                  if (p.type === PieceType.ROOK && p.x === 7 && p.y === piece.y) {
                      // Mover la torre del enroque corto
                      return { ...p, x: 5, y: piece.y }; // La torre se mueve de (7, y) a (5, y)
                  }
              }
              // Enroque largo
              else if (x === 2 && (y === 0 || y === 7)) {
                  if (p.type === PieceType.ROOK && p.x === 0 && p.y === piece.y) {
                      // Mover la torre del enroque largo
                      return { ...p, x: 3, y: piece.y }; // La torre se mueve de (0, y) a (3, y)
                  }
              }
          }
          return p;
      });
      return updatedPieces;
  });

     
      setPieces((prevPieces) => {
        let captureOccurred = false;
        // Crea una copia actualizada de la lista de piezas
        const updatedPieces = prevPieces.map((p) => {
          
          if (p.x === piece.x && p.y === piece.y) {
          
            // Encuentra la pieza que está siendo movida y actualiza su posición
            return { ...p, x, y };
          } else if (p.x === x && p.y === y && p.color !== piece.color) {
            // Si la casilla de destino está ocupada por una pieza enemiga, cápturala (no la incluyas en la nueva lista)
            captureOccurred = true;
            
            return null;
          } else {
            // Mantén inalteradas las otras piezas
           
            return p;
          }
        }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)
        
        if (captureOccurred) {
          setCountNoCapture(0);
          
        } else {
          setCountNoCapture(prevCount => prevCount + 1);
    
        }
        localStorage.setItem('pieces', JSON.stringify(updatedPieces));
        return updatedPieces;
      });

      soltarAudio.play();
    const move = piece?.color === 'white' && piece?.x === 4 && piece?.y === 0 && x === 6 && y === 0 
        ? '0-0' : piece?.color === 'black' && piece?.x === 4 && piece?.y === 7 && x === 6 && y === 7 
        ? '0-0' : piece?.color === 'white' && piece?.x === 4 && piece?.y === 0 && x === 2 && y === 0 
        ? '0-0-0' : piece?.color === 'black' && piece?.x === 4 && piece?.y === 7 && x === 2 && y === 7 
        ? '0-0-0' :`${ piece?.type?.charAt(0) === 'p'
        ? ''
        : (piece?.type === 'knight') ? 'N' : (piece?.type?.charAt(0).toLocaleUpperCase()) || ''
      }${HORIZONTAL_AXIS[x]}${VERTICAL_AXIS[y]}`;
       if (piece && piece.color === "white") {
         setWhiteMoveLog((prevMoveLog) => [...prevMoveLog, move]);
         setMoveLog((prevMoveLog) => [...prevMoveLog, move]);
       } else if (piece && piece.color === 'black'){
         setBlackMoveLog((prevMoveLog) => [...prevMoveLog, move]);
         setMoveLog((prevMoveLog) => [...prevMoveLog, move]);
       }

       localStorage.removeItem('userChess');
       localStorage.removeItem('infUser');

       localStorage.setItem('chessboard',
        JSON.stringify({
          room,  
          checkMate,
          userChess,
          infUser,
          currentTurn: turn
      }));
     
  };

  const handlePromotionSelection = async(promotionPiece) => {
    //  selección de la pieza de promoción
    // Reemplaza el peón con la pieza seleccionada
    const updatedPieces = pieces.map((p) => {
      if (p.x === destinationCell.x && p.y === destinationCell.y && p.type === PieceType.PAWN) {
        return {...promotionPiece, x: p.x, y: p.y, color: currentTurn === 'white' ? 'black' : 'white'};
      }
      return p;
    });

    
    setPieces(updatedPieces);
    const pieceData = {
      pieces,
      promotionPiece,
      destinationCell,
      currentTurn,
      author: auth?.user?.username,
      room
    }

    await socket.emit("promotion", pieceData);
    setPromotionModalOpen(false);
  };
  
  const handlePieceClick = (piece, x, y) => {

    if(tied === true) return;
    // if(infUser?.color !== currentTurn) return;
    if (piece && piece.color === infUser?.color) {
      if (selectedPiece && piece.x === selectedPiece.x && piece.y === selectedPiece.y) {        
        setDestinationCell(null);
      } else {
        toqueAudio.play(); 
        setSelectedPiece(piece);
        setPieceAux(piece);
        setStartCell({ x, y }); // Establece la casilla de inicio     
        localStorage.setItem('startCell', JSON.stringify({x,y}));
      }
    }
  };
  
  const handleTileClick = async(x, y) => {
    if(tied === true) return;
    if(infUser?.color !== currentTurn) return;
     setStartCellRival(null);
     setDestinationCellRival(null);
    // Manejar el clic en una casilla para mover la pieza
    if (selectedPiece && selectedPiece.type === PieceType.PAWN) {
      if (selectedPiece.x !== x || selectedPiece.y !== y) {
        const dy = y - selectedPiece.y;
        if (Math.abs(dy) === 2) {
          // Esto significa que el peón avanzó dos casillas, y puedes configurar enPassantTarget.
          setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
        }      
      }
    }
    if (!selectedPiece) {
      return;
    }
    
    if (isMoveValid(
           selectedPiece.type, 
           selectedPiece, 
           x,y,pieces,
           enPassantTarget,
           currentTurn)) {

            const check =  isSimulatedMoveCausingCheck(selectedPiece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
     
            if (check) {
              // Implementar la lógica para manejar el jaque mate
              console.log('¡estas en jake');       
              return
            } 

            const isCheck = isSimulatedMoveCheckOpponent(selectedPiece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white')
            const king = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
     
      if( isCheck){
        
        setKingCheckCell({x: king.x, y: king.y});       
        const checkMate = selectedPiece && isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
        !checkMate && jakeAudio.play();
        if(checkMate){
          jakeMateAudio.play();
          victoryAudio.play();
          setUserWon(prev => ({
            ...prev, 
            username: auth?.user?.username,
            nameOpponent: infUser?.username, 
            idUser: auth?.user?._id,
            idOpponent: infUser?.idOpponent,
            turn: infUser?.color === 'white' ? 'black' : 'white',
            status: '1',
            color: infUser?.color === 'white' ? 'black' : 'white',
            photo: infUser?.photo
          }));
        
         if(socket ===null) return; 
          setCheckMate(prevCheckMate => ({
            ...prevCheckMate,
            userId: auth?.user?._id,
            opponentId: infUser?.idOpponent,
            name: auth?.user?.username,
            nameOpponent: infUser?.username,
            bandera: auth?.user?.imagenBandera,
            banderaOpponent: infUser?.bandera,
            country: auth?.user?.country,
            countryOpponent: infUser?.country,
            time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                      infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                      'fast' }`,
            game: 'victoria',
            eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
              infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
              parseInt(userChess?.eloFast)}`,
            eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
              infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
              parseInt(infUser?.fast)}`,
            elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
              infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
              parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
            color: infUser?.color
          }));
          setFrase('por !!Jaque Mate!!');
          setGameOver(prevIsGameOver => {
            console.log("isGameOver:", !prevIsGameOver);
            return true;
          });
          if(socket ===null) return; 
          socket.emit('checkMate', {room, username: auth?.user?.username, idUser: auth?.user?._id, color: infUser?.color === 'white' ? 'black' : 'white'});
        }
        
      }else{
        setKingCheckCell(null);
      }
      
      const pieceData = {
        pieces,
        piece: selectedPiece,
        x,
        y,
        turn: currentTurn === 'white' ? 'black' : 'white',
        author: auth?.user?.username,
        room
      };
      
      movePiece(selectedPiece, x, y);    
      setSelectedPiece(null);
      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
      setDestinationCell({ x, y });
      localStorage.setItem('destinationCell', JSON.stringify({x,y}));

       localStorage.setItem('chessboard',
        JSON.stringify({ 
          room,  
          checkMate,
          userChess,
          infUser,
          currentTurn: currentTurn === 'white' ? 'black' : 'white'
      }));
      if(selectedPiece){
        const move = selectedPiece?.color === 'white' && selectedPiece?.x === 4 && selectedPiece?.y === 0 && x === 6 && y === 0 ? 
        '0-0' : selectedPiece?.color === 'black' && selectedPiece?.x === 4 && selectedPiece?.y === 7 && x === 6 && y === 7 ? '0-0' :
        selectedPiece?.color === 'white' && selectedPiece?.x === 4 && selectedPiece?.y === 0 && x === 2 && y === 0 ? '0-0' :
        selectedPiece?.color === 'black' && selectedPiece?.x === 4 && selectedPiece?.y === 7 && x === 2 && y === 7 ? '0-0-0' :
        `${
          selectedPiece?.type?.charAt(0) === 'p'
            ? ''
            : (selectedPiece?.type === 'knight') ? 'N' : (selectedPiece?.type?.charAt(0).toLocaleUpperCase()) || ''
        }${HORIZONTAL_AXIS[x]}${VERTICAL_AXIS[y]}`;
          if (selectedPiece && selectedPiece.color === "white") {
            setWhiteMoveLog((prevMoveLog) => [...prevMoveLog, move]);
            setMoveLog((prevMoveLog) => [...prevMoveLog, move]);
          } else if (selectedPiece && selectedPiece.color === 'black') {
            setBlackMoveLog((prevMoveLog) => [...prevMoveLog, move]);
            setMoveLog((prevMoveLog) => [...prevMoveLog, move]);
          }
      }
      
      if (selectedPiece.type === PieceType.PAWN && (y === 0 || y === 7)) {
        // Abrir el modal de promoción
        setPromotionModalOpen(true);
        return;
      }
      
      await socket.emit("send_move", pieceData);
      soltarAudio.play();
      const king1 = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
      console.log('king', king1.color);
    if (!isCheck && isStalemate(king1, pieces, selectedPiece, x, y)) {
      socket.emit('stalemate', {room, state : true});
      setModalTablasAceptada(true);
      setTied(true);
      setFrase('por Rey ahogado');
      setCheckMate(prevCheckMate => ({
        ...prevCheckMate,
        userId: auth?.user?._id,
        opponentId: infUser?.idOpponent,
        name: auth?.user?.username,
        nameOpponent: infUser?.username,
        bandera: auth?.user?.imagenBandera,
        banderaOpponent: infUser?.bandera,
        country: auth?.user?.country,
        countryOpponent: infUser?.country,
        time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                 infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                 'fast' }`,
        game: 'empate',
        eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
          infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
          parseInt(userChess?.eloFast)}`,
        eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
          infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
          parseInt(infUser?.fast)}`,
        elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
          infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
          parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
        color: infUser?.color
      }));
      return;
    }
    }
  }; 
  
  const movePiece = async (piece, x, y) => {
    if (piece && piece.color === currentTurn) {
      let captureOccurred = false;
      setPieces((prevPieces) => {         
        // Crea una copia actualizada de la lista de piezas
        const updatedPieces = prevPieces.map((p) => {
          if (p.x === piece.x && p.y === piece.y) {
            // Encuentra la pieza que está siendo movida y actualiza su posición
            return { ...p, x, y };
          } else if (p.x === x && p.y === y && p.color !== piece.color) {
            // Si la casilla de destino está ocupada por una pieza enemiga, cápturala (no la incluyas en la nueva lista)
            captureOccurred = true;
            
            return null;
          } else {
            // Mantén inalteradas las otras piezas
          
            return p;
          }
        }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)
        
    if (captureOccurred) {
      setCountNoCapture(0);
    } else {
      setCountNoCapture(prevCount => prevCount + 1);
    }
       localStorage.setItem('pieces', JSON.stringify(updatedPieces));
        return updatedPieces;
      });
    }
  };
   
  
  const handleMouseDown = (e, piece, x, y) => {
    e.preventDefault();

    if (tied || infUser?.color !== currentTurn || !piece || piece.color !== currentTurn) return;
  
      setStartCell({ x, y });
      const pieceElement = e.target;
      
      // Obtener el rectángulo del tablero y la pieza
      const chessboardRect = chessboardRef.current.getBoundingClientRect();
      // Calcular el desplazamiento de la pieza desde el cursor
      const offsetX = e.clientX;
      const offsetY = e.clientY;

      setSelectedPiece(piece);
  
   function onMouseMove(event) {
        // Calcular la nueva posición de la pieza ajustada
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;
        // Asegurarse de que la pieza no se mueva fuera del tablero
        
        pieceElement.style.position = 'absolute';
        pieceElement.style.zIndex = 5;
        pieceElement.style.left = `${newX}px`;
        pieceElement.style.top = `${newY}px`;
   }
  
      async function onMouseUp(event) {
          // Obtener las coordenadas actuales del ratón en relación con el tablero
          const xRaw = (event.clientX - chessboardRect.left) / (chessboardRect.width / 8);
          const yRaw = (event.clientY - chessboardRect.top) / (chessboardRect.height / 8);

          // Calcular las coordenadas en el tablero considerando si el tablero está invertido
          const x = infUser?.color === 'black' ? 7 - Math.floor(xRaw) : Math.floor(xRaw);
          const y = infUser?.color === 'black' ? Math.floor(yRaw) : 7 - Math.floor(yRaw);

          const check =  isSimulatedMoveCausingCheck(
            piece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white'
          );
  
        if ( x < 0 || x > 7 || y < 0 || y > 7) {
          console.log("Movimiento fuera del tablero");
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          pieceElement.style.position = '';
          pieceElement.style.left = '';
          pieceElement.style.top = '';
          return;  // Salir de la función si las coordenadas están fuera del tablero
        }

        if (check) {
          // Implementar la lógica para manejar el jaque mate
          console.log('¡estas en jake'); 
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          pieceElement.style.position = '';
          pieceElement.style.left = '';
          pieceElement.style.top = '';  
          setSelectedPiece(null)     
          return;
        } 

        if (piece && piece.type === PieceType.PAWN) {
          if (piece.x !== x || piece.y !== y) {
            const dy = y - piece.y;
            if (Math.abs(dy) === 2) {
              // Esto significa que el peón avanzó dos casillas, y puedes configurar enPassantTarget.
              setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
            }      
          }
        }
        if(isMoveValid(
          piece.type, 
          piece, 
          x, y,
          pieces, 
          enPassantTarget,
          currentTurn)){

        if (enPassantTarget && x === enPassantTarget.x && 
            y === enPassantTarget.y && piece.type === PieceType.PAWN) {
          const pieceAtDestination = pieces.find((p) => 
            p.x === enPassantTarget.x && p.y === enPassantTarget.y-1 
            || p.x === enPassantTarget.x && p.y === enPassantTarget.y+1);
          pieces.splice(pieces.indexOf(pieceAtDestination), 1);             
        }  

        const isCheck = isSimulatedMoveCheckOpponent(piece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white')
        const king = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);

        if( isCheck){
          jakeAudio.play();
          setKingCheckCell({x: king.x, y: king.y});       
          const checkMate = piece && isCheckmateAfterMove(piece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
         !checkMate && jakeAudio.play();
          if(checkMate){
            jakeMateAudio.play();
            victoryAudio.play();
            setUserWon(prev => ({
              ...prev, 
              username: auth?.user?.username,
              nameOpponent: infUser?.username, 
              idUser: auth?.user?._id,
              idOpponent: infUser?.idOpponent,
              turn: infUser?.color === 'white' ? 'black' : 'white',
              status: '1',
              color: infUser?.color === 'white' ? 'black' : 'white',
              photo: infUser?.photo
            }));
          
           if(socket ===null) return; 
            setCheckMate(prevCheckMate => ({
              ...prevCheckMate,
              userId: auth?.user?._id,
              opponentId: infUser?.idOpponent,
              name: auth?.user?.username,
              nameOpponent: infUser?.username,
              bandera: auth?.user?.imagenBandera,
              banderaOpponent: infUser?.bandera,
              country: auth?.user?.country,
              countryOpponent: infUser?.country,
              time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                        infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                        'fast' }`,
              game: 'victoria',
              eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
                infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
                parseInt(userChess?.eloFast)}`,
              eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
                infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
                parseInt(infUser?.fast)}`,
              elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
                infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
                parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
              color: infUser?.color
            }));
            setFrase('por !!Jaque Mate!!');
            setGameOver(prevIsGameOver => {
              console.log("isGameOver:", !prevIsGameOver);
              return true;
            });
            if(socket ===null) return; 
            socket.emit('checkMate', {room, username: auth?.user?.username, idUser: auth?.user?._id, color: infUser?.color === 'white' ? 'black' : 'white'});
          }
          
        }else{
          setKingCheckCell(null);
        }

        const pieceData = {
          pieces,
          piece,
          x,
          y,
          turn: currentTurn === 'white' ? 'black' : 'white',
          author: auth?.user?.username,
          room
        };
    
        movePiece(piece, x, y);
        setSelectedPiece(null);
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
        setDestinationCell({ x, y });
        
        localStorage.setItem('destinationCell', JSON.stringify({x,y}));
  
         localStorage.setItem('chessboard',
          JSON.stringify({ 
            room,  
            checkMate,
            userChess,
            infUser,
            currentTurn: currentTurn === 'white' ? 'black' : 'white'
        }));
        if(piece){
          const move = piece?.color === 'white' && piece?.x === 4 && piece?.y === 0 && x === 6 && y === 0 ? 
          '0-0' : piece?.color === 'black' && piece?.x === 4 && piece?.y === 7 && x === 6 && y === 7 ? '0-0' :
          piece?.color === 'white' && piece?.x === 4 && piece?.y === 0 && x === 2 && y === 0 ? '0-0' :
          piece?.color === 'black' && piece?.x === 4 && piece?.y === 7 && x === 2 && y === 7 ? '0-0-0' :
          `${
            piece?.type?.charAt(0) === 'p'
              ? ''
              : (piece?.type === 'knight') ? 'N' : (piece?.type?.charAt(0).toLocaleUpperCase()) || ''
          }${HORIZONTAL_AXIS[x]}${VERTICAL_AXIS[y]}`;
            if (piece && piece.color === "white") {
              setWhiteMoveLog((prevMoveLog) => [...prevMoveLog, move]);
              setMoveLog((prevMoveLog) => [...prevMoveLog, move]);
            } else if (piece && piece.color === 'black') {
              setBlackMoveLog((prevMoveLog) => [...prevMoveLog, move]);
              setMoveLog((prevMoveLog) => [...prevMoveLog, move]);
            }
        }
        
        if (piece.type === PieceType.PAWN && (y === 0 || y === 7)) {
          // Abrir el modal de promoción
          setPromotionModalOpen(true);
          return;
        }
        
        await socket.emit("send_move", pieceData);
        soltarAudio.play();
        const king1 = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
        
      if (!isCheck && isStalemate(king1, pieces, piece, x, y)) {
        socket.emit('stalemate', {room, state : true});
        setModalTablasAceptada(true);
        setTied(true);
        setFrase('por Rey ahogado');
        setCheckMate(prevCheckMate => ({
          ...prevCheckMate,
          userId: auth?.user?._id,
          opponentId: infUser?.idOpponent,
          name: auth?.user?.username,
          nameOpponent: infUser?.username,
          bandera: auth?.user?.imagenBandera,
          banderaOpponent: infUser?.bandera,
          country: auth?.user?.country,
          countryOpponent: infUser?.country,
          time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
                   infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
                   'fast' }`,
          game: 'empate',
          eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
            parseInt(userChess?.eloFast)}`,
          eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
            parseInt(infUser?.fast)}`,
          elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
            infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
            parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
          color: infUser?.color
        }));
        return;
      }
      };
  
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        pieceElement.style.position = '';
        pieceElement.style.left = '';
        pieceElement.style.top = '';
      }
  
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    
  };
  
  const resetBoard = () => {
    localStorage.removeItem('destinationCell');
    localStorage.removeItem('startCell');
    setPieces(resetPieces);
    setFrase(null);
    setModalTiedRepetition(false);
    setTied(false);
    setModalTablasAceptada(false);
    setGameOver(false);
    setDestinationCell(null);
    setStartCell(null);
    setKingCheckCell(null);
    setSelectedPiece(null);
    setCurrentTurn('white');
    setBlackMoveLog([]);
    setWhiteMoveLog([]);
    setMoveLog([]);
    setAceptarRevancha(false);
    setModalTime(false);
    setWhiteTime(infUser?.time || 0);
    setBlackTime(infUser?.time || 0);
    setModalRendicion(false);
    setCheckMate(prevCheckMate => ({
      ...prevCheckMate,
      userId: '',
      time: '',
      game: '',
      elo: 0
    }));
    // Agrega cualquier lógica adicional que necesites para reiniciar el juego.
  };

  const AceptarRevancha = async() => {
    localStorage.removeItem('pieces'); 
    localStorage.removeItem('whiteTime');
    localStorage.removeItem('blackTime');
    localStorage.removeItem('destinationCell');
    localStorage.removeItem('startCell');
    const color = infUser?.color === 'white' ? 'black' : 'white';
    if(socket === null) return;
    setInfUser((prevInfUser) => ({
      ...prevInfUser,
      color: color,
    }));
    setUser((prevInfUser) => ({
      ...prevInfUser,
      color: color,
    }));
    socket.emit('aceptarRevancha', {revancha: true, room, color});
    resetBoard();
  }

  const ofrecerTablas = () => {
     setLoadingTablas(true);
     setModalTablas(true);
     if(socket === null) return;
     socket.emit('sendTablas', {Tablas: true, room});
  }
  
  const aceptarTablas = () => {
    localStorage.removeItem('whiteTime');
    localStorage.removeItem('blackTime');
    setFrase('por tablas aceptada')
    if(socket === null) return;
    socket.emit('aceptarTablas', 
      room,
    );
    setCheckMate(prevCheckMate => ({
      ...prevCheckMate,
      userId: auth?.user?._id,
      opponentId: infUser?.idOpponent,
      name: auth?.user?.username,
      nameOpponent: infUser?.username,
      bandera: auth?.user?.imagenBandera,
      banderaOpponent: infUser?.bandera,
      country: auth?.user?.country,
      countryOpponent: infUser?.country,
      time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
               infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
               'fast' }`,
      game: 'empate',
      eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
        infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
        parseInt(userChess?.eloFast)}`,
      eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
        infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
        parseInt(infUser?.fast)}`,
      elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
        infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
        parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
      color: infUser?.color
    }));
    setModalTablas(false);
    setSendTablas(false);
    setModalTablasAceptada(true);
  }

  const cancelarTablas = () => {
    setLoadingTablas(false);
    setModalTablas(false);
    if(socket === null) return;
      socket.emit('cancelarTablas', room);   
  }

  const rechazarTablas = () => {
    setSendTablas(false);
    if(socket === null) return;
    socket.emit('rechazarTablas', room);
  }

  const revanchaHandle = () => {
    if(socket === null) return;
    socket.emit("send_revancha", {
      revancha: true, 
      room, 
    });
    setSendRevancha(true);
  }

  const abandonarHandle = () => {
     setModalAbandonar(true);
  }

  const notHandle = () => {
    setModalAbandonar(false);
  }

  const yesHandle = () => {
    localStorage.removeItem('whiteTime');
    localStorage.removeItem('blackTime');
    if(socket === null) return;
    setModalAbandonar(false);
    setGameOver(true)
    setCheckMate((prevCheckMate) => ({
      ...prevCheckMate,
      userId: auth?.user?._id,
      opponentId: infUser?.idOpponent,
      name: auth?.user?.username,
      nameOpponent: infUser?.username,
      bandera: auth?.user?.imagenBandera,
      banderaOpponent: infUser?.bandera,
      country: auth?.user?.country,
      countryOpponent: infUser?.country,
      time: `${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
        infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
          'fast'}`,
      game: 'derrota',
      eloUser: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) :
        infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) :
        parseInt(userChess?.eloFast)}`,
      eloOpponent: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(infUser?.bullet) :
        infUser?.time === 180 || infUser?.time === 300 ?  parseInt(infUser?.blitz) :
        parseInt(infUser?.fast)}`,
      elo: `${infUser?.time === 60 || infUser?.time === 120 ? parseInt(userChess?.eloBullet) - parseInt(infUser?.bullet) :
        infUser?.time === 180 || infUser?.time === 300 ? parseInt(userChess?.eloBlitz) - parseInt(infUser?.blitz) :
        parseInt(userChess?.eloFast) - parseInt(infUser?.fast)}`,
      color: infUser?.color
    }));
    setUserWon(prev => ({
      ...prev, 
      username: auth?.user?.username,
      nameOpponent: infUser?.username, 
      idUser: auth?.user?._id,
      idOpponent: infUser?.idOpponent,
      turn: infUser?.color === 'white' ? 'white' : 'black',
      status: '0',
      color: infUser?.color === 'white' ? 'black' : 'white',
      photo: infUser?.photo
    }));
    setFrase(`por abandono de las ${infUser?.color === 'white' ? 'blancas' : 'negras'}`);
    socket.emit('sendAbandonar', {room, username: auth?.user?.username, idUser: auth?.user?._id, color: infUser?.color === 'white' ? 'black' : 'white'});
  }
        
    const possibleMoves = getMovesFunction(
      selectedPiece && selectedPiece.type,
      selectedPiece,
      pieces,
      enPassantTarget,
      currentTurn
    );

    const possibleCaptures = getCaptureFunction(
      selectedPiece && selectedPiece.type,
      selectedPiece,
      pieces
    );

  // Agregar clases CSS condicionales para las casillas
  const getCellClass = (i, j) => {
    const isEven = (i + j) % 2 === 0;
    const isSelected = selectedPiece && selectedPiece.x === i && selectedPiece.y === j;
    const isStartCell = startCell && startCell.x === i && startCell.y === j;
    const isDestinationCell = destinationCell && destinationCell.x === i && destinationCell.y === j;
    const isStartCellRival = startCellRival && startCellRival.x === i && startCellRival.y === j;
    const isDestinationCellRival = destinationCellRival && destinationCellRival.x === i && destinationCellRival.y === j;
    const isKingCheckCell = kingCheckCell && kingCheckCell.x === i && kingCheckCell.y === j;

  if (isKingCheckCell) {
    return 'king-check-cell';
  }

    if (isSelected) {
      return 'selected-cell';
    } else if (isStartCell) {
      return 'start-cell';
    } else if (isDestinationCell) {
      return 'destination-cell';
    } else if (isStartCellRival){
      return 'start-cell'
    } else if (isDestinationCellRival) {
      return 'destination-cell'
    }
    else{      
      return isEven ? boardColor?.blackTile ||  'black-tile-azul' : boardColor?.whiteTile || 'white-tile-azul';
    }
  };

  const board = [];

 if(infUser?.color === 'white' ){
  for (let j = VERTICAL_AXIS.length-1; j >= 0; j--) {
  for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {

    let image = undefined;

    pieces.forEach(p => {
      if (p.x === i && p.y === j) {
        image = p.image;
      }
    });
    
    
    const isPossibleMove =  selectedPiece && possibleMoves.some((move) => move.x === i && move.y === j);
    
    const isPossibleCaptures = possibleCaptures.some((move) => move.x === i && move.y === j) 

    board.push(
      <div
        className={
          `tile ${getCellClass(i, j)} 
           ${isPossibleMove ? 'possible-move' : ''} 
           ${isPossibleCaptures ? 'possible-capture' : ''}`
        }
        key={`${HORIZONTAL_AXIS[i]}${VERTICAL_AXIS[j]}`}
        onMouseDown={() => handleTileClick(i, j)}
        ref={ref}
      >
        {j === 0 ? <div className="tile-content">{HORIZONTAL_AXIS[i]}</div> : null}
        {i === 0 ? <div className="tile-content-num">{VERTICAL_AXIS[j]}</div> : null}
        {image && (
         <img
            src={image}
            onClick={() => {
              const clickedPiece = pieces.find((p) => p.x === i && p.y === j);
              if (clickedPiece) {
                handlePieceClick(clickedPiece, i, j);
              }
            }}
            key={`${i}, ${j}`}
            className={`chess-piece ${
              selectedPiece === pieces.find((p) => p.x === i && p.y === j)
                ? 'selected'
                : ''
            }`}
            onMouseDown={(e) => handleMouseDown(e, pieces.find(p => p.x === i && p.y === j), i, j)}
         />         
        )}
      </div>
    );
  }
}}else{
  for (let j = 0; j < VERTICAL_AXIS.length;  j++) {
  for (let i = VERTICAL_AXIS.length-1; i >=0; i--) {
    
    let image = undefined;

    pieces.forEach(p => {
      if (p.x === i && p.y === j) {
        image = p.image;
      }
    });
    
    
    const isPossibleMove =  selectedPiece && possibleMoves.some((move) => move.x === i && move.y === j);
    
    const isPossibleCaptures = possibleCaptures.some((move) => move.x === i && move.y === j) 

    board.push(
      <div
        className={
          `tile ${getCellClass(i, j)} 
           ${isPossibleMove ? 'possible-move' : ''} 
           ${isPossibleCaptures ? 'possible-capture' : ''}`
        }
        key={`${HORIZONTAL_AXIS[i]}${VERTICAL_AXIS[j]}`}
        onMouseDown={() => handleTileClick(i, j)}
        ref={ref}
      >
       
        {j === 7 ? <div className="tile-content">{HORIZONTAL_AXIS[i]}</div> : null}
        {i === 7 ? <div className="tile-content-num">{VERTICAL_AXIS[j]}</div> : null}
        {image && (
         <div
            style={{backgroundImage: `url(${image})`}}
            onClick={() => {
              const clickedPiece = pieces.find((p) => p.x === i && p.y === j);
              if (clickedPiece) {
                handlePieceClick(clickedPiece, i, j);
              }
            }}
            key={`${i}, ${j}`}
            className={`chess-piece ${
              selectedPiece === pieces.find((p) => p.x === i && p.y === j)
                ? 'selected'
                : ''
            }`}
            onMouseDown={(e) => handleMouseDown(e, pieces.find(p => p.x === i && p.y === j), i, j)}

         />         
        )}
      </div>
    );
  }
}
}
 
  return (
    <>
     <div className='display'>
    
     <div className='profile-container-chess'>
      <div className='space1'>
        <PlayerInf2
            playerName={infUser?.username} 
            playerIcon={infUser?.photo}
            playerColor={infUser?.color}  
            infUser={infUser} 
            playerTime={infUser?.color === 'black' ? formatTime(whiteTime) : formatTime(blackTime)} 
            currentTurn={ currentTurn === (infUser?.color === 'white' ? 'black' : 'white') ? infUser?.color === 'white' ? 'black' : 'white' : '' }
        />
      </div>
      <div id="chessboard" ref={chessboardRef}>     
      {board}
      {isGameOver ? <ModalCheckMate infUser={userWon} time={infUser?.time} revanchaHandle={revanchaHandle} frase={frase}/> : null}
      {modaltime && <Modal 
                      infUser={infUser} 
                      user={auth?.user} 
                      isWhiteTime={isWhiteTime} 
                      revanchaHandle={revanchaHandle}
                      />
      }
      {aceptarRevancha && <ModalRevancha 
                            infUser={infUser} 
                            AceptarRevancha={AceptarRevancha}
                          />
      }
      {modalAbandonar && <ModalAbandonar 
                           yesHandle={yesHandle} 
                           notHandle={notHandle}
                         />}
      {modalTablasAceptada && <ModalTablasAceptada 
                                infUser={infUser} 
                                revanchaHandle={revanchaHandle} 
                                frase={frase}
                              />}
      {modalTablas && <ModalTablas 
                        infUser={infUser} 
                        cancelarTablas={cancelarTablas}
                      />}
      {modalSendTablas && <ModalSendTablas 
                              infUser={infUser} 
                              rechazarTablas={rechazarTablas} 
                              aceptarTablas={aceptarTablas}
                          />}
      {promotionModalOpen && (
        <PromotionPiece 
        currentTurn={currentTurn}
        handlePromotionSelection={handlePromotionSelection}
        />
      )}
      </div>
      <div className='space'>
        <PlayerInfo        
          playerName={auth?.user?.username} 
          playerIcon={auth?.user?.photo}  
          playerColor={infUser?.color === 'white' ? 'black' : 'white'}
          infUser={userChess}
          time={infUser?.time} 
          playerTime={infUser?.color === 'black' ? formatTime(blackTime) : formatTime(whiteTime)} 
          currentTurn={currentTurn === infUser?.color ? infUser?.color : ''}
        />
      </div>
     </div>     
     <div  className='move-container'>
        <div className='register' style={{background: boardColor.register || 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' }}>
          <h5>Registro de jugadas</h5>       
        </div>
        <RecordPlays whiteMoveLog={whiteMoveLog} blackMoveLog={blackMoveLog}/>
        <ChatChess 
           room={room}
           username={auth?.user?.username}
           socket={socket}
         />
         <BoardInfo ofrecerTablas={ofrecerTablas} abandonarHandle={abandonarHandle}/>
    </div>
     </div>
     
    </>
  );
}

export default memo(Chessboard);
