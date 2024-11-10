import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import  io  from 'socket.io-client';
import useSound from 'use-sound';

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [currentMessageChess, setCurrentMessageChess] = useState('');
  const [messageListChess, setMessageListChess] = useState([]);
  const [countMessage, setCountMessage] = useState(0);
  const [userChess, setUser] = useState({
    _id: null,
    username: '',
    imagenBandera: '',
    games: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesTied: 0,
    gamesBullet: 0,
    gamesWonBullet: 0,
    gamesLostBullet: 0,
    gamesTiedBullet: 0,
    gamesBlitz: 0,
    gamesWonBlitz: 0,
    gamesLostBlitz: 0,
    gamesTiedBlitz: 0,
    gamesFast: 0,
    gamesWonFast:0 ,
    gamesLostFast: 0,
    gamesTiedFast: 0,
    rachaBullet: 0,
    rachaBlitz: 0,
    rachaFast: 0,
    eloBullet: 0,
    eloBlitz: 0,
    eloFast: 0,
    country: '',
    color:'',
  });
  const [playersTotal, setPlayersTotal] = useState({
    uno: 0,
    dos: 0,
    tres: 0,
    cinco: 0,
    diez: 0,
    veinte: 0,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsersGame, setOnlineUsersGame] = useState([]);
  const [online, setOnline] = useState(null);
  const [partidas, setPartidas] = useState([]);
  const [chatAudio] = useSound('/to/sonicChat.mp3');
  
  useEffect(() => {
    const newSocket = io.connect(
      process.env.REACT_APP_PRODUCTION === 'production'
        ? 'https://chessknigth-22fe0ebf751e.herokuapp.com'
        : 'http://localhost:5000'
    );

    
    setSocket(newSocket);

    return () =>{
     newSocket.disconnect();
    }
},[user]);
  
useEffect(() => {
  if(socket === null) return;

  socket.on('getPartidas',(data) =>{
     setPartidas(data);
  });

  socket.on("receive_messageChess", (response) => {
    setMessageListChess((list) => {
      // Verificar si el mensaje ya existe en la lista
      const messageExists = list.some(
        (msg) =>
          msg.author === response.author &&
          msg.message === response.message &&
          msg.times === response.times
      );

      // Solo añadir el mensaje si no existe
      if (!messageExists) {
        setCountMessage(prev => prev + 1);
      
          chatAudio();
        return [...list, response];
      }
      return list;
    });
  }); 
  return () => {
    if (socket) {
      socket.off("receive_messageChess");
    }
  };
},[socket]);

useEffect(() => {
  const gameRoom = localStorage.getItem('gameRoom');
  if(gameRoom){
    setRoom(gameRoom)
  }
},[]);

useEffect(() => {
  if (online) {  // Asegúrate de que online está definido
    const minUno = online.filter((userOnline) => userOnline.time === 60);
    const minDos = online.filter((userOnline) => userOnline.time === 120);
    const minTres = online.filter((userOnline) => userOnline.time === 180);
    const minCinco = online.filter((userOnline) => userOnline.time === 300);
    const minDiez = online.filter((userOnline) => userOnline.time === 600);
    const minVeinte = online.filter((userOnline) => userOnline.time === 1200);

    // Actualiza el estado de playersTotal
    setPlayersTotal({
      uno: minUno.length,
      dos: minDos.length,
      tres: minTres.length,
      cinco: minCinco.length,
      diez: minDiez.length,
      veinte: minVeinte.length,
    });
  }
}, [online, setPlayersTotal]); // Escucha cambios en online

  return (
    <SocketContext.Provider value={{ 
      socket, 
      setSocket,
      room,
      setRoom,
      allUsers,
      setAllUsers,
      onlineUsersGame,
      setOnlineUsersGame,
      partidas,
      setPartidas,
      userChess,
      setUser,
      messageList,
      setMessageList,
      currentMessage,
      setCurrentMessage,
      playersTotal, 
      setPlayersTotal,
      online,
      setOnline,
      countMessage, setCountMessage,
      currentMessageChess, setCurrentMessageChess,
      messageListChess,
      setMessageListChess,
    }}>
      {children}
    </SocketContext.Provider>
  );
};
