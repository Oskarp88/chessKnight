import React, { useContext } from 'react';
import style from './Modal.module.css'; // Asegúrate de importar correctamente el archivo CSS
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext';
import { GameContext } from '../../context/gameContext';

const ModalRevancha = ({infUser}) => {
  const navigate = useNavigate();
  const {auth} = useAuth();
  const {socket, room} = useSocketContext();
  const {setCheckMate} = useCheckMateContext();
  const {AceptarRevancha} = useContext(GameContext);

  const regresarHandle = () => {
      if(socket === null) return;
      if (auth?.user) {  
        setCheckMate(null);  
         socket.emit('revanchaRechazada', infUser?.room);
         socket.emit('join-room', infUser?.time);
         socket.emit('userAvailable', auth?.user?._id);
         socket.emit('deletePartida', {room: infUser?.time, roomPartida: room});

        navigate('/auth/channel');
      }else{
        navigate('/login');
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
          <div className={style.button}>
            <button onClick={AceptarRevancha}>Aceptar</button>
            <button onClick={regresarHandle}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRevancha;
