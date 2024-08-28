import React, { useContext, useEffect, useState } from 'react';
import style from'./Friends.module.css';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import { BlitzSvg, BulletSvg, CircleClose, CircleInf, FastSvg } from '../../svg';
import { 
  AvanzadoInsignia, 
  ExpertoInsignia, 
  GranMaestroInsignia, 
  IntermedioInsignia, 
  MaestroIngsinia, 
  NovatoInsignia, 
  PrincipianteInsignia 
} from '../../img';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import { useChessboardContext } from '../../context/boardContext';
import desafiadoSound from '../../path/to/Awkward Anime Moment.mp3';
import rechazadoSound from '../../path/to/Splat.mp3';
import { ChatContext } from '../../context/ChatContext';

const Friends = ({ friends, onlineUsers, room, mobile }) => {
  const { createChat, userChats, updateCurrentChat  } = useContext(ChatContext);

  const [hoveredFriend, setHoveredFriend] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalInf, setShowModalInf] = useState(false);
  const [showModalMin, setShowModalMin] = useState(false);
  const [showModalOpponent, setShowModalOpponent] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [aceptarDesafio, setAceptarDesafio] = useState(false)
  const [userModal, setUserModal] = useState(null);
  const [userOpponentModal, setUserOpponentModal] = useState(null);
  const [roomGame, setRoomGame] = useState(null);
  const [isOffGame, setOffGame] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [photo, setPhoto] = useState('');
  const {socket, setRoom, setInfUser, infUser, userChess} = useSocketContext();
  const {chessColor} = useChessboardContext();
  const [userInf, setUserInf] = useState({});
  const {auth} = useAuth();
  const navigate = useNavigate();

  const desafiadoAudio = new Audio(desafiadoSound);
  const rechazadoAudio = new Audio(rechazadoSound);


  const allOponnentOnline = friends.filter((friend)=>
      onlineUsers?.some((userOnline) => 
         userOnline?.userId === friend?._id && 
         userOnline.time === infUser.time && 
         userOnline.busy === false)                
    ); 

 const sortedUsers = infUser?.time === 60 || infUser?.time ===120 ?
                         allOponnentOnline.slice().sort((a, b) => b.eloBullet - a.eloBullet) :
                         infUser?.time === 180 || infUser?.time === 300 ?
                         allOponnentOnline.slice().sort((a, b) => b.eloBlizt - a.eloBlitz) : 
                         allOponnentOnline.slice().sort((a, b) => b.eloFast - a.eloFast)

  const handleModalOpen = (friend) => {
    setUserModal(friend);
    setShowModal(true);
    setOffGame(false);
  };

  const handleModalClose = () => {
    setShowModal(false);  
    setAceptarDesafio(false);
    setShowModalMin(false);
    if(socket === null) return;
    socket.emit('modalClose', {off: true, room, friendId :userModal?._id} );
    setUserModal(null);
  };

  const handleModalOpponentOpen = (friend) => {
    setUserOpponentModal(friend)
    setShowModalOpponent(true);
  };

  const handleModalOpponentClose = () => {
    setShowModalOpponent(false);
    setUserOpponentModal(null);
    if(socket === null) return;
     socket.emit('offGame', {off: true, roomGame});
  };

  const playGame = () => {
    setShowModalOpponent(false);
    if(socket === null) return;
     socket.emit('playGame', {
      showModalOpponent, roomGame, 
      idOpponent: auth?.user?._id,
      username: userChess?.username, 
      bandera: userChess?.imagenBandera,
      ratingBullet: userChess?.eloBullet,
      ratingBlitz: userChess?.eloBlitz,
      ratingFast: userChess?.eloFast,
      country: userChess?.country
    });
     socket.emit('joinRoomGamePlay', roomGame); 
     socket.emit('userBusy', auth?.user?._id);
     navigate('/chess');    
  };

  const offGame = () => {
    setShowModalOpponent(false);
    if(socket === null) return;
     socket.emit('offGame', {off: true, roomGame});  
  };

  const createGame = (firstId, secondId, username, photo) =>{
    let colorRamdon = Math.random() < 0.5 ? 'white' : 'black';
    if(socket === null) return;
     setAceptarDesafio(true);
     setOffGame(false);
     setShowModalMin(false);
     const uuid = uuidv4(); 
     socket.emit('joinRoomGamePlay', uuid);   
     setRoomGame(uuid);
     setInfUser((prevInfUser) => ({
      ...prevInfUser,
      color: colorRamdon,
      idOpponent: secondId,
      username: userModal.username,
      photo
    }));
     socket.emit('sendGame', {
       color: colorRamdon,
       room,
       gameId: uuid,
       Id: firstId,
       username: userChess?.username,
       opponentId: secondId,
       time: infUser?.time,
       ratingBullet: userChess?.eloBullet,
       ratingBlitz: userChess?.eloBlitz,
       ratingFast: userChess?.eloFast,
       bandera: userChess?.imagenBandera,
       country: userChess?.country,
       photo: auth?.user?.photo
     });   
  }

  useEffect(() => {
    setRoom(roomGame);
  }, [roomGame]);

  useEffect(() => {
    if(socket === null) return;
     const handleGetGame = (data) => {
      
      if(data?.senderId === auth?.user?._id){
         handleModalOpponentOpen(data);
         desafiadoAudio.play();
         setInfUser((prevInfUser) => ({
          ...prevInfUser,
          idOpponent: data?.idOpponent,
          color: data?.color === 'white' ? 'black' : 'white',
          username: data?.username,
          time: data?.time,
          bullet: data?.bullet,
          blitz: data?.blitz,
          fast: data?.fast,
          bandera: data?.bandera,
          country: data?.country,
          photo: data?.photo
        }));
        setRoomGame(data?.gameId);
        localStorage.setItem('bandera', data?.bandera);
      }
    };
    socket.on("connect", () => {
      console.log("Conexión al servidor establecida.");
      const dataTime = localStorage.getItem('time');
    
    if(!isNaN(dataTime) && dataTime) {
      socket.emit('userTime', {userId: auth?.user?._id, time: parseInt(dataTime)});
      socket.emit('join-room', parseInt(dataTime));
    } 
    });;
    socket.on('getGame', handleGetGame);
    socket.on('receivePlayGame',(data) => {
      localStorage.setItem('bandera', data?.bandera);
      setInfUser((prevInfUser) => ({
        ...prevInfUser,
          bandera: data?.bandera,
          bullet: data?.ratingBullet,
          blitz: data?.ratingBlitz,
          fast: data?.ratingFast,
          country: data?.country,
      }));
      setRoomGame(data?.roomGame);
      socket.emit('joinRoomGamePlay', data?.roomGame); 
      socket.emit('partida', 
        {
           idUser: auth?.user?._id,
           idOpponent: data?.idOpponent,
           roomPartida: data?.roomGame,
           room: infUser?.time,
           username: data?.username,
           username2: userChess?.username,
        });
      if(data?.showModalOpponent){
        socket.emit('userBusy', auth?.user?._id); 
        navigate('/chess');
      }
      
    });

    socket.on('receiveOffGame',(data) => {
      if(data?.off){
         rechazadoAudio.play();
         setOffGame(data?.off);
         setAceptarDesafio(false);
      }    
    });

    socket.on('receivemodalClose',(data) => {
      console.log('receivemodalClose', data?.off)
      if(data?.off){
        if(data.friendId === auth?.user?._id){
           setShowModalOpponent(false);
        }
      }
    });
     
    return () => {
      if (socket === null) return;
      socket.off('getGame', handleGetGame);
    };
    
  }, [socket, roomGame, isOffGame, aceptarDesafio, setIdUser, auth.user]);

  const handleModalInf = async(userId) => {
    const response = await getRequest(`${baseUrl}/user/${userId}`);
    if(response.error){
       return console.log('Error fetching users', response);
    }

    setUserInf(response);
    setPhoto(userId);
    setShowModalInf(true);
  }

  const handleModalCloseInf = () => {
    setShowModalInf(false)
  }

  const mensajeChat = async(idFirst, idSecond) => {
     await createChat(idFirst, idSecond);
     const chat = userChats.find(chat => 
      (chat.members.includes(idFirst) && chat.members.includes(idSecond))
    );
         console.log('chat friends', chat);
         console.log('userChats', userChats);
          updateCurrentChat(chat);

     navigate('/auth/chat');
  }
  
  let count = 1;
  return (
    <div className={style.tercerdiv} style={ {background: chessColor.fondo2}}>
      
      <ul>
        <div className={style.desafio}>
            <div className={style.titleWithIcon}>
              <h5>
                Desafia una partida a {infUser?.time === 60 ? '1' : infUser?.time === 120 ? '2' : 
                                      infUser?.time === 180 ? '3' : infUser.time === 300 ? '5' :
                                      infUser?.time === 600 ? '10' : '20'} mn
              </h5>
              {infUser?.time === 60  || infUser?.time === 120 ? <BulletSvg/> : 
                                            infUser?.time === 180 || infUser.time === 300 ? <BlitzSvg/> :
                                            <FastSvg/>}
            </div>
        </div>
        {sortedUsers.length === 0 ? 
          
             <SpinnerDowloand text={'Cargando Jugadores . . .'}/>
          
        : sortedUsers.map((o, index) => (
          <>
               <li 
                key={index} 
                className={`${style.frienditem} ${hoveredFriend === o._id ? style.frienditemHovered : ''}`}              
                onMouseEnter={() => setHoveredFriend(o._id)}
                onMouseLeave={() => setHoveredFriend(null)}
                onClick={() => handleModalOpen(o)}
                style={{border: chessColor.border2}}
              >                
                <div>
                  <span style={{marginRight: '7px', color: chessColor.titulo}}>{count++}.</span>
                  <img className={style.userIcon} src={o?.photo} alt='assets/avatar/user.png' />                  
                  <span className={style.friendName} style={{color: chessColor.titulo}}>{o?.username}</span>
                </div>
               <div className={style.containerFlex}>
                { infUser?.time === 60 || infUser?.time === 120 ? 
                    o?.eloBullet < 21 ? <PrincipianteInsignia /> : 
                    o?.eloBullet >= 21 && o?.eloBullet <= 61 ? <NovatoInsignia /> : 
                    o?.eloBullet >= 62 && o?.eloBullet <= 100 ? <IntermedioInsignia /> : 
                    o?.eloBullet >= 101 && o?.eloBullet <= 230 ? <AvanzadoInsignia /> :
                    o?.eloBullet >= 231 && o?.eloBullet <= 390 ? <ExpertoInsignia /> :
                    o?.eloBullet >= 391 && o?.eloBullet <= 549 ? <MaestroIngsinia /> : 
                    <GranMaestroInsignia/> :
                  infUser?.time === 180 || infUser?.time === 300 ? 
                    o?.eloBlitz < 21 ? <PrincipianteInsignia/> : 
                    o?.eloBlitz >= 21 && o?.eloBlitz <= 61 ? <NovatoInsignia/> : 
                    o?.eloBlitz >= 62 && o?.eloBlitz <= 100 ? <IntermedioInsignia/> : 
                    o?.eloBlitz >= 101 && o?.eloBlitz <= 230 ? <AvanzadoInsignia /> :
                    o?.eloBlitz >= 231 && o?.eloBlitz <= 390 ? <ExpertoInsignia/> : 
                    o?.eloBlitz >= 391 && o?.eloBlitz <= 549 ?  <MaestroIngsinia/> : 
                    <GranMaestroInsignia/> : 
                    o?.eloFast < 21 ? <PrincipianteInsignia/> : 
                    o?.eloFast >= 21 && o?.eloFast <= 61 ? <NovatoInsignia/> : 
                    o?.eloFast  >= 62 && o?.eloFast  <= 100 ? <IntermedioInsignia/> : 
                    o?.eloFast  >= 101 && o?.eloFast  <= 230 ? <AvanzadoInsignia/> :
                    o?.eloFast  >= 231 && o?.eloFast  <= 390 ? <ExpertoInsignia/> : 
                    o?.eloFast  >= 391 && o?.eloFast  <= 549 ? <MaestroIngsinia/> :
                    <GranMaestroInsignia/>
                  } 
                  <div className={style.containerRanking}>
                   <div >
                   {infUser?.time === 60 || infUser?.time === 120 ? 
                      <BulletSvg/> :
                      infUser?.time === 180 || infUser?.time === 300 ?
                      <BlitzSvg /> : <FastSvg/>
                   }
                   </div>
                   <div className={style.friendRank}>
                      <span >{infUser?.time === 60 || infUser?.time === 120 ? o?.eloBullet : 
                          infUser?.time === 180 || infUser?.time === 300 ? o?.eloBlitz : o?.eloFast}
                      </span>
                   </div>
                  </div>
               </div>
              </li>
              {showModal && (
              <div className={`${style.modal} ${showModal ? style.show : ''}`}>
                <div className={style.header}>
                   <div className={style.circle}>
                    <a className={style.inf} title='Información' onClick={() => handleModalInf(userModal?._id)}>
                        <CircleInf />
                      </a>
                      <a  className={style.close} onClick={() => handleModalClose()}>
                        <CircleClose />
                      </a>
                   </div>
                    <div className={style.username}>
                       <span>{userModal.username.charAt(0).toUpperCase()}{userModal.username.slice(1)}</span>
                    </div>
                 
                  </div>
                <div className={style.modalContent}>
                  
                <div className={`${modalLoading ? `${style.userprofileLoading}` : `${style.userprofile}`}`}>
                    <img className={`${modalLoading ? `${style.profileLoading}` : `${style.profile}`}`} src={userModal?.photo} alt='assets/avatar/user.png' />                  
                    
                    {aceptarDesafio && !isOffGame &&
                      <>
                        <h3>{userModal?.username && `Has enviado un desafio`}</h3>
                        <div className={style.ldsring}><div></div><div></div><div></div><div></div></div>
                      </> 
                    }
                    {!aceptarDesafio && isOffGame && <h3>{'Desafio rechazado'}</h3>}
                </div>                                    
                  <div className={style.modalButtons}>
                    {auth?.user?._id  !== userModal?._id && !aceptarDesafio && !showModalMin && <>
                      <button 
                        className={style.button} 
                        onClick={()=>createGame(
                           auth?.user?._id, 
                           userModal?._id, 
                           userModal?.username, 
                           userModal?.photo
                          )}
                      >
                        Desafiar
                      </button>
                      <button className={style.button} onClick={() => mensajeChat(auth?.user?._id, userModal?._id, )}>
                        Mensaje
                      </button>
                      </>}                  
                    {
                      aceptarDesafio && 
                      <button className={style.button} onClick={() => handleModalClose()}>
                        Cancelar 
                      </button>
                    }
                  </div>
                </div>
              </div>
                )}
                 {showModalOpponent && (
              <div className={`${style.modal} ${showModalOpponent ? style.show : ''}`}>
                <div className={style.header}>
                    <div className={style.circle}>
                      <a className={style.inf} title='Información' onClick={() => handleModalInf(userModal?._id)}>
                        <CircleInf />
                      </a>
                      <a  className={style.close} onClick={handleModalOpponentClose}>
                        <CircleClose/>
                      </a>
                    </div>
                    <div className={style.username}>
                       <span>
                        { `Partida de ${infUser?.time === 60 ? '1 mn' : 
                            infUser?.time === 120 ?  '2 mn' : 
                            infUser?.time === 180 ? '3 mn' : 
                            infUser?.time === 300 ? '5 mn' : 
                            infUser.time === 600 ? '10 mn' : '20 mn'}`
                        }
                       </span>
                    </div>
                </div>
                <div className={style.modalContent}>
                  
                  <div className={`${modalLoading ? `${style.userprofileLoading}` : `${style.userprofile}`}`}>
                      <img 
                        className={`${modalLoading ? `${style.profileLoading}` : `${style.profile}`}`} 
                        src={userOpponentModal?.photo} alt='assets/avatar/user.png' 
                      />                  
                      <h3>{userOpponentModal?.username && 
                            `${userOpponentModal.username.charAt(0)
                               .toUpperCase()}${userOpponentModal.username.slice(1)} te ha desafiado `} </h3>
                  </div>                                    
                  <div className={style.modalButtons}>
                    <button className={style.button} onClick={playGame}>
                      Aceptar
                    </button>
                    <button className={style.button} onClick={offGame}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
                )}
                 { 
        showModalInf && 
          <ModalProfile 
            user={userInf}
            nivel={`${infUser?.time === 60 || infUser?.time === 120 ? 'bullet' :
            infUser?.time === 180 || infUser?.time === 300 ? 'blitz' :
            'fast' }`}
            handleModalClose={handleModalCloseInf}
            photo={photo}
            elo={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.eloBullet :
            infUser?.time === 180 || infUser?.time === 300 ? userInf.eloBlitz :
            userInf.eloFast}`}
            games={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.gamesBullet :
              infUser?.time === 180 || infUser?.time === 300 ? userInf.gamesBlitz :
              userInf.gamesFast}`}
            gamesWon={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.gamesWonBullet :
              infUser?.time === 180 || infUser?.time === 300 ? userInf.gamesWonBlitz :
              userInf.gamesWonFast}`}
            gamesTied={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.gamesTiedBullet :
              infUser?.time === 180 || infUser?.time === 300 ? userInf.gamesTiedBlitz :
              userInf.gamesTiedFast}`}
            gamesLost={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.gamesLostBullet :
              infUser?.time === 180 || infUser?.time === 300 ? userInf.gamesLostBlitz :
              userInf.gamesLostFast}`}
              racha={`${infUser?.time === 60 || infUser?.time === 120 ? userInf.rachaBullet :
                infUser?.time === 180 || infUser?.time === 300 ? userInf.rachaBlitz :
                userInf.rachaFast}`}
          /> 
      } 
          </>
        ))}
      </ul>
      
    </div>
  );
};

export default Friends;