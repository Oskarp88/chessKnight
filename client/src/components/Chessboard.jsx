import React, { useEffect, useState, useRef , memo} from 'react';
import './Chessboard.css';
import { PieceType } from '../Types';
import { useChessboardContext } from '../context/boardContext';
import { getCaptureFunction, getMovesFunction, handleThreefoldRepetition, insufficientMaterial, isDrownedKing, isMoveValid, isStalemate } from './referee/Referee';
import { HORIZONTAL_AXIS, VERTICAL_AXIS, initPieces } from '../Constants';
import toqueSound from '../path/to/tocar.mp3';
import soltarSound from '../path/to/soltar.mp3';
import victorySound from '../path/to/VICTORIA.mp3';
import derrotaSound from '../path/to/derrota.mp3'
import {isCheckmateAfterMove, isDrownedKingMove, isSimulatedMoveCausingCheck, isSimulatedMoveCheckOpponent, simulateKingCheckMate, simulateMove } from './pieces/King';
import { useSocketContext } from '../context/socketContext';
import { useAuth } from '../context/authContext';
import PlayerInfo from './profileUser/PlayerInfo';
import Modal from './modal/Modal';
import ModalTablas from './modal/ModalTablas';
import ModalRevancha from './modal/ModalRevancha';
import ModalCheckMate from './modal/ModalCheckMate';
import ModalAbandonar from './modal/ModalAbandonar';
import ModalRendicion from './modal/ModalRendicion';
import { useCheckMateContext } from '../context/checkMateContext';
import ModalSendTablas from './modal/ModalSendTablas';
import ModalTablasAceptada from './modal/ModalTablasAceptada';
import PlayerInf2 from './profileUser/playerInf2';
import ChatChess from './ChatChess';
import { baseUrl, getRequest } from '../utils/services';
import ConfirmationModal from './modal/ConfirmationModal';
import { json, useNavigate } from 'react-router-dom';

function Chessboard() {

  const {
     socket, 
     setSocket, 
     room, 
     setRoom, 
     infUser, 
     userChess, 
     setInfUser, 
     setUser
    } = useSocketContext();
  const {auth} = useAuth();
  const {checkMate ,setCheckMate} = useCheckMateContext();
  const {boardColor, setBoardColor} = useChessboardContext();  
  const [currentTurn, setCurrentTurn] = useState('white');
  const [pieces, setPieces] = useState(initPieces);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [startCell, setStartCell] = useState(null);
  const [destinationCell, setDestinationCell] = useState(null);
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

  const ref = useRef();
  const moveLogContainerRef = useRef(null);

  console.log(infUser?.color, 'colorChess')

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
    // Ajusta el scroll al final del contenedor
    moveLogContainerRef.current.scrollTop = moveLogContainerRef.current.scrollHeight;
  }, [whiteMoveLog,blackMoveLog]);

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
          color: infUser?.color === 'white' ? 'black' : 'white'
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
        setTied(true);
        setUserWon(prev => ({
          ...prev, 
          username: auth?.user?.username, 
          nameOpponent: data?.username, 
          idUser: auth?.user?._id,
          idOpponent: data?.idUser,
          turn: data?.color === 'white' ? 'black' : 'white',
          status: '1',
          color: infUser?.color === 'white' ? 'black' : 'white'
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
      setPieces(pieces);
      setDestinationCell(null);
      setSelectedPiece(null);
      
      if (piece && piece.type === PieceType.PAWN) {
        if (piece.x !== x || piece.y !== y) {
          const dy = y - piece.y;
          if (Math.abs(dy) === 2) {
            //el peón avanzó dos casillas, y configura enPassantTarget.
            setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
          }      
        }
      }

      setStartCell({x: piece.x, y: piece.y});
      setDestinationCell({ x, y }); // Establece la casilla de destino
      localStorage.setItem('startCell', JSON.stringify({x: piece.x, y: piece.y}));
      localStorage.setItem('destinationCell', JSON.stringify({x,y}));
     
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
    const move = `${
      piece?.type?.charAt(0) === 'p'
        ? ''
        : (piece?.type?.charAt(0).toLocaleUpperCase()) || ''
    }${HORIZONTAL_AXIS[piece?.x]}${VERTICAL_AXIS[piece?.y]}->${HORIZONTAL_AXIS[x]}${VERTICAL_AXIS[y]}`;
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
    // Lógica para manejar la selección de la pieza de promoción
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
    if(infUser?.color !== currentTurn) return;
    if (piece && piece.color === currentTurn) {
      if (selectedPiece && piece.x === selectedPiece.x && piece.y === selectedPiece.y) {        
        setStartCell(null); // Limpia la casilla de inicio
        setDestinationCell(null);
      } else {
        toqueAudio.play(); 
        setSelectedPiece(piece);
        setStartCell({ x, y }); // Establece la casilla de inicio     
        localStorage.setItem('startCell', JSON.stringify({x,y}));
      }
    }
  };
  
  const handleTileClick = async(x, y) => {
    if(tied === true) return;
    if(infUser?.color !== currentTurn) return;
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
        const checkMate =  isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
        
        if(checkMate){
          victoryAudio.play();
          setUserWon(prev => ({
            ...prev, 
            username: auth?.user?.username,
            nameOpponent: infUser?.username, 
            idUser: auth?.user?._id,
            idOpponent: infUser?.idOpponent,
            turn: infUser?.color === 'white' ? 'black' : 'white',
            status: '1',
            color: infUser?.color === 'white' ? 'black' : 'white'
          }));
        
         if(socket ===null) return; 
          setCheckMate(prevCheckMate => ({
            ...prevCheckMate,
            userId: auth?.user?._id,
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
      localStorage.removeItem('userChess');
      localStorage.removeItem('infUser');

       localStorage.setItem('chessboard',
        JSON.stringify({ 
          room,  
          checkMate,
          userChess,
          infUser,
          currentTurn: currentTurn === 'white' ? 'black' : 'white'
      }));
      if(selectedPiece){
        const move = `${
          selectedPiece?.type?.charAt(0) === 'p'
            ? ''
            : (selectedPiece?.type?.charAt(0).toLocaleUpperCase()) || ''
        }${HORIZONTAL_AXIS[selectedPiece?.x]}${VERTICAL_AXIS[selectedPiece?.y]}->${HORIZONTAL_AXIS[x]}${VERTICAL_AXIS[y]}`;
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

    console.log('countNoCapture:', countNoCapture);
       localStorage.setItem('pieces', JSON.stringify(updatedPieces));
        return updatedPieces;
      });
    }
  };
   
  function onDragStart(e, piece) {
    
    if (piece && piece.color === currentTurn) {
      // Establecer la pieza clickeada como la seleccionada
      setSelectedPiece(piece);

      e.dataTransfer.effectAllmoved ='move';
      e.dataTransfer.setData('application/json', JSON.stringify(piece));
      // Establecer la opacidad de la imagen mientras se arrastra
      
      setTimeout(()=>{
        e.target.style.display = 'none';
      },0)
    }
  }

  const onDragEnd = (e) => {
    e.target.style.display = 'block';
  }
  
  const onDrop = async(e, x, y) => {
    e.preventDefault();    
 
    const jsonData = e.dataTransfer.getData('application/json');
    
    if(jsonData){
      const droppedPiece = JSON.parse(e.dataTransfer.getData('application/json'));
  
      if (droppedPiece && droppedPiece.type === PieceType.PAWN) {
        if (droppedPiece.x !== x || droppedPiece.y !== y) {
          const dy = y - droppedPiece.y;
          if (Math.abs(dy) === 2) {
            // Esto significa que el peón avanzó dos casillas, y puedes configurar enPassantTarget.
            setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
          }      
        }
      }
        if(!droppedPiece) return;

        if(isMoveValid(
            droppedPiece.type, 
            droppedPiece, 
            x, y,
            pieces, 
            enPassantTarget,
            currentTurn)){

          if (enPassantTarget && x === enPassantTarget.x && 
              y === enPassantTarget.y && droppedPiece.type === PieceType.PAWN) {
            const pieceAtDestination = pieces.find((p) => 
              p.x === enPassantTarget.x && p.y === enPassantTarget.y-1 
              || p.x === enPassantTarget.x && p.y === enPassantTarget.y+1);
            pieces.splice(pieces.indexOf(pieceAtDestination), 1);             
          }  

          const pieceData = {
            pieces,
            piece: droppedPiece,
            x,
            y,
            turn: currentTurn === 'white' ? 'black' : 'white',
            author: auth?.user?.username,
            room
          };

          // Intentar manejar el jaque y el jaque mate después de cada movimiento
        const check = await isSimulatedMoveCausingCheck(droppedPiece, x, y, pieces);

        if (check) {
          // Implementar la lógica para manejar el jaque mate
          console.log('¡Jaque mate!');
          return
        } 
      
          movePiece(droppedPiece, x, y);
          setSelectedPiece(null);
          setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
          setDestinationCell({ x, y });
          
          await socket.emit("send_move", pieceData);
          soltarAudio.play();
        };
    }else{
      console.error('no hay datos JSON para parsear')
    }
  };
  
  const onDragOver = (e) => {
    e.preventDefault();
  };
  
  const resetBoard = () => {
    localStorage.removeItem('destinationCell');
    localStorage.removeItem('startCell');
    setFrase(null);
    setModalTiedRepetition(false);
    setTied(false);
    setModalTablasAceptada(false);
    setPieces(initPieces);
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
    setRendicion(true);
    setTied(true);
    setModalAbandonar(false);
    setGameOver(true)
    setCheckMate((prevCheckMate) => ({
      ...prevCheckMate,
      userId: auth?.user?._id,
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
      color: infUser?.color === 'white' ? 'black' : 'white'
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
        onDrop={(e) => onDrop(e, i, j)}
        onDragOver={onDragOver}
      >
        {j === 0 ? <div className="tile-content">{HORIZONTAL_AXIS[i]}</div> : null}
        {i === 0 ? <div className="tile-content-num">{VERTICAL_AXIS[j]}</div> : null}
        {image && (
         <img
            src={image}
            onMouseDown={() => {
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
            onDragStart={(e) => 
              {const clickedPiece = pieces.find((p) => p.x === i && p.y === j);
                if (clickedPiece) {
                  onDragStart(e,clickedPiece);
                }
              }
            }
            onDragEnd={onDragEnd}
            draggable={true}
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
        onDrop={(e) => onDrop(e, i, j)}
        onDragOver={onDragOver}
      >
       
        {j === 7 ? <div className="tile-content">{HORIZONTAL_AXIS[i]}</div> : null}
        {i === 7 ? <div className="tile-content-num">{VERTICAL_AXIS[j]}</div> : null}
        {image && (
         <img
            src={image}
            onMouseDown={() => {
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
            onDragStart={(e) => 
              {const clickedPiece = pieces.find((p) => p.x === i && p.y === j);
                if (clickedPiece) {
                  onDragStart(e,clickedPiece);
                }
              }
            }
            onDragEnd={onDragEnd}
            draggable={true}
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
            playerIcon={infUser?.idOpponent && `http://localhost:8080/api/user-photo/${infUser.idOpponent}`}
            playerColor={infUser?.color}  
            infUser={infUser} 
            playerTime={infUser?.color === 'black' ? formatTime(whiteTime) : formatTime(blackTime)} 
            currentTurn={ currentTurn === (infUser?.color === 'white' ? 'black' : 'white') ? infUser?.color === 'white' ? 'black' : 'white' : '' }
        />
      </div>
      <div id="chessboard">     
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
        <div className="promotion-modal">
          <h2>Elige una pieza de promoción</h2>
          <div className="promotion-options">
            {[
              { type: PieceType.ROOK, image: `assets/images/${currentTurn === 'white' ? 'b' : 'w'}r.png` },
              { type: PieceType.KNIGHT, image: `assets/images/${currentTurn === 'white' ? 'b' : 'w'}n.png` },
              { type: PieceType.BISHOP, image: `assets/images/${currentTurn === 'white' ? 'b' : 'w'}b.png` },
              { type: PieceType.QUEEN, image: `assets/images/${currentTurn === 'white' ? 'b' : 'w'}q.png` },
            ].map((option) => (
              <div
                key={option.type}
                className="promotion-option"
                onClick={() => handlePromotionSelection(option)}
              >
                <img src={option.image} alt={option.type} />
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
      <div className='space'>
        <PlayerInfo        
          playerName={auth?.user?.username} 
          playerIcon={`http://localhost:8080/api/user-photo/${auth?.user?._id}`}  
          playerColor={infUser?.color === 'white' ? 'black' : 'white'}
          infUser={userChess}
          time={infUser?.time} 
          playerTime={infUser?.color === 'black' ? formatTime(blackTime) : formatTime(whiteTime)} 
          currentTurn={currentTurn === infUser?.color ? infUser?.color : ''}
        />
      </div>
     </div>
     {/* <div className='display-board'> */}
     
     <div  className='move-container'>
        <div className='register' style={{background: boardColor.register || 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' }}>
          <h5>Registro de jugadas {window.innerWidth}</h5>       
        </div>
        <div ref={moveLogContainerRef} className="move-log-container" style={{background: boardColor.register || 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' }}>       
           <div className="move-log">
            <ul>
              {whiteMoveLog.map((move, index) => (
                <li className='move-li-white' key={index}> {index+1}.   {move && move === 'Ke1->c1' ? '0-0-0' : move === 'Ke1->g1' ? '0-0' : move}</li>
              ))}
            </ul>
          </div>
          <div className="move-log">
            <ul>
              {blackMoveLog.map((move, index) => (
                <li className='move-li-black' key={index}>{move && move === 'Ke8->c8' ? '0-0-0' : move === 'Ke8->g8' ? '0-0' : move }</li>
              ))}
            </ul>
          </div>
        </div>
        <ChatChess 
           room={room}
           username={auth?.user?.username}
           socket={socket}
         />
        <div className='container-inf' style={{background: boardColor?.register || 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' }}>
          <div className='container-datos' >
            <button className='tablas1' onClick={ofrecerTablas}>
                <img src={'fondos/pngwing.png'}/>
                <img src={'fondos/pngwing.png'}/>
                <div className='a'>Ofrecer tablas</div>
            </button>
            <div className='container-abandonar'>
              <div className='abandonar' onClick={abandonarHandle}>
                <div className='icon-Flag'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-flag-fill" viewBox="0 0 16 16">
                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                  </svg> 
                </div>
                <div className='a'>Abandonar</div> 
              </div>
            </div>
          </div>
          <div className='partida'>
              <h3>NUEVA PARTIDA</h3>
              <a><b>{auth?.user?.username}</b> contra <b>{infUser?.username}</b></a>
          </div>
        </div>
    </div>
     </div>
     {/* </div> */}
     
    </>
  );
}

export default memo(Chessboard);
