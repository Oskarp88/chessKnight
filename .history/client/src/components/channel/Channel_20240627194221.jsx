import React, { useContext, useEffect, useState } from 'react';
import style from './Channel.module.css';
import Chat from './Chat';
import { useSocketContext } from '../../context/socketContext';
import Friends from './Friends';
import { ChatContext } from '../../context/ChatContext';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useChessboardContext } from '../../context/boardContext';
import { baseUrl, getRequest } from '../../utils/services';


const Channel = () => {
    const {auth, setOk} = useAuth();
    const {socket, infUser, setAllUsers, setUser, userChess, allUsers, setInfUser} = useSocketContext(); 
    const [usersCache, setUsersCache] = useState([]);
    const [isRoom, setIsRoom] = useState(0);
    const {view} = useChessboardContext();
    const navigate = useNavigate();
    let room = infUser.time ? parseInt(infUser.time) : isRoom;
    console.log(room, 'room')
    // console.log('room chanel', room);
    const { createChat, onlineUsers} = useContext(ChatContext);
    // console.log('onlineUser channel', onlineUsers);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 690);
    
    const [View,setView] = useState(window.innerWidth <= 690);

    useEffect(()=>{
      const dataTime = localStorage.getItem('time');
    
    if(!isNaN(dataTime) && dataTime) {
      setIsRoom(parseInt(dataTime));
      setInfUser((prevInfUser) => ({
        ...prevInfUser,
        time: parseInt(dataTime)
      }));
      socket.emit('userTime', {userId: auth?.user?._id, time: parseInt(dataTime)});
      socket.emit('join-room', isRoom);
    }
   

    },[]);

    useEffect(() => {
      localStorage.removeItem('chessboard');
      const handleResize = () => {
        setIsMobileView(window.innerWidth <= 690);
        setView(window.innerWidth <= 690);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useEffect(()=>{
      const User = async() => {
        const response = await getRequest(`${baseUrl}/user/${auth?.user?._id}`);
        if(response.error){
           return console.log('Error fetching users', response);
        }
        
        setUser((prev) => ({
         ...prev,
          _id: response?._id,
          username: response?.username,
          imagenBandera: response?.imagenBandera,
          games: response?.games,
          gamesWon: response?.gamesWon,
          gamesLost: response?.gamesLost,
          gamesTied: response?.gamesTied,
          gamesBullet: response?.gamesBullet,
          gamesWonBullet: response?.gamesWonBullet,
          gamesLostBullet: response?.gamesLostBullet,
          gamesTiedBullet: response?.gamesTiedBullet,
          gamesBlitz: response?.gamesBlitz,
          gamesWonBlitz: response?.gamesWonBlitz,
          gamesLostBlitz: response?.gamesLostBlitz,
          gamesTiedBlitz: response?.gamesTiedBlitz,
          gamesFast: response?.gamesFast,
          gamesWonFast: response?.gamesWonFast ,
          gamesLostFast: response?.gamesLostFast,
          gamesTiedFast: response?.gamesTiedFast,
          rachaBullet: response?.rachaBullet,
          rachaBlitz: response?.rachaBlitz,
          rachaFast: response?.rachaFast,
          eloBullet: response?.eloBullet,
          eloBlitz: response?.eloBlitz,
          eloFast: response?.eloFast,
          country: response?.country,
        }));
        localStorage.setItem('userChess',
        JSON.stringify({
          _id: response?._id,
          username: response?.username,
          imagenBandera: response?.imagenBandera,
          games: response?.games,
          gamesWon: response?.gamesWon,
          gamesLost: response?.gamesLost,
          gamesTied: response?.gamesTied,
          gamesBullet: response?.gamesBullet,
          gamesWonBullet: response?.gamesWonBullet,
          gamesLostBullet: response?.gamesLostBullet,
          gamesTiedBullet: response?.gamesTiedBullet,
          gamesBlitz: response?.gamesBlitz,
          gamesWonBlitz: response?.gamesWonBlitz,
          gamesLostBlitz: response?.gamesLostBlitz,
          gamesTiedBlitz: response?.gamesTiedBlitz,
          gamesFast: response?.gamesFast,
          gamesWonFast: response?.gamesWonFast ,
          gamesLostFast: response?.gamesLostFast,
          gamesTiedFast: response?.gamesTiedFast,
          rachaBullet: response?.rachaBullet,
          rachaBlitz: response?.rachaBlitz,
          rachaFast: response?.rachaFast,
          eloBullet: response?.eloBullet,
          eloBlitz: response?.eloBlitz,
          eloFast: response?.eloFast,
          country: response?.country,
        }
       ));
      }

      
      
      User();
    },[]);

    // useEffect(() => {
    //   if (usersCache.length > 0) {
    //     setAllUsers(usersCache);
    //   }
    // }, [usersCache]);

    useEffect(() => {
      const getUsers = async() =>{
       
        const response = await getRequest(`${baseUrl}/users`);

         if(response.error){
            return console.log('Error fetching users', response);
         }
          setAllUsers(response);
       }
    
      getUsers();
    
    }, []);

    useEffect(() => {
      console.log('isMobileView', isMobileView);
    
    }, [isMobileView]);


  return (
    <div className={style.contenedor}>
     
      <div className={style.flex}>
      <div 
        className={style.div2} 
        style={window.innerWidth <= 690 && view? {height: '5vh', marginBottom: '-5px'} : {}}       
      >
        <Chat 
           room={room}
           username={auth?.user?.username}
           socket={socket}         
        />
      </div>
      <div className={style.div3} style={window.innerWidth <= 690 && isMobileView? {height: '100%'} : {}}>
        <Friends friends={allUsers} onlineUsers={onlineUsers} room={room} mobile={isMobileView}/>
      </div>
      </div>
    </div>
  );
};

export default Channel;