import React, { useContext, useEffect, useState } from 'react';
import style from'./Friends.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import ModalProfile from '../modal/ModalProfile';
import { useChessboardContext } from '../../../context/boardContext';
import { GameContext } from '../../../context/gameContext';
import { ChatContext } from '../../../context/ChatContext';
import { useSocketContext } from '../../../context/socketContext';
import JoinRoom from '../../modal/JoinRoom';
import SettingsModal from '../../modal/SettingsModal';
import { valors } from '../../../Constants';
import SpinnerDowloand from '../../spinner/SpinnerDowloand';
import { baseUrl, getRequest } from '../../../utils/services';
import { useLanguagesContext } from '../../../context/languagesContext';
import { useAuth } from '../../../context/authContext';
import HeaderRooms from './components/headerRooms';
import ListPlayers from './components/ListPlayers';
import ModalSendChallenger from '../modal/ModalSendChallenger';
import ModalReceiveChallenger from '../modal/modalReceiveChallenger';


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
  const [next, setNext] = useState(0);
  const [showModalOpponent, setShowModalOpponent] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [aceptarDesafio, setAceptarDesafio] = useState(false)
  const [userModal, setUserModal] = useState(null);
  const [userOpponentModal, setUserOpponentModal] = useState(null);
  const [roomGame, setRoomGame] = useState(null);
  const [isOffGame, setOffGame] = useState(false);
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
  const existeUser = allOponnentOnline.some(user => user._id === auth.user._id);

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

  const handleSignOut = ()=>{
    setOnline(onlineUsers);
    setShowRoom(true);
  }

  return (
   <>
      <div className={style.tercerdiv}> 
         <div className={style.container}>
            <HeaderRooms 
              handleSignOut={handleSignOut}
              setShowSettings={setShowSettings}
            />      
            <div>  
            </div>      
            {sortedUsers.length === 0 ?          
              <SpinnerDowloand text={`${language.Loading_Players} . . .`} color={'#fff'}/>         
            : sortedUsers.map((o, index) => (
              <React.Fragment key={index}>
              { isExisteUser ?
                <ListPlayers 
                  handleModalOpen={handleModalOpen}
                  hoveredFriend={hoveredFriend}
                  setHoveredFriend={setHoveredFriend}
                  user={o}
                /> :
                <p className={style.reconnect}>Recarga la pagina para reconectarte a la sala</p>
              }
              {showModal && (
                 <ModalSendChallenger 
                   aceptarDesafio={aceptarDesafio}
                   isBusy={isBusy}
                   isOffGame={isOffGame}
                   showModal={showModal}
                   showModalMin={showModalMin}
                   userModal={userModal}
                   createGame={createGame}
                   mensajeChat={mensajeChat}
                   next={next}
                   setNext={setNext}
                   handleModalClose={handleModalClose}
                   handleModalInf={handleModalInf}
                   modalLoading={modalLoading}
                 />
                )}
                {showModalOpponent && (
                  <ModalReceiveChallenger 
                    handleModalInf={handleModalInf}
                    handleModalOpponentClose={handleModalOpponentClose}
                    modalLoading={modalLoading}
                    next={next}
                    offGame={offGame}
                    playGame={playGame}
                    showModalOpponent={showModalOpponent}
                    userModal={userModal}
                    userOpponentModal={userOpponentModal}
                  />
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