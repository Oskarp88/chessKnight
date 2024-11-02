import React, { useState, useEffect } from 'react';
import style from './Modal.module.css'; // Asegúrate de importar correctamente el archivo CSS
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext';
import { Spinner } from 'react-bootstrap';

const ModalRevancha = ({infUser, AceptarRevancha}) => {
  const navigate = useNavigate();
  const {auth} = useAuth();
  const {socket, room} = useSocketContext();
  const {setCheckMate} = useCheckMateContext();
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let interval;
    if (redirecting) {
      interval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [redirecting]);

  useEffect(() => {
    if (redirecting && countdown === 0) {
      if(socket === null) return;
      if (auth?.user) {  
        setCheckMate(null);       
         socket.emit('join-room', infUser?.time);
         socket.emit('userAvailable', auth?.user?._id);
         socket.emit('deletePartida', {room: infUser?.time, roomPartida: room});

        navigate('/auth/channel');
      }else{
        navigate('/login');
      }
    }
  }, [redirecting, countdown]);

  const regresarHandle = () => {
       setRedirecting(true);
       if(socket){
         socket.emit('revanchaRechazada', infUser?.room);
       }    
    }
  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.header}>
          <span>REVANCHA</span>
        </div>        
        <div className={style.body}>
          <p>{infUser.username} te ha retado de nuevo</p> 
          <img className={style.profileChekMate} src={infUser?.photo} alt='assets/avatar/user.png'  />   
          <p>¿Aceptas la revancha?</p>
          {redirecting ? (
            <div className={style.redirecting}>
              <Spinner animation="border" variant="primary" />
              <p className={style.dirigiendo}>Dirigiendo a sala de juego en {countdown} segundos...</p>
            </div>
          
          ) : (
            <div className={style.button}>
              <button onClick={AceptarRevancha}>Aceptar</button>
              <button onClick={regresarHandle}>Cancelar</button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ModalRevancha;
