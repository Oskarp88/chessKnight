import React, { useContext, useEffect, useState } from 'react';
import style from './Channel.module.css';
import Chat from './Chat';
import { useSocketContext } from '../../context/socketContext';
import Friends from './Friends';
import { ChatContext } from '../../context/ChatContext';
import { useAuth } from '../../context/authContext';
import { baseUrl, getRequest } from '../../utils/services';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useChessboardContext } from '../../context/boardContext';

const Channel = () => {

    const {auth} = useAuth();
    const {socket, infUser, setAllUsers, setUser, allUsers, setInfUser} = useSocketContext(); 
    const [isRoom, setIsRoom] = useState(0);
    const [toggle, setToggle] = useState('Jugadores');
    const {chessColor} = useChessboardContext();

    let room = infUser.time ? parseInt(infUser.time) : isRoom;
    // console.log(room, 'room')
    // console.log('room chanel', room);
    const { onlineUsers} = useContext(ChatContext);

    useEffect(()=>{
      const dataTime = localStorage.getItem('time');
      localStorage.removeItem('chessboard');
    
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
          photo: response?.photo,
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
          photo: response?.photo,
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

    const toggleTab = (text) => {
       setToggle(text)
    }
  return (
    <div className={style.contenedor}>     
      <div className={style.flex}>
        <Row 
          className={style.div2}       
        >
          <Chat 
            room={room}
            username={auth?.user?.username}
            socket={socket}         
          />
        </Row>
        <Row className={style.div3} >
          <Friends friends={allUsers} onlineUsers={onlineUsers} room={room}/>
        </Row>
      </div>
      <div className={style.tabsContainer}>
          <div className={style.blocTabs}
             style={{ background: chessColor.fondo4}}
          >
             <div 
               className={toggle === 'Chat' ? `${style.tabs} ${style.activeTabs} ` : `${style.tabs}`}
               style={toggle === 'Chat' ? {background: chessColor.fondo2, color: chessColor.color,} : {}}
               onClick={()=>toggleTab('Chat')}
             >Chat Live</div>
             <div 
               className={toggle === 'Jugadores' ? `${style.tabs} ${style.activeTabs} ` : `${style.tabs}`}
               style={toggle === 'Jugadores' ? {background: chessColor.fondo2, color: chessColor.color,} : {}}
               onClick={()=>toggleTab('Jugadores')}
             >Jugadores</div>
          </div>
          <div className={style.contentTabs}>
             <div className={toggle === 'Chat' ? `${style.activeContent}` : `${style.content}`}>
                <Chat 
                  room={room}
                  username={auth?.user?.username}
                  socket={socket}         
                />
             </div>
             <div className={toggle === 'Jugadores' ? `${style.activeContent}` : `${style.content}`}>
               <Friends friends={allUsers} onlineUsers={onlineUsers} room={room}/>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Channel;