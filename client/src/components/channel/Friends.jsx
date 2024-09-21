import React, { useContext, useEffect, useState } from 'react';
import style from'./Friends.module.css';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import { BlitzSvg, BulletSvg, CircleClose, CircleInf, FastSvg, SettingSvg } from '../../svg';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import desafiadoSound from '../../path/to/ding.mp3';
import rechazadoSound from '../../path/to/Splat.mp3';
import { ChatContext } from '../../context/ChatContext';
import { useLanguagesContext } from '../../context/languagesContext';
import Spinner from 'react-bootstrap/Spinner';
import Insignias from '../insignias/Insignias';
import Fast from '../../img/fast';
import SettingsModal from '../modal/SettingsModal';

const Friends = ({ friends, onlineUsers, room }) => {
  const { createChat, userChats, updateCurrentChat  } = useContext(ChatContext);
  const [showModalSettings, setShowSettings] = useState();
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
  const [userInf, setUserInf] = useState({});
  const {auth} = useAuth();
  const navigate = useNavigate();

  const {socket, setRoom, setInfUser, infUser, userChess} = useSocketContext();
  const {language} = useLanguagesContext();

  const desafiadoAudio = new Audio(desafiadoSound);
  desafiadoAudio.volume = 0.1;
  const rechazadoAudio = new Audio(rechazadoSound);
  rechazadoAudio.volume = 0.1;


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

  const createGame = (firstId, secondId, username, photo, marco) =>{
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
       photo: auth?.user?.photo,
       marco: auth?.user?.marco
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
    });
     // Manejar el evento "disconnect" para detectar desconexiones
     socket.on("disconnect", (reason) => {
      console.log("Desconectado. Razón:", reason);
      //medidas específicas en caso de desconexión aquí, volver a conectar automáticamente o mostrar un mensaje de error al usuario.
    });
    socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconectado en el intento ${attemptNumber}`);
      // Realiza cualquier lógica adicional que necesites después de la reconexión
    });

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
     //buscamos en userChats el chat
     const chat = userChats.find(chat => 
      (chat.members.includes(idFirst) && chat.members.includes(idSecond))
    );
     
    if(!chat){
      //si no existe el chat ps se crea
      await createChat(idFirst, idSecond);
      updateCurrentChat(chat); //accder al chat
    }else{
      //si ya existe ps accedemos al chat
     updateCurrentChat(chat);
    }

          updateCurrentChat(chat);

     navigate('/auth/chat');
  }
  
  let count = 1;
  return (
   <>
      <div className={style.tercerdiv} > 
      <div className={style.desafio}>
          <div className={style.titleWithIcon}>
            <img 
              src={'/icon/userswhite.png'} 
              style={{width: '40px', marginRight: '10px'}} 
              alt="" 
            />
            <h5>
              {language.Challenge_a_match} {infUser?.time === 60 
                ? '1' : infUser?.time === 120 
                ? '2' : infUser?.time === 180 
                ? '3' : infUser.time === 300 
                ? '5' : infUser?.time === 600 ? '10' : '20'
              } mn
            </h5>
            {infUser?.time === 60  || infUser?.time === 120 
              ? <BulletSvg/> 
              : infUser?.time === 180 || infUser.time === 300 
              ? <BlitzSvg/> 
              : <div style={{width: '25px', height: '25px', marginTop: '-2px'}}>
                    <Fast/>
                </div>
              }
          </div>
          <div 
            className={style.setting} 
            title={language.settings}
            onClick={()=>setShowSettings(true)}>
            <SettingSvg/>
          </div>
      </div>       
      <div>        
        {sortedUsers.length === 0 ?          
           <SpinnerDowloand text={`${language.Loading_Players} . . .`} color={'#fff'}/>         
        : sortedUsers.map((o, index) => (
          <>
              <li 
                key={index} 
                className={`${style.frienditem} ${hoveredFriend === o._id ? `${style.frienditem} ${style.frienditemHovered}` : ''}`}              
                onMouseEnter={() => setHoveredFriend(o._id)}
                onMouseLeave={() => setHoveredFriend(null)}
                onClick={() => handleModalOpen(o)}
              >                
                <div className={style.containerProfile}>
                  <span style={{marginRight: '7px', color: '#fff'}}>{count++}.</span>
                  <div className={style.imageContainer} >
                    <img className={style.photoImage} src={o?.photo} alt="User Photo" />                  
                    <img className={style.marco} src={o?.marco} alt="Marco"/>
                  </div> 
                  <div className={style.friendName}>
                    <span  >
                      {o?.username.substring(0, 8) > 8 ? o?.username.substring(0, 8)+'...' :  o?.username }
                    </span>
                    <img src={o?.imagenBandera} className={style.bandera} alt="" />
                  </div>
                </div>
                <div className={style.containerFlex}>
                    <div className={style.imageInsignia}>
                      <Insignias o={o} time={infUser?.time}/>
                    </div>
                    
                    <div className={style.containerRanking}>
                    <div style={{marginTop: '-2px'}} >
                      {infUser?.time === 60 || infUser?.time === 120 
                        ?  <BulletSvg/> : infUser?.time === 180 || infUser?.time === 300 
                        ?  <BlitzSvg /> : 
                            <div style={{width: '25px', height: '25px'}}>
                              <Fast/>
                            </div>
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
                      <a 
                        className={style.inf}
                        title={language?.information} 
                        onClick={() => handleModalInf(userModal?._id)}
                      >
                        <CircleInf />
                      </a>
                      <a  
                        className={style.close} 
                        onClick={() => handleModalClose()}
                      >
                        <CircleClose />
                      </a>
                   </div>
                    <div className={style.username}>
                       <span>
                         {userModal.username.charAt(0).toUpperCase()}{userModal.username.slice(1)}
                       </span>
                    </div>
                 
                  </div>
                <div className={style.modalContent}>
                  
                <div className={`${modalLoading ? `${style.userprofileLoading}` : `${style.userprofile}`}`}>
                      <div className={style.imageContainerModal} >
                        <img className={style.photoImage} src={userModal?.photo} alt="User Photo" />                  
                        <img className={style.marco} src={userModal?.marco} alt="Marco"/>
                      </div>                  
                    
                    {aceptarDesafio && !isOffGame &&
                      <>
                        <span className={style.text}>
                          {userModal?.username && `${language?.You_have_sent_a_challenge}`}
                        </span>
                        <Spinner animation="grow" style={{color: '#154360'}}/>;
                      </> 
                    }
                    {!aceptarDesafio && isOffGame && <h3>{language.Challenge_rejected}</h3>}
                </div>                                    
                  <div className={style.modalButtons}>
                    {auth?.user?._id  !== userModal?._id && !aceptarDesafio && !showModalMin && <>
                      <button 
                        className={style.button} 
                        onClick={()=>createGame(
                           auth?.user?._id, 
                           userModal?._id, 
                           userModal?.username, 
                           userModal?.photo,
                           userModal?.marco
                          )}
                      >
                        {language.Challenge} 
                      </button>
                      <button 
                        className={style.button} 
                        onClick={() => mensajeChat(auth?.user?._id, userModal?._id, )}
                      >
                        {language.message}
                      </button>
                      </>}                  
                    {
                      aceptarDesafio && 
                      <button 
                        className={style.button} 
                        style={{width:'90%'}} 
                        onClick={() => handleModalClose()}>
                        {language.Cancel}
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
                      <a 
                        className={style.inf} 
                        title={language.information}
                        onClick={() => handleModalInf(userModal?._id)}
                      >
                        <CircleInf />
                      </a>
                      <a  className={style.close} onClick={handleModalOpponentClose}>
                        <CircleClose/>
                      </a>
                    </div>
                    <div className={style.username}>
                       <span>
                        { `${language.game_of} ${infUser?.time === 60 ? '1 mn' : 
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
                      <div className={style.imageContainerModal} >
                        <img className={style.photoImage} src={userOpponentModal?.photo} alt="User Photo" />                  
                        <img className={style.marco} src={userOpponentModal?.marco} alt="Marco"/>
                      </div>                   
                      <span className={style.text}>{userOpponentModal?.username && 
                            `${userOpponentModal.username.charAt(0)
                               .toUpperCase()}${userOpponentModal.username.slice(1)} ${language.has_challenged_you}`} 
                      </span>
                      <Spinner animation="grow" style={{color: '#154360'}}/>
                  </div>                                    
                  <div className={style.modalButtons}>
                    <button className={style.button} onClick={playGame}>
                      {language.Accept}
                    </button>
                    <button className={style.button} onClick={offGame}>
                      {language.Cancel}
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
      </div>
      
    </div>
    <SettingsModal 
    show={showModalSettings}
    handleClose={()=> setShowSettings(false)}
  />
   </>
  );
};

export default Friends;