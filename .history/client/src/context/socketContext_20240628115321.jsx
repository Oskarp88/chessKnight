import React, { createContext, useContext, useEffect, useState } from 'react';
import  io  from 'socket.io-client';
import { baseUrl, getRequest } from '../utils/services';

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
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsersGame, setOnlineUsersGame] = useState([]);
  const [infUser, setInfUser] = useState({
    idOpponent: null,
    color: '',
    username: '',
    room: 0,
    time: 0,
    bullet: 0,
    blitz: 0,
    fast: 0,
    bandera: '',
    country: '',
    photo: ''
  });
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
    const newSocket = io.connect('http://localhost:8080');
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
  localStorage.setItem('infUser', JSON.stringify(infUser));
},[infUser]);

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
      setUser
    }}>
      {children}
    </SocketContext.Provider>
  );
};
