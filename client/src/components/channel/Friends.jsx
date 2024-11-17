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
import { ChatContext } from '../../context/ChatContext';
import { useLanguagesContext } from '../../context/languagesContext';
import Spinner from 'react-bootstrap/Spinner';
import Insignias from '../insignias/Insignias';
import Fast from '../../img/fast';
import SettingsModal from '../modal/SettingsModal';
import { useChessboardContext } from '../../context/boardContext';
import { GameContext } from '../../context/gameContext';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import JoinRoom from '../modal/JoinRoom';
import { Nav } from 'react-bootstrap';
import { TiArrowLeft } from 'react-icons/ti';
import { valors } from '../../Constants';

const Friends = ({ friends, room }) => {
  
  const {setPieces, resetPieces} = useChessboardContext();
  const{resetBoard, setInfUser, infUser, postGames,isGameStart, setIsGameStart} = useContext(GameContext);
  const { createChat, userChats, updateCurrentChat, onlineUsers} = useContext(ChatContext);
  const [showModalSettings, setShowSettings] = useState();
  const [showModalRoom, setShowRoom] = useState();
  const [hoveredFriend, setHoveredFriend] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalInf, setShowModalInf] = useState(false);
  const [showModalMin, setShowModalMin] = useState(false);
  const [showModalSign, setShowModalSign] = useState(false);
  const [showModalOpponent, setShowModalOpponent] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [aceptarDesafio, setAceptarDesafio] = useState(false)
  const [userModal, setUserModal] = useState(null);
  const [userOpponentModal, setUserOpponentModal] = useState(null);
  const [roomGame, setRoomGame] = useState(null);
  const [isOffGame, setOffGame] = useState(false);
  const [next, setNext] = useState(0);
  const [idUser, setIdUser] = useState(null);
  const [photo, setPhoto] = useState('');
  const [busy, setBusy] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [isExisteUser, setIsExisteUser] = useState(false);
  const [userInf, setUserInf] = useState({});
  const {auth, user} = useAuth();
  const navigate = useNavigate();

  const {socket, setRoom, userChess,  setOnline} = useSocketContext();
  const {language} = useLanguagesContext();
  // const desafiadoAudio = new Audio('/to/ding.mp3'');
  // desafiadoAudio.volume = 0.1;
  // const rechazadoAudio = new Audio('/path/to/Splat.mp3');
  // rechazadoAudio.volume = 0.1;


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
useEffect(()=>{
  const existeUser = sortedUsers.some(user => user._id === auth.user._id);

  if (existeUser) {
    setIsExisteUser(true);
  } else {
    setIsExisteUser(false);
  } 
},[onlineUsers])

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
    !isBusy && socket.emit('modalClose', {off: true, room, friendId :userModal?._id} );
    socket.emit('yesAvailable', auth?.user?._id);
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
     socket.emit('yesAvailable', auth?.user?._id);
  };

  const offGame = () => {
    setShowModalOpponent(false);
    if(socket === null) return;
     socket.emit('offGame', {off: true, roomGame}); 
     socket.emit('yesAvailable', auth?.user?._id); 
  };

  useEffect(() => {
    setRoom(roomGame);
  }, [roomGame]);

  useEffect(() => {
    if(socket === null) return;
     //reicibiendo el desafio
     const handleGetGame = (data) => {
      
      if(data?.senderId === auth?.user?._id){
        socket.emit('notAvailable', auth?.user?._id);
         handleModalOpponentOpen(data);
        //  desafiadoAudio.play();
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
          photo: data?.photo,
          marco: data?.marco,
          moneda: data?.moneda,
          valor: data?.valor
        }));
        setRoomGame(data?.gameId);
        localStorage.setItem('gameRoom', data?.gameId);
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
     socket.on("disconnect", () => {   
        console.log("Disconnected without a specified reason.");      
      //medidas específicas en caso de desconexión aquí, volver a conectar automáticamente o mostrar un mensaje de error al usuario.
    });
    socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconectado en el intento ${attemptNumber}`);
      // Realiza cualquier lógica adicional que necesites después de la reconexión
    });

    socket.on('getGame', handleGetGame);
     
    socket.on('receivePlayGame',(data) => {
      //datos recibidos de quien acepto el desafio 
      setIsGameStart(true);
      localStorage.setItem('gameStart', JSON.stringify(true));
      setPieces(resetPieces);
      localStorage.setItem('bandera', data?.bandera);
      setRoom(data?.roomGame);
      socket.emit('joinRoomGamePlay', data?.roomGame);
      socket.emit('oponnetConnect', {gameId: data?.roomGame, idUser: auth?.user?._id, idOponnent: data?.idOponnent});
      const time = parseInt(localStorage.getItem('time')) || infUser?.time; 
      socket.emit('initPlay', {gameId: data?.roomGame, time}); 
      socket.emit('partida', 
        {
           idUser: auth?.user?._id,
           idOpponent: data?.idOpponent,
           roomPartida: data?.roomGame,
           room: infUser?.time,
           username: data?.username,
           username2: auth?.user?.username || auth?.user?.name,
        });
      if(data?.showModalOpponent){
        socket.emit('userBusy', auth?.user?._id); 
        localStorage.setItem('infUser', JSON.stringify(infUser));
        navigate('/chess');
      }  
    });

    socket.on('receiveOffGame',(data) => {
      if(data?.off){
        //  rechazadoAudio.play();
         setOffGame(data?.off);
         setAceptarDesafio(false);
         socket.emit('yesAvailable', auth?.user?._id);
      }    
    });

    socket.on('receivemodalClose',(data) => {
      console.log('receivemodalClose', data?.off)
      if(data?.off){
        if(data.friendId === auth?.user?._id){
           setShowModalOpponent(false);
           socket.emit('yesAvailable', auth?.user?._id);
        }
      }
    });
    socket.on('isBusy',(userId)=>{
      setBusy((prevBusy) => {
        if (!prevBusy.some(user => user === userId)) {
          // Si el usuario no está en la lista, lo agrega y devuelve el nuevo array
          return [...prevBusy, userId];
        }
        // Si el usuario ya está en la lista, devuelve el array sin cambios
        return prevBusy;
      });
    });
    socket.on('notBusy',(userId) => {
      setBusy((prevBusy) => prevBusy.filter(user => user !== userId));
    })
     
    return () => {
      if (socket === null) return;
      socket.off('getGame', handleGetGame);
    };
    
  }, [socket, roomGame, isOffGame, aceptarDesafio, setIdUser, auth.user]);

  useEffect(()=>{
    if(!userModal) return;
    const userIndex = busy.findIndex(id => id === userModal._id);
    if(userIndex !== -1){
      setIsBusy(true);
    }else{
      setIsBusy(false);
    }
  },[userModal]);

  //enviar desafio
  const createGame = (firstId, userOpponent) =>{
    resetBoard();
    let colorRamdon = Math.random() < 0.5 ? 'white' : 'black';
    if(socket === null) return;
     setAceptarDesafio(true);
     setOffGame(false);
     setShowModalMin(false);
     const uuid = uuidv4(); 
     socket.emit('notAvailable', auth?.user?._id);
     socket.emit('joinRoomGamePlay', uuid);   
     localStorage.setItem('gameRoom', uuid);
     setInfUser((prevInfUser) => ({
      ...prevInfUser,
      color: colorRamdon,
      idOpponent: userOpponent._id,
      username: userOpponent.username,
      photo: userOpponent.photo,
      bullet: userOpponent.eloBullet,
      blitz: userOpponent.eloBlitz,
      fast: userOpponent.eloFast,
      bandera: userOpponent.imagenBandera,
      country: userOpponent.country,
      marco: userOpponent.marco,
      moneda: parseInt(valors[next].moneda)
    }));
     socket.emit('sendGame', {
       color: colorRamdon,
       room,
       gameId: uuid,
       Id: firstId,
       username: userChess?.username,
       opponentId: userOpponent._id,
       time: infUser?.time,
       ratingBullet: userChess?.eloBullet,
       ratingBlitz: userChess?.eloBlitz,
       ratingFast: userChess?.eloFast,
       bandera: userChess?.imagenBandera,
       country: userChess?.country,
       photo: auth?.user?.photo,
       marco: auth?.user?.marco,
       moneda: parseInt(valors[next].moneda),
       valor: valors[next].valor
     });   
  }
  
  //cuando el desafiado acepta
  const playGame = () => {
    resetBoard();
    const gameId = localStorage.getItem('gameRoom') ||  roomGame;
    postGames(gameId,resetPieces);
    setPieces(resetPieces);
    setShowModalOpponent(false); 
    // socket.emit('userAvailable', auth?.user?._id);  
    if(socket === null) return;
     socket.emit('playGame', {
      showModalOpponent, 
      roomGame: gameId, 
      idOpponent: auth?.user?._id,
      username: auth?.user?.username || auth?.user?.name,
      time: infUser?.time
    });
     socket.emit('joinRoomGamePlay', gameId);
     
     const time = parseInt(localStorage.getItem('time')) || infUser?.time;
     socket.emit('initPlay', {gameId: roomGame, time}); 
     socket.emit('userBusy', auth?.user?._id);
     localStorage.setItem('infUser', JSON.stringify(infUser));
     setRoom(gameId);
     setIsGameStart(true);
     localStorage.setItem('gameStart', JSON.stringify(true));
     navigate('/chess');    
  };

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

  const handleSignOut = (e)=>{
    setOnline(onlineUsers);
    setShowRoom(true);
  }

  const handlePreviou = (e) =>{
     e.preventDefault()

    if(next > 0) {
      setNext(next - 1);
      localStorage.setItem('next', next - 1)
    }
  }

  const handleNext = (e) =>{
    e.preventDefault()
    if(next < 10){ 
      setNext(next + 1)
      localStorage.setItem('next', next + 1)
    }
  }
  
  let count = 1;
  return (
   <>
      <div className={style.tercerdiv}> 
         <div className={style.container}>
            <div className={style.desafio}>
              <div className={style.SignOut} onMouseLeave={()=>setShowModalSign(false)}>
                <FaSignOutAlt 
                  className={style.FaSignOutAlt}
                  onMouseEnter={()=>setShowModalSign(true)}               
                />
                {showModalSign && 
                  <div className={style.dropdown}>
                    <p onClick={()=>handleSignOut()}>Cambiar de sala</p>
                    <p><Nav.Link href="/">Salir</Nav.Link></p>
                  </div>
                }
              </div>
              <div className={style.titleWithIcon}>          
                <img 
                  src={'/icon/userswhite.png'} 
                  alt="" 
                />
                <h5>
                  {language.Challenge_a_match} {infUser?.time === 60 
                    ? '1' : infUser?.time === 120 
                    ? '2' : infUser?.time === 180 
                    ? '3' : infUser.time === 300 
                    ? '5' : infUser?.time === 600 
                    ? '10' : '20'
                  } mn
                </h5>
                {infUser?.time === 60  || infUser?.time === 120 
                  ? <BulletSvg/> 
                  : infUser?.time === 180 || infUser.time === 300 
                  ? <BlitzSvg/> 
                  : <div className={style.fastContainer}>
                      <div className={style.fast} >
                        <Fast/>
                      </div>
                    </div>
                  }
              </div>
              <div 
                className={style.setting} 
                title={language.settings}
                onClick={()=>setShowSettings(true)}>
                  <FaCog className={style.FaCog} />
              </div>
            </div>       
            <div>  
            </div>      
        {sortedUsers.length === 0 ?          
           <SpinnerDowloand text={`${language.Loading_Players} . . .`} color={'#fff'}/>         
        : sortedUsers.map((o, index) => (
          <React.Fragment key={index}>
              { isExisteUser ?
                <li               
                  className={`${style.frienditem} ${hoveredFriend === o._id ? `${style.frienditem} ${style.frienditemHovered}` : ''}`}              
                  style={o._id === auth?.user?._id ? {background: 'linear-gradient(to top, #4e8381  0%, #73c2c0 100%)'} : {}}
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
                      <img src={o?.imagenBandera} title={o?.country} className={style.bandera} alt="" />
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
                </li> :
                <p>Recarga la pagina para reconetarte a la sala</p>
              }
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
                    <div className={style.containerMoneda}>                
                      <img src="/icon/moneda.png" alt="" />
                      <div className={style.dinero}>
                        {userModal?.score
                            ?  
                            <span>{userModal?.score}</span>
                            :
                            <div className='text-white'>
                                <Spinner animation="grow" size="sm" />
                                <Spinner animation="grow" />
                            </div>
                        }
                      </div>               
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
                        <Spinner animation="grow" style={{color: '#154360'}}/>
                      </> 
                    }
                    {!aceptarDesafio && isOffGame && <h3>{language.Challenge_rejected}</h3>}
                </div>  
                  {
                    isBusy &&
                    <><Spinner animation="grow" style={{color: '#154360'}}/>
                    <p>esta ocupado</p></>
                    
                  }   
                 { auth?.user?._id  !== userModal?._id && !aceptarDesafio && !showModalMin &&
                    !isBusy &&
                    <div className={style.valor} >
                       {next > 0 && 
                       <button 
                          className={style.polygon} 
                          onClick={(e)=>handlePreviou(e)}
                          
                        >
                        <svg  viewBox="0 0 24 24">
                          <polygon points="14,2 14,22 4,12" fill="#154360" />
                        </svg>
                      </button>}
                      <div className={style.moneda}
                        style={next === 0 ?
                           {marginLeft: '40px'} : 
                              next === 10 || parseInt(userModal?.score) < valors[next+1]?.moneda 
                              || user?.score < valors[next+1]?.moneda
                            ? {marginRight: '40px'} : {}}
                      >
                         <img src="/icon/moneda.png" alt="" />
                          <span>{valors[next]?.valor}</span>
                      </div>
                      {(next !== 10 
                          && valors[next+1]?.moneda < parseInt(userModal?.score) 
                          && valors[next+1]?.moneda < user?.score ) 
                          && 
                        <button className={style.polygon} onClick={(e)=>handleNext(e)}  >
                          <svg viewBox="0 0 24 24">
                            <polygon points="10,2 10,22 20,12" fill="#154360 " />
                          </svg>
                        </button>
                      }
                    </div>
                            }                    
                  <div className={style.modalButtons}>
                    {auth?.user?._id  !== userModal?._id && !aceptarDesafio && !showModalMin &&
                     !isBusy &&
                    
                    <>
                      <button 
                        className={style.button} 
                        onClick={()=>createGame(
                           auth?.user?._id, 
                           userModal,
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
                        <div className={style.valor}>
                        <div className={style.moneda}
                            style={next === 0 ? {marginLeft: '40px'} : next === 10 ? {marginRight: '40px'} : {}}
                          >
                            <img src="/icon/moneda.png" alt="" />
                              <span>{infUser?.valor}</span>
                          </div>  
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
          </React.Fragment>
        ))}
         </div>     
    </div>
    <SettingsModal 
      show={showModalSettings}
      handleClose={()=> setShowSettings(false)}
    />
    { showModalRoom &&
        <JoinRoom setShowModalMin={setShowRoom}/>
      }
   </>
  );
};

export default Friends;