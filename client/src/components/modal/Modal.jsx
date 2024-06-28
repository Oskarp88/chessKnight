import React from 'react';
import style from './Modal.module.css'; // Asegúrate de importar correctamente el archivo CSS
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext';
import { BlitzSvg, BulletSvg, FastSvg } from '../../svg';

const Modal = ({infUser, user, isWhiteTime, revanchaHandle}) => {
  const navigate = useNavigate();
  const {auth} = useAuth();
  const {socket, room} = useSocketContext();
  const {setCheckMate} = useCheckMateContext();

  const regresarHandle = () => {
    localStorage.removeItem('pieces'); 
    localStorage.removeItem('whiteTime');
    localStorage.removeItem('blackTime');
    localStorage.removeItem('destinationCell');
    localStorage.removeItem('startCell');
    if(socket === null) return;  
    if (auth?.user) {  
      setCheckMate(prevCheckMate => ({
        ...prevCheckMate,
        userId: '',
        time: '',
        game: '',
        elo: 0
      }));   
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
        <h2>{isWhiteTime === 'white' ? 'Negras' : 'Blancas'} ganan</h2>
        <p>por tiempo agotado de las {isWhiteTime === 'white' ? 'Blancas' : 'Negras'}</p>
        </div>
       <div className={style.body}>
           <div className={style.image}>
           {infUser.color === 'white'? 
            <img 
              className={style.profileChekMate} 
              style={isWhiteTime === 'white' ? {border: 'solid 7px #D32F2F' } : {border: 'solid 7px #388E3C' }} 
              src={`http://localhost:8080/api/user-photo/${user?._id}`} 
              alt='assets/avatar/user.png'  />
            : <img 
              className={style.profileChekMate} 
              style={isWhiteTime === 'white' ? {border: 'solid 7px #D32F2F' } : {border: 'solid 7px #388E3C' }} 
              src={`http://localhost:8080/api/user-photo/${infUser?.idOpponent}`} 
              alt='assets/avatar/user.png'/>}
                <div className={style.time}>
                  {infUser?.time === 1 || infUser?.time === 2 ? <BulletSvg/> : infUser?.time === 3 || infUser?.time === 5 ? <BlitzSvg/> : <FastSvg/>}
                </div>
            {
              infUser.color === 'black'? 
              <img 
                className={style.profileChekMate}
                style={isWhiteTime !== 'white' ? {border: 'solid 7px #D32F2F' } : {border: 'solid 7px #388E3C' }}  
                src={`http://localhost:8080/api/user-photo/${user?._id}`} 
                alt='assets/avatar/user.png'  />
              : <img 
                  className={style.profileChekMate}
                  style={isWhiteTime !== 'white' ? {border: 'solid 7px #D32F2F' } : {border: 'solid 7px #388E3C' }}  
                  src={`http://localhost:8080/api/user-photo/${infUser?.idOpponent}`} 
                  alt='assets/avatar/user.png'/>
            }
           </div>
           <div className={style.tittle}> 
            {`${infUser.color === 'white' ? 
                 `${user?.username} ${isWhiteTime === 'white' ? '| 0' : '| 1'}`: 
                 `${infUser?.username} ${isWhiteTime !== 'white' ? '| 1' : '| 0'} -`} 
              ${infUser.color === 'black' ? 
                 `${isWhiteTime === 'white' ? '1 |' : '0 |'} ${user?.username} `: 
                 `- ${isWhiteTime !== 'white' ? '0 |': '1 |'} ${infUser?.username}`}
              `} 
          </div>          <div className={style.button}>
            <button onClick={regresarHandle}>Regresar</button>
            <button onClick={revanchaHandle}>Revancha</button>
          </div>
       </div>
      </div>
    </div>
  );
};

export default Modal;
