import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import  io  from 'socket.io-client';
import { baseUrl, postRequest } from '../utils/services';
import axios from 'axios';

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
  const [infUser, setInfUser] = useState({
    idOpponent: null,
    color: '',
    username: '',
    room: 0,
    time: 1,
    bullet: 0,
    blitz: 0,
    fast: 0,
    bandera: '',
    country: '',
    photo: '',
    marco: ''
  });
  const [partidas, setPartidas] = useState([]);
  const [games, setGames] = useState(null);
 console.log('roomgame', room);
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
},[socket]);

useEffect(() => {
  const gameRoom = localStorage.getItem('gameRoom');
  if(gameRoom){
    setRoom(gameRoom)
  }
},[])

useEffect(() => {
  localStorage.setItem('infUser', JSON.stringify(infUser));
  const gamesData = localStorage.getItem('games');
    if(gamesData){
      const parseData = JSON.parse(gamesData);
      setGames(parseData);
    }
},[infUser]);

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


useEffect(() => {
 const getGame = async()=>{
    try {
      const response = await axios.get(`${baseUrl}/partida/user/games/${room}`);
      setGames(response.data);
      localStorage.setItem('games', JSON.stringify(response.data));
      console.log('response game', response.data)
    } catch (error) {
      console.log('error getGame',error)
    }
 }
 if(room) getGame();
},[infUser?.color]);

const postGames = useCallback(async (roomGame, resetPieces) => {
  try {
      const response = await postRequest(`${baseUrl}/partida/user/games/create`, 
       JSON.stringify({
          gamesId: roomGame,
          pieces: resetPieces,
          piece: {},
          x: 0,
          y: 0,
          turn: 'white'
        })
      );
     console.log(response); // Devuelve la respuesta si es necesario
  } catch (error) {
      console.error('Error posting game:', error);
  }
},[]);

const gamesUpdate = useCallback(async (roomGame, pieces, piece, x, y, turn) => {
    try {
     
     await axios.put(`${baseUrl}/partida/user/games/update/${roomGame}`, {
        pieces,
        piece,
        x,
        y,
        turn,
      });
    } catch (error) {
      console.log('error', error);
    }
},[]);
  return (
    <SocketContext.Provider value={{ 
      socket, 
      setSocket,
      room,
      setRoom,
      infUser,
      setInfUser,
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
      postGames,
      gamesUpdate,
      games,
    }}>
      {children}
    </SocketContext.Provider>
  );
};
