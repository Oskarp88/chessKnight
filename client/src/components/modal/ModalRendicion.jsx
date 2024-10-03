import React from 'react';
import style from './Modal.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext';

export default function ModalRendicion({
   infUser, 
   user, 
   isWhiteTime, 
   revanchaHandle, 
   rendicion, 
   sendRevancha, 
   sendRevanchaRechada}) {
    
    const navigate = useNavigate();
  const {auth} = useAuth();
  const {socket, room} = useSocketContext();
  const {setCheckMate} = useCheckMateContext();

  const regresarHandle = () => {
    if(socket === null) return;
    if (auth?.user) {    
      setCheckMate(prevCheckMate => ({
        ...prevCheckMate,
        userId: '',
        time: '',
        game: '',
        elo: 0
      })); 
      socket.emit('userAvailable', auth?.user?._id);
       socket.emit('join-room', infUser?.time);
       socket.emit('deletePartida', {room: infUser?.time, roomPartida: room});

      navigate('/auth/channel');
    }else{
      navigate('/login');
    }
  }
  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <h2>{rendicion ? infUser.color === 'white' ? 'blancas' : 'negras' : infUser.color === 'white' ? 'negras' : 'blancas'} han Abandonado</h2>
        {rendicion ? 
        <img className={style.profileChekMate} src={infUser?.photo} alt=''  />
        : <img className={style.profileChekMate} src={user?.photo} alt=''/>}
        { 
                  sendRevancha  ? <p>esperando que acepte la revancha {infUser?.username}</p> : 
                  sendRevanchaRechada ? <p>{infUser?.username} no acepto la revancha</p> : 
                  <p>Ha ganado {rendicion ? infUser.username : user?.username} por abandono.</p>}
        <div className={style.button}>
          <button onClick={regresarHandle}>Regresar</button>
          <button onClick={revanchaHandle}>Revancha</button>
        </div>
      </div>
    </div>
  )
}
