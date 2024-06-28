import React from 'react';
import style from './ModalTablasAceptada.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext';

export default function ModalTiedRepetition({infUser, revanchaHandle, frase}) {

    const navigate = useNavigate();
    const {auth} = useAuth();
    const {socket, room} = useSocketContext();
    const {setCheckMate} = useCheckMateContext();

    const regresarHandle = () => {
      localStorage.removeItem('destinationCell');
      localStorage.removeItem('startCell');
      localStorage.removeItem('pieces'); 
      localStorage.removeItem('whiteTime');
      localStorage.removeItem('blackTime');
        if(socket === null) return;
        if (auth?.user) {  
          setCheckMate(prevCheckMate => ({
            ...prevCheckMate,
            userId: '',
            time: '',
            game: '',
            elo: 0
          }));   
           socket.emit('join-room', 123);
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
          <h2>{frase ? frase : 'tablas'}</h2> 
          <img className={style.profileChekMate} src={`http://localhost:8080/api/user-photo/${infUser?.idOpponent}`} alt='assets/avatar/user.png'  />
          <img className={style.profileChekMate} src={`http://localhost:8080/api/user-photo/${auth?.user?._id}`} alt='assets/avatar/user.png'  />
          <div className={style.button}>
          <button onClick={regresarHandle}>Regresar</button>
          <button onClick={revanchaHandle}>Revancha</button>
        </div>
        </div>
      </div>
  )
}