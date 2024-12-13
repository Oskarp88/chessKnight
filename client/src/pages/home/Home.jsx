import { useContext, useEffect, useState } from "react";
import { useChessboardContext } from "../../context/boardContext";
import { ChatContext } from "../../context/ChatContext";
import { useSocketContext } from "../../context/socketContext";
import { useAuth } from "../../context/authContext";
import style from './Home.module.css';
import JoinRoom from "../../components/modal/JoinRoom";
import ContainerFondoHomeImage from "./ContainerFondoHomeImage";


export function Home() {
  const {chessColor} = useChessboardContext();
  const [showModalMin, setShowModalMin] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 400); 
  const { onlineUsers} = useContext(ChatContext);
  const {auth} = useAuth();
  const {socket, setOnline} = useSocketContext();

  useEffect(() => {
    setOnline(onlineUsers);
  },[onlineUsers]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 400);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    console.log('isMobileView', isMobileView);
  
  }, [isMobileView]);

  const joinRoom = () =>{
    setShowModalMin(true);
  }

  useEffect(() => {
    if(socket === null) return;
    const handleDisconnect = () => {
      console.log('Socket connection closed');
      // Puedes realizar acciones adicionales aquí si es necesario
    };

    // Agrega un escucha para el evento "disconnect"
    socket.on('disconnect', handleDisconnect);

    // Limpia el escucha cuando el componente se desmonta
    return () => {
     socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  return (
    <div 
      className={style.container} 
      style={auth?.user 
        ? {background: chessColor?.fondo, paddingBottom: '4rem'} 
        : {background: chessColor?.fondo}}
    >
       <ContainerFondoHomeImage 
         joinRoom={joinRoom}
       />
      { showModalMin &&
        <JoinRoom setShowModalMin={setShowModalMin}/>
      } 
    </div>
  );
}
