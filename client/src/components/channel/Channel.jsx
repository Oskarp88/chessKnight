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
          style={{backgroundImage: `url(${chessColor.fondoChat})`}}      
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
      <div 
        className={style.tabsContainer}
        style={toggle === 'Jugadores' ? {backgroundColor: chessColor.fondo2} : {backgroundImage: `url(${chessColor.fondoChat})`}}
      >
          <div className={style.blocTabs}>
             <div 
               className={toggle === 'Chat' ? `${style.tabs} ${style.activeTabs} ` : `${style.tabs}`}
               style={toggle === 'Chat' ? {} : {background: 'radial-gradient(circle at 1.8% 4.8%, rgb(17, 23, 58) 0%, rgb(58, 85, 148) 90%)'}}
               onClick={()=>toggleTab('Chat')}
             >
                <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight: '5px'}} width="20" height="20" fill="currentColor" class="bi bi-wechat" viewBox="0 0 16 16">
                  <path d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117.166.166 0 0 1-.162.162.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074.5.5 0 0 0-.142.021 5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.63.63 0 0 0 .098.356"/>
                  <path d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.5.5 0 0 0-.032.14.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26 4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0"/>
                </svg>
                Chat Live
             </div>
             <div 
               className={toggle === 'Jugadores' ? `${style.tabs} ${style.activeTabs} ` : `${style.tabs}`}
               style={toggle === 'Jugadores' ? {color: chessColor.titulo} : {background: 'radial-gradient(circle at 1.8% 4.8%, rgb(17, 23, 58) 0%, rgb(58, 85, 148) 90%)'}}
               onClick={()=>toggleTab('Jugadores')}
             >
              <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight: '5px'}} width="20" height="20" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
              </svg>
              Jugadores
              
              </div>
              <div style={{width: '36.3%', background: 'radial-gradient(circle at 1.8% 4.8%, rgb(17, 23, 58) 0%, rgb(58, 85, 148) 90%)'}}>
             </div>
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