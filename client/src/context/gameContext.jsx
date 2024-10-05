import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useChessboardContext } from "./boardContext";
import { isCheckmateAfterMove, isSimulatedMoveCausingCheck, isSimulatedMoveCheckOpponent } from "../components/pieces/King";
import { useSocketContext } from "./socketContext";
import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "../Constants";
import { PieceType } from "../Types";
import { useAuth } from "./authContext";
import { useCheckMateContext } from "./checkMateContext";
import { handleThreefoldRepetition, insufficientMaterial, isMoveValid, isStalemate } from "../components/referee/Referee";

export const GameContext = createContext();

export const GameContextProvider = ({children, user}) => {
    const {auth} = useAuth();
    const {pieces,setPieces, resetPieces} = useChessboardContext();
    const {checkMate ,setCheckMate} = useCheckMateContext();
    const {room, setRoom, userChess, infUser, setInfUser, setUser, gamesUpdate, socket} = useSocketContext();
    const [whiteMoveLog, setWhiteMoveLog] = useState([]);
    const [blackMoveLog, setBlackMoveLog] = useState([]);
    const [moveLog, setMoveLog] = useState([]);
    const [countNoCapture, setCountNoCapture] = useState(0);
    const [currentTurn, setCurrentTurn] = useState('white');
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [startCell, setStartCell] = useState(null);
    const [startCellRival, setStartCellRival] = useState(null);
    const [destinationCell, setDestinationCell] = useState(null);
    const [destinationCellRival, setDestinationCellRival] = useState(null);
    const [kingCheckCell, setKingCheckCell] = useState(null);
    const [enPassantTarget, setEnPassantTarget] = useState(null);
    const [pieceAux, setPieceAux] = useState(null);
    const [userWon, setUserWon] = useState(null);
    const [promotionModalOpen, setPromotionModalOpen] = useState(false);
    const [isPromotionComplete, setPromotionComplete] = useState(false);
    const [modaltime, setModalTime] = useState(false);
    const [isGameOver, setGameOver] = useState(false);
   
    const [whiteTime, setWhiteTime] = useState(parseInt(infUser.time));
    const [blackTime, setBlackTime] = useState(parseInt(infUser.time));
    const [isWhiteTime, setIsWhiteTime] = useState('');
    const [loadingTablas, setLoadingTablas] = useState(false);
    const [modalTablas, setModalTablas] = useState(false);
    const [modalSendTablas, setSendTablas] = useState(false);
    const [modalTablasAceptada, setModalTablasAceptada] = useState(false);
    const [aceptarRevancha, setAceptarRevancha] = useState(false);
    const [modalAbandonar, setModalAbandonar] = useState(false);
    const [modalRendicion, setModalRendicion] = useState(false);
    const [sendRevancha, setSendRevancha] = useState(false);
    const [sendRevanchaRechada, setRevanchaRechazada] = useState(false);  
    const [tied, setTied] = useState(false);
    const [modalTiedRepetition, setModalTiedRepetition] = useState(false);
    const [frase, setFrase] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [color, setColor] = useState('');
    const [textToast, setTextToast] = useState('');
    const [isConnected, setIsConnected] = useState(null);
    const [playerDisconnected, setPlayerDisconnected] = useState(false);
    const [reconnectionTimeout, setReconnectionTimeout] = useState(null);

    useEffect(() => {
        if(socket === null) return;
        const handleConnect = () => {
          console.log("Conexión al servidor establecida.");
          // setTextToast("Conexión al servidor establecida.");
          // setColor('#58d68d');
          // setShowToast(true);
          socket.emit('joinRoomGamePlay', room);    
        };
         // Manejar el evento "connect" para detectar la conexión exitosa
        socket.on("connect", handleConnect);
        // Manejar el evento "disconnect" para detectar desconexiones
        socket.on("disconnect", (reason) => {
          console.log("Desconectado. Razón:", reason);
          // setTextToast("Desconectado. Razón:", reason);
          setIsConnected(false);
          // Iniciar un temporizador de reconexión
          const timeout = setTimeout(() => {
            if (!isConnected) {
              socket.emit('playerLeft', { playerId: socket.id, gameId: room });
              console.log('Se ha perdido la conexión por más de 30 segundos');
              setGameOver(true);
            }
          }, 30000); // 30 segundos para intentar reconectar
  
            setReconnectionTimeout(timeout);        
            socket.emit('playerLeft', { playerId: auth?.user?._id, gameId: room, timeout });
        });
  
         // Escuchar si el otro jugador se desconectó
        socket.on('playerDisconnected', (data) => {
          setTextToast(`El jugador con ID ${data.playerId} se ha desconectado: ${data.reason}`);
          setPlayerDisconnected(true);
        });
        socket.on("reconnect", (attemptNumber) => {
          setTextToast(`Reconectado en el intento ${attemptNumber}`);
          setColor('#58d68d');
          setShowToast(true);
          // Realiza cualquier lógica adicional que necesites después de la reconexión
          socket.emit('playerLeft', { playerId: auth?.user?._id, gameId: room });
          socket.emit('joinRoomGamePlay', room); 
        });
        socket.on("reconnect_error", (error) => {
          console.log("Error al intentar reconectar:", error);
          // Puedes implementar una lógica de manejo de errores personalizada aquí
        });
  
        socket.on("reconnect_failed", () => {
          console.log("Fallo al reconectar. No se pudo restablecer la conexión.");
          socket.emit('playerLeft', { playerId: auth?.user?._id, gameId: room });
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
          isCheckMate('empate');
        })
  
        socket.on('receiveTiempo', (data) => {
          if (data?.turno === 'white') {
              setWhiteTime(parseInt(data?.whiteTime));                 
          } else {
            setBlackTime(parseInt(data?.blackTime));       
          }       
        });
  
        socket.on('revanchaAceptada', async(data)=>{      
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

        socket.emit('joinRoomGamePlay', room);
  
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
          isCheckMate('empate');
        })
        socket.on('receiveCheckMate',(data) => {
          // derrotaAudio.play();
          isCheckMate('derrota');
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
          // victoryAudio.play();
          isCheckMate('victoria');
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
        // socket.on("opponentMove", handleOpponentMove);
  
        return () => {   
            socket.off("connect", handleConnect);   
            // socket.off("opponentMove", handleOpponentMove);
            socket.off('connect');
            socket.off('disconnect');
            socket.off('playerDisconnected');
            clearTimeout(reconnectionTimeout);    
        };
    }, [socket, reconnectionTimeout] );

    useEffect(()=>{
        const data = localStorage.getItem('chessboard');
        if (data) {
          const parseData = JSON.parse(data);
          setUser(parseData.userChess);
          setCurrentTurn(parseData.currentTurn);
        }
        const dataMove = localStorage.getItem('move');
        if (dataMove) {
          const parseData = JSON.parse(dataMove);
          setBlackMoveLog(parseData.blackMoveLog);
          setWhiteMoveLog(parseData.whiteMoveLog);
          setMoveLog(parseData.moveLog);
        }
        const dataInfUser = localStorage.getItem('infUser');
        if(dataInfUser){
          setInfUser(JSON.parse(dataInfUser));
        }
        const gameRoom = localStorage.getItem('gameRoom');
        if(gameRoom){
          setRoom(gameRoom)
        }
    },[socket]);

    useEffect(()=>{
      const data = localStorage.getItem('chessboard');
      if (data) {
        const parseData = JSON.parse(data);
        setUser(parseData.userChess);
        setCurrentTurn(parseData.currentTurn);
      }
      const dataMove = localStorage.getItem('move');
      if (dataMove) {
        const parseData = JSON.parse(dataMove);
        setBlackMoveLog(parseData.blackMoveLog);
        setWhiteMoveLog(parseData.whiteMoveLog);
        setMoveLog(parseData.moveLog);
      }
      const dataInfUser = localStorage.getItem('infUser');
        if(dataInfUser){
          setInfUser(JSON.parse(dataInfUser));
        }
  },[])

    useEffect(() => {
      if(socket === null) return;
      socket.on("opponentMove", handleOpponentMove);
      socket.on('receiveReconnectMove', () => {
        const data = localStorage.getItem('send_move');
        console.log('recibi el reconnect', JSON.parse(data))
        if (data) {
          const parseData = JSON.parse(data);
          socket.emit("get_last_move", parseData);
        }
      });
      return () => {
        socket.off("opponentMove", handleOpponentMove)
      }
     
    },[socket]);

    useEffect(()=>{
        if (socket) {
            socket.on("connect", () => {
                // Emitir evento una vez que el socket se reconecta después de recargar
                socket.emit("reconnectMove", room);
                console.log('se envio el reconnet')
            });
        }
    
        // Limpieza al desmontar el componente
        return () => {
            if (socket) {
                socket.off("connect"); // Desactivar el listener de "connect" al desmontar el componente
            }
        };
    },[socket]);
  
  useEffect(()=>{
    
    if(countNoCapture === 100) {
      console.log('empate por inactividad de captura');
      setFrase('por inactividad de captura');
      setModalTablasAceptada(true);
      setTied(true);
      isCheckMate('empate');
    }
  },[countNoCapture]);

  useEffect(()=>{
    const  isInsufficientMaterial = insufficientMaterial(pieces);

    if(isInsufficientMaterial){
        setFrase('Empate por material insuficiente');
        setTied(true);
        setModalTablasAceptada(true);
        isCheckMate('empate');
    }  
  },[pieces]);

useEffect(()=>{
  const tiedRepetition = handleThreefoldRepetition(moveLog);
  
  if(tiedRepetition){
    setFrase('Tablas por repetición');
    setTied(true);
    setModalTablasAceptada(true);
    isCheckMate('empate');
  }
 },[moveLog]);
  
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
    
    if (!isGameOver && !tied && whiteTime > 0 && blackTime > 0 ) {
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
        isCheckMate('derrota');
      } else {
        isCheckMate('victoria');
      }
    }
  }, [whiteTime, blackTime]);
  //     const handleConnect = () => {
  //       console.log("Conexión al servidor establecida.");
  //       setTextToast("Conexión al servidor establecida.");
  //       setColor('#58d68d');
  //       setShowToast(true);
    
  //       // Emite los eventos necesarios al conectar
  //       socket.emit('requestLatestGameState', room);
  //       socket.emit('joinRoomGamePlay', room);
    
  //       // Oculta el toast después de 5 segundos
  //       setTimeout(() => {
  //         setShowToast(false);
  //       }, 5000);
  //     };
  //      // Manejar el evento "connect" para detectar la conexión exitosa
  //     socket.on("connect", handleConnect);
  //     // Manejar el evento "disconnect" para detectar desconexiones
  //     socket.on("disconnect", (reason) => {
  //       console.log("Desconectado. Razón:", reason);
  //       setTextToast("Desconectado. Razón:", reason);
  //       setIsConnected(false);
  //       // Iniciar un temporizador de reconexión
  //       const timeout = setTimeout(() => {
  //         if (!isConnected) {
  //           socket.emit('playerLeft', { playerId: socket.id, gameId: room });
  //           console.log('Se ha perdido la conexión por más de 30 segundos');
  //           setGameOver(true);
  //         }
  //       }, 30000); // 30 segundos para intentar reconectar

  //         setReconnectionTimeout(timeout);        
  //         socket.emit('playerLeft', { playerId: auth?.user?._id, gameId: room, timeout });
  //     });

  //      // Escuchar si el otro jugador se desconectó
  //     socket.on('playerDisconnected', (data) => {
  //       setTextToast(`El jugador con ID ${data.playerId} se ha desconectado: ${data.reason}`);
  //       setPlayerDisconnected(true);
  //     });
  //     socket.on("reconnect", (attemptNumber) => {
  //       setTextToast(`Reconectado en el intento ${attemptNumber}`);
  //       setColor('#58d68d');
  //       setShowToast(true);
  //       // Realiza cualquier lógica adicional que necesites después de la reconexión
  //       socket.emit('playerLeft', { playerId: auth?.user?._id, gameId: room });
  //       socket.emit('joinRoomGamePlay', room); 
  //     });
  //     socket.on("reconnect_error", (error) => {
  //       console.log("Error al intentar reconectar:", error);
  //       // Puedes implementar una lógica de manejo de errores personalizada aquí
  //     });

  //     socket.on("reconnect_failed", () => {
  //       console.log("Fallo al reconectar. No se pudo restablecer la conexión.");
  //       socket.emit('playerLeft', { playerId: auth?.user?._id, gameId: room });
  //     });

  //     socket.on('latestGameState', (latestGameState) => {
  //       // Actualiza el contexto de 'games' con el estado más reciente de la partida
  //      socket.emit('sendGameState', {latestGameState, room}) // Maneja el movimiento del oponente con la nueva data
  //     });
  //     socket.on('receiveGameState',(data)=>{
  //       console.log('receiveGameState', data)
  //     })
  //     socket.on("pawn_promotion", (data)=>{

  //       setPieces(data.pieces)
  //       setCurrentTurn(data.currentTurn);
  //       setDestinationCell({x: data.destinationCell.x, y: data.destinationCell.y});
  //       setSelectedPiece(null);
  //       setStartCell(null);

  //       const updatedPieces = data.pieces.map((p) => {
  //         if (p.x === data.destinationCell.x && p.y === data.destinationCell.y && p.type === PieceType.PAWN) {
  //               return { ...data.promotionPiece, x: p.x, y: p.y, color: data.currentTurn === 'white' ? 'black' : 'white' };
  //         }
  //         return p;
  //       });

  //       setPieces(updatedPieces);
  //     });
   
  //     socket.on('receiveRevancha', (data) => {
  //       setModalTablasAceptada(false);
  //       setModalRendicion(false);
  //       setModalTiedRepetition(false);
  //       setAceptarRevancha(data?.revancha);    
  //     });

  //     socket.on('receiveStalemate', (data) => {
  //       setFrase('por Rey ahogado');
  //       setModalTablasAceptada(data.state);
  //       setTied(true);
  //       isCheckMate('empate');
  //     })

  //     socket.on('receiveTiempo', (data) => {
  //       if (data?.turno === 'white') {
  //           setWhiteTime(parseInt(data?.whiteTime));                 
  //       } else {
  //         setBlackTime(parseInt(data?.blackTime));       
  //       }       
  //     });

  //     socket.on('revanchaAceptada', async(data)=>{ 
  //       localStorage.removeItem('pieces'); 
  //       localStorage.removeItem('whiteTime');
  //       localStorage.removeItem('blackTime');
  //       localStorage.removeItem('destinationCell');
  //       localStorage.removeItem('startCell');      
  //       setInfUser((prevInfUser) => ({
  //         ...prevInfUser,
  //         color: data?.color === 'white' ? 'black' : 'white',
  //       }));
  //       setUser((prevInfUser) => ({
  //         ...prevInfUser,
  //         color: data?.color === 'white' ? 'black' : 'white',
  //       }));
  //         resetBoard();
  //     });

  //     socket.on('receiveRevanchaRechazada',(data) => {
  //       setRevanchaRechazada(true);
  //       setSendRevancha(false);
  //     })

  //     socket.on('receiveTablas',(data) => {     
  //          setSendTablas(true);      
  //     });
  //     socket.on('receiveCancelarTablas', (data) => {
  //        setSendTablas(false);
  //     })
  //     socket.on('receiveRechazarTablas', () => {
  //       setModalTablas(false);
  //     })
  //     socket.on('receiveAceptarTablas', () => {
  //       localStorage.removeItem('whiteTime');
  //       localStorage.removeItem('blackTime'); 
  //       setModalTablas(false);
  //       setSendTablas(false);
  //       setModalTablasAceptada(true);
  //       isCheckMate('empate');
  //     })
  //     socket.on('receiveCheckMate',(data) => {
  //       // derrotaAudio.play();
  //       isCheckMate('derrota');
  //       setUserWon(prev => ({
  //         ...prev, 
  //         username: auth?.user?.username, 
  //         nameOpponent: data?.username, 
  //         idUser: auth?.user?._id,
  //         idOpponent: data?.idUser,
  //         turn: data?.color,
  //         status: '0',
  //         color: infUser?.color === 'white' ? 'black' : 'white',
  //         photo: infUser?.photo
  //       }));
  //       setFrase('por !!Jaque Mate!!');
  //       setGameOver(true);
  //     })
  //     socket.on('receiveAbandonar',(data) => {
  //       localStorage.removeItem('whiteTime');
  //       localStorage.removeItem('blackTime');
  //       // victoryAudio.play();
  //       isCheckMate('victoria');
  //       setUserWon(prev => ({
  //         ...prev, 
  //         username: auth?.user?.username, 
  //         nameOpponent: data?.username, 
  //         idUser: auth?.user?._id,
  //         idOpponent: data?.idUser,
  //         turn: data?.color === 'white' ? 'black' : 'white',
  //         status: '1',
  //         color: infUser?.color === 'white' ? 'black' : 'white',
  //         photo: infUser?.photo
  //       }));
  //       setFrase(`por abandono de las ${data?.color === 'white' ? 'negras' : 'blancas'}`);
  //       setGameOver(true);
  //     })
  //     // socket.on("opponentMove", handleOpponentMove);

  //     return () => {   
  //         socket.off("connect", handleConnect);   
  //         // socket.off("opponentMove", handleOpponentMove);
  //         socket.off('connect');
  //         socket.off('disconnect');
  //         socket.off('playerDisconnected');
  //         clearTimeout(reconnectionTimeout);    
  //     };
  // }, [socket, reconnectionTimeout] );

  useEffect(() => {
    if (isPromotionComplete) {
      setPromotionComplete(false);
    }
  }, [isPromotionComplete, startCell]);

  useEffect(()=>{
    localStorage.setItem('move',JSON.stringify({
      whiteMoveLog,
      blackMoveLog,
      moveLog,
   }));
  },[moveLog]);

      // Convierte el tiempo en segundos en un formato legible (por ejemplo, "MM:SS")
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  //     setStartCell(null)
  //     setDestinationCell(null);
      
  //     if (piece && piece.type === PieceType.PAWN) {
  //       if (piece.x !== x || piece.y !== y) {
  //         const dy = y - piece.y;
  //         if (Math.abs(dy) === 2) {
  //           //el peón avanzó dos casillas, y configura enPassantTarget.
  //           setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
  //         }      
  //       }
  //     }

  //     setStartCellRival({x: piece.x, y: piece.y});
  //     setDestinationCellRival({ x, y }); // Establece la casilla de destino
  //     // localStorage.setItem('startCell', JSON.stringify({x: piece.x, y: piece.y}));
  //     // localStorage.setItem('destinationCell', JSON.stringify({x,y}));

  //     const isCheck = isSimulatedMoveCheckOpponent(piece, x, y, pieces, enPassantTarget, turn)
  //     const king = pieces.find((p) => p.type === PieceType.KING && p.color === turn);
  //     const checkMate =  isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
  //     if(isCheck){
       
  //       setKingCheckCell({x: king.x, y: king.y});
  //       // !checkMate && jakeAudio.play(); 
  //       // if(checkMate){
  //       //    jakeMateAudio.play();
  //       // }
  //      }  else{
  //        setKingCheckCell(null);
  //    }
   
  //   setPieces((prevPieces) => {
  //     const updatedPieces = prevPieces.map((p) => {
  //         // Verificar si el rey está en su posición inicial y va a hacer enroque corto o largo
  //         if (piece.type === PieceType.KING && piece.x === 4 && (piece.y === 0 || piece.y === 7)) {
  //             // Enroque corto
  //             if (x === 6 && (y === 0 || y === 7)) {
  //                 if (p.type === PieceType.ROOK && p.x === 7 && p.y === piece.y) {
  //                     // Mover la torre del enroque corto
  //                     return { ...p, x: 5, y: piece.y }; // La torre se mueve de (7, y) a (5, y)
  //                 }
  //             }
  //             // Enroque largo
  //             else if (x === 2 && (y === 0 || y === 7)) {
  //                 if (p.type === PieceType.ROOK && p.x === 0 && p.y === piece.y) {
  //                     // Mover la torre del enroque largo
  //                     return { ...p, x: 3, y: piece.y }; // La torre se mueve de (0, y) a (3, y)
  //                 }
  //             }
  //         }
  //         return p;
  //     });
  //     return updatedPieces;
  // });

     
  //     setPieces((prevPieces) => {
  //       let captureOccurred = false;
  //       // Crea una copia actualizada de la lista de piezas
  //       const updatedPieces = prevPieces.map((p) => {
          
  //         if (p.x === piece.x && p.y === piece.y) {
          
  //           // Encuentra la pieza que está siendo movida y actualiza su posición
  //           return { ...p, x, y };
  //         } else if (p.x === x && p.y === y && p.color !== piece.color) {
  //           // Si la casilla de destino está ocupada por una pieza enemiga, cápturala (no la incluyas en la nueva lista)
  //           captureOccurred = true;
            
  //           return null;
  //         } else {
  //           // Mantén inalteradas las otras piezas
           
  //           return p;
  //         }
  //       }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)

  //     // if(!isCheck || !checkMate){
  //     //   captureOccurred ? capturedAudio.play() : soltarAudio.play();
  //     // }
  //       moveNomenclatura(piece, captureOccurred, x, y);
             
  //       if (captureOccurred) {
  //         setCountNoCapture(0);
          
  //       } else {
  //         setCountNoCapture(prevCount => prevCount + 1);   
  //       }
  //       localStorage.setItem('pieces', JSON.stringify(updatedPieces));
  //       return updatedPieces;
  //     });

   

  //      localStorage.removeItem('userChess');
  //      localStorage.removeItem('infUser');

  //      localStorage.setItem('chessboard',
  //       JSON.stringify({
  //         room,  
  //         checkMate,
  //         userChess,
  //         infUser,
  //         currentTurn: turn
  //     }));
     
  // };

  // const handlePromotionSelection = async(promotionPiece) => {
  //   //  selección de la pieza de promoción
  //   // Reemplaza el peón con la pieza seleccionada
  //   const updatedPieces = pieces.map((p) => {
  //     if (p.x === destinationCell.x && p.y === destinationCell.y && p.type === PieceType.PAWN) {
  //       return {...promotionPiece, x: p.x, y: p.y, color: currentTurn === 'white' ? 'black' : 'white'};
  //     }
  //     return p;
  //   });

    
  //   setPieces(updatedPieces);
  //   const pieceData = {
  //     pieces,
  //     promotionPiece,
  //     destinationCell,
  //     currentTurn,
  //     author: auth?.user?.username,
  //     room
  //   }

  //   await socket.emit("promotion", pieceData);
  //   setPromotionModalOpen(false);
  // };
  
  // const handlePieceClick = (piece, x, y) => {
  //   if(tied === true) return;
  //   // if(infUser?.color !== currentTurn) return;
  //   if (piece && piece.color === infUser?.color) {
  //     if (selectedPiece && piece.x === selectedPiece.x && piece.y === selectedPiece.y) {        
  //       setDestinationCell(null);
  //     } else {
  //       // toqueAudio.play(); 
  //       setSelectedPiece(piece);
  //       setPieceAux(piece);
  //       setStartCell({ x, y }); // Establece la casilla de inicio     
  //       localStorage.setItem('startCell', JSON.stringify({x,y}));
  //     }
  //   }
  // };
  
  // const handleTileClick = async(x, y) => {
  //   if(tied === true) return;
  //   if(infUser?.color !== currentTurn) return;
  //    setStartCellRival(null);
  //    setDestinationCellRival(null);
  //   // Manejar el clic en una casilla para mover la pieza
  //   if (selectedPiece && selectedPiece.type === PieceType.PAWN) {
  //     if (selectedPiece.x !== x || selectedPiece.y !== y) {
  //       const dy = y - selectedPiece.y;
  //       if (Math.abs(dy) === 2) {
  //         // Esto significa que el peón avanzó dos casillas, y puedes configurar enPassantTarget.
  //         setEnPassantTarget({ x, y: y - (dy > 0 ? 1 : -1) });
  //       }      
  //     }
  //   }
  //   if (!selectedPiece) {
  //     return;
  //   }
    
  //   if (isMoveValid(
  //          selectedPiece.type, 
  //          selectedPiece, 
  //          x,y,pieces,
  //          enPassantTarget,
  //          currentTurn)) {

  //           const check =  isSimulatedMoveCausingCheck(selectedPiece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
     
  //           if (check) {
  //             // Implementar la lógica para manejar el jaque mate
  //             console.log('¡estas en jake');       
  //             return
  //           } 

  //           const isCheck = isSimulatedMoveCheckOpponent(selectedPiece, x, y, pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white')
  //           const king = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
     
  //     if( isCheck){
        
  //       setKingCheckCell({x: king.x, y: king.y});       
  //       const checkMate = selectedPiece && isCheckmateAfterMove(selectedPiece,x,y,pieces, enPassantTarget, currentTurn === 'white' ? 'black' : 'white');
  //       // !checkMate && jakeAudio.play();
  //       if(checkMate){
  //         // jakeMateAudio.play();
  //         // victoryAudio.play();
  //         setUserWon(prev => ({
  //           ...prev, 
  //           username: auth?.user?.username,
  //           nameOpponent: infUser?.username, 
  //           idUser: auth?.user?._id,
  //           idOpponent: infUser?.idOpponent,
  //           turn: infUser?.color === 'white' ? 'black' : 'white',
  //           status: '1',
  //           color: infUser?.color === 'white' ? 'black' : 'white',
  //           photo: infUser?.photo
  //         }));
        
  //        if(socket ===null) return; 
  //         isCheckMate('victoria');
  //         setFrase('por !!Jaque Mate!!');
  //         setGameOver(prevIsGameOver => {
  //           console.log("isGameOver:", !prevIsGameOver);
  //           return true;
  //         });
  //         if(socket ===null) return; 
  //         socket.emit('checkMate', {room, username: auth?.user?.username, idUser: auth?.user?._id, color: infUser?.color === 'white' ? 'black' : 'white'});
  //       }
        
  //     }else{
  //       setKingCheckCell(null);
  //     }
      
  //     const pieceData = {
  //       pieces,
  //       piece: selectedPiece,
  //       x,
  //       y,
  //       turn: currentTurn === 'white' ? 'black' : 'white',
  //       author: auth?.user?.username,
  //       room
  //     };
      
  //     movePiece(selectedPiece, x, y);    
  //     setSelectedPiece(null);
  //     setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
  //     setDestinationCell({ x, y });
  //     localStorage.setItem('destinationCell', JSON.stringify({x,y}));

  //      localStorage.setItem('chessboard',
  //       JSON.stringify({ 
  //         room,  
  //         checkMate,
  //         userChess,
  //         infUser,
  //         currentTurn: currentTurn === 'white' ? 'black' : 'white'
  //     }));
      
      
  //     if (selectedPiece.type === PieceType.PAWN && (y === 0 || y === 7)) {
  //       // Abrir el modal de promoción
  //       setPromotionModalOpen(true);
  //       return;
  //     }
      
  //     await socket.emit("send_move", pieceData);
  //     gamesUpdate(room, pieces, selectedPiece, x, y, currentTurn === 'white' ? 'black' : 'white');
      
  //     const king1 = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
  //     console.log('king', king1.color);
  //   if (!isCheck && isStalemate(king1, pieces, selectedPiece, x, y)) {
  //     socket.emit('stalemate', {room, state : true});
  //     setModalTablasAceptada(true);
  //     setTied(true);
  //     setFrase('por Rey ahogado');
  //     isCheckMate('empate');
  //     return;
  //   }
  //   }
  // }; 
  
  // const movePiece = async (piece, x, y) => {
  //   if (piece && piece.color === currentTurn) {
  //     let captureOccurred = false;
  //     setPieces((prevPieces) => {         
  //       // Crea una copia actualizada de la lista de piezas
  //       const updatedPieces = prevPieces.map((p) => {
  //         if (p.x === piece.x && p.y === piece.y && !(p.x === x && p.y === y && p.color !== piece.color)) {
  //           // Encuentra la pieza que está siendo movida y actualiza su posición
  //           return { ...p, x, y };

  //         } else if (p.x === x && p.y === y && p.color !== piece.color) {
  //           // Si la casilla de destino está ocupada por una pieza enemiga, cápturala
  //           captureOccurred = true;
  //           return null;
  //         } else {
  //           // Mantén inalteradas las otras piezas
  //           return p;
  //         }
  //       }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)
        
  //       // captureOccurred ? capturedAudio.play() : soltarAudio.play();
  //       // Solo actualizar el registro de movimientos una vez
  //       if (piece) {
  //         moveNomenclatura(piece, captureOccurred, x, y);
  //       }
  
  //       if (captureOccurred) {
  //         setCountNoCapture(0);
  //       } else {
  //         setCountNoCapture(prevCount => prevCount + 1);
  //       }
  
  //       localStorage.setItem('pieces', JSON.stringify(updatedPieces));
  //       return updatedPieces;
  //     });
  //   }
  // };
    
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
            // !checkMate && jakeAudio.play(); 
            // if(checkMate){
            //    jakeMateAudio.play();
            // }
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
    
          // if(!isCheck || !checkMate){
          //   captureOccurred ? capturedAudio.play() : soltarAudio.play();
          // }
            moveNomenclatura(piece, captureOccurred, x, y);
                 
            if (captureOccurred) {
              setCountNoCapture(0);
              
            } else {
              setCountNoCapture(prevCount => prevCount + 1);   
            }
            localStorage.setItem('pieces', JSON.stringify(updatedPieces));
            return updatedPieces;
          });           
          //  localStorage.removeItem('userChess');
          //  localStorage.removeItem('infUser');
    
           localStorage.setItem('chessboard',
            JSON.stringify({
              room,  
              userChess,
              infUser,
              currentTurn: turn
          }));
         
      };

      const moveNomenclatura = (piece, captureOccurred,x,y) => {
        const move = piece?.color === 'white' && piece?.x === 4 && piece?.y === 0 && x === 6 && y === 0 
        ? '0-0' : piece?.color === 'black' && piece?.x === 4 && piece?.y === 7 && x === 6 && y === 7 
        ? '0-0' : piece?.color === 'white' && piece?.x === 4 && piece?.y === 0 && x === 2 && y === 0 
        ? '0-0-0' : piece?.color === 'black' && piece?.x === 4 && piece?.y === 7 && x === 2 && y === 7 
        ? '0-0-0' :`${ piece?.type?.charAt(0) === 'p'
        ?  `${captureOccurred ? HORIZONTAL_AXIS[x] : ''}` 
        : (piece?.type === 'knight') ? 'N' : (piece?.type?.charAt(0).toLocaleUpperCase()) || ''
      }${captureOccurred ? 'x' : ''}${HORIZONTAL_AXIS[x]}${VERTICAL_AXIS[y]}`;
       if (piece && piece.color === "white") {
        setWhiteMoveLog((prevMoveLog) => {
          // Verifica si el último movimiento es igual al nuevo 'move'
          if (prevMoveLog.length > 0 && prevMoveLog[prevMoveLog.length - 1] === move) {
            return prevMoveLog; // Si son iguales, retorna el array sin cambios
          }      
          // Si son diferentes, añade el nuevo movimiento
          return [...prevMoveLog, move];
        });
         setMoveLog((prevMoveLog) => {
          // Verifica si el último movimiento es igual al nuevo 'move'
          if (prevMoveLog.length > 0 && prevMoveLog[prevMoveLog.length - 2] === move) {
            return prevMoveLog; // Si son iguales, retorna el array sin cambios
          }      
          // Si son diferentes, añade el nuevo movimiento
          return [...prevMoveLog, move];
         });
       } else if (piece && piece.color === 'black'){
         setBlackMoveLog((prevMoveLog) => {
          // Verifica si el último movimiento es igual al nuevo 'move'
          if (prevMoveLog.length > 0 && prevMoveLog[prevMoveLog.length - 1] === move) {
            return prevMoveLog; // Si son iguales, retorna el array sin cambios
          }      
          // Si son diferentes, añade el nuevo movimiento
          return [...prevMoveLog, move];
         });
         setMoveLog((prevMoveLog) => {
          // Verifica si el último movimiento es igual al nuevo 'move'
          if (prevMoveLog.length > 0 && prevMoveLog[prevMoveLog.length - 2] === move) {
            return prevMoveLog; // Si son iguales, retorna el array sin cambios
          }      
          // Si son diferentes, añade el nuevo movimiento
          return [...prevMoveLog, move];
         });
       }
      
      };

      const isCheckMate = (game) => {
        setCheckMate({
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
          game,
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
        });
      };

      const resetBoard = () => {
        localStorage.removeItem('pieces'); 
        localStorage.removeItem('whiteTime');
        localStorage.removeItem('blackTime');
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
        setWhiteTime(infUser.time);
        setBlackTime(infUser.time);
        setModalRendicion(false);
        setCheckMate(null);
        setDestinationCellRival(null);
        setStartCellRival(null);
        // Agrega cualquier lógica adicional que necesites para reiniciar el juego.
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
            // toqueAudio.play(); 
            setSelectedPiece(piece);
            setPieceAux(piece);
            setStartCell({ x, y }); // Establece la casilla de inicio     
            localStorage.setItem('startCell', JSON.stringify({x,y}));
          }
        }
      }

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
            // !checkMate && jakeAudio.play();
            if(checkMate){
              // jakeMateAudio.play();
              // victoryAudio.play();
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
              isCheckMate('victoria');
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
              userChess,
              infUser,
              currentTurn: currentTurn === 'white' ? 'black' : 'white'
          }));
          
          
          if (selectedPiece.type === PieceType.PAWN && (y === 0 || y === 7)) {
            // Abrir el modal de promoción
            setPromotionModalOpen(true);
            return;
          }
          localStorage.setItem('send_move', JSON.stringify(pieceData));
          await socket.emit("send_move", pieceData);
          gamesUpdate(room, pieces, selectedPiece, x, y, currentTurn === 'white' ? 'black' : 'white');
          
          const king1 = pieces.find((p) => p.type === PieceType.KING && p.color !== currentTurn);
          console.log('king', king1.color);
        if (!isCheck && isStalemate(king1, pieces, selectedPiece, x, y)) {
          socket.emit('stalemate', {room, state : true});
          setModalTablasAceptada(true);
          setTied(true);
          setFrase('por Rey ahogado');
          isCheckMate('empate');
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
              if (p.x === piece.x && p.y === piece.y && !(p.x === x && p.y === y && p.color !== piece.color)) {
                // Encuentra la pieza que está siendo movida y actualiza su posición
                return { ...p, x, y };
    
              } else if (p.x === x && p.y === y && p.color !== piece.color) {
                // Si la casilla de destino está ocupada por una pieza enemiga, cápturala
                captureOccurred = true;
                return null;
              } else {
                // Mantén inalteradas las otras piezas
                return p;
              }
            }).filter(Boolean); // Filtra las piezas para eliminar las null (piezas capturadas)
            
            // captureOccurred ? capturedAudio.play() : soltarAudio.play();
            // Solo actualizar el registro de movimientos una vez
            if (piece) {
              moveNomenclatura(piece, captureOccurred, x, y);
            }
      
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

      const AceptarRevancha = async() => {
        resetBoard();
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
      };

      const revanchaHandle = () => {
        if(socket === null) return;
        socket.emit("send_revancha", {
          revancha: true, 
          room, 
        });
        setSendRevancha(true);
      }

      const yesHandle = () => {
        localStorage.removeItem('whiteTime');
        localStorage.removeItem('blackTime');
        if(socket === null) return;
        setModalAbandonar(false);
        setGameOver(true)
        isCheckMate('derrota');
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
       isCheckMate('empate');
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
    
      const abandonarHandle = () => {
         setModalAbandonar(true);
      }
    
      const notHandle = () => {
        setModalAbandonar(false);
      }
      
    return <GameContext.Provider 
         value={{
            moveNomenclatura,
            whiteMoveLog, setWhiteMoveLog,
            blackMoveLog, setBlackMoveLog,
            moveLog, setMoveLog,
            countNoCapture, setCountNoCapture,
            currentTurn, setCurrentTurn,
            selectedPiece, setSelectedPiece,
            startCell, setStartCell,
            startCellRival, setStartCellRival,
            destinationCell, setDestinationCell,
            destinationCellRival, setDestinationCellRival,
            kingCheckCell, setKingCheckCell,
            enPassantTarget, setEnPassantTarget,
            pieceAux, setPieceAux,
            userWon, setUserWon,
            promotionModalOpen, setPromotionModalOpen,
            isPromotionComplete, setPromotionComplete,
            modaltime, setModalTime,
            isGameOver, setGameOver,
            whiteTime, setWhiteTime,
            blackTime, setBlackTime,
            isWhiteTime, setIsWhiteTime, 
            modalTablas, setModalTablas,
            modalSendTablas, setSendTablas,
            aceptarRevancha, setAceptarRevancha,
            modalAbandonar, setModalAbandonar,
            modalRendicion, setModalRendicion, 
            sendRevancha, setSendRevancha,
            sendRevanchaRechada, setRevanchaRechazada,  
            tied, setTied,
            modalTiedRepetition, setModalTiedRepetition,
            frase, setFrase,
            showToast, setShowToast,
            color, setColor,
            textToast, setTextToast,
            isConnected, setIsConnected,
            playerDisconnected, setPlayerDisconnected,
            reconnectionTimeout, setReconnectionTimeout,
            modalTablasAceptada, setModalTablasAceptada,
            loadingTablas, setLoadingTablas,
            isCheckMate,
            resetBoard,
            handlePromotionSelection,
            handlePieceClick,
            handleTileClick,
            AceptarRevancha,
            revanchaHandle,
            yesHandle,
            movePiece,
            ofrecerTablas,
            aceptarTablas,
            cancelarTablas,
            rechazarTablas,
            abandonarHandle,
            notHandle,
            formatTime
         }}
      >
         {children}
      </GameContext.Provider>
    
}