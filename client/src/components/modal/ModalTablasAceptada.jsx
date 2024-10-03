import React, { useContext } from 'react';
import style from './ModalTablasAceptada.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext';
import { BlitzSvg, BulletSvg, FastSvg } from '../../svg';
import { GameContext } from '../../context/gameContext';

export default function ModalTablasAceptada({infUser, frase}) {

    const navigate = useNavigate();
    const {auth} = useAuth();
    const {socket, room} = useSocketContext();
    const {setCheckMate} = useCheckMateContext();
    const {revanchaHandle} = useContext(GameContext);

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
            <h2>Empate</h2> 
            <span>{frase}</span>
          </div>
          <div className={style.body}>
            <div className={style.image}>
              <img 
                className={style.profileChekMate} 
                src={
                   infUser.color !== 'white' ? infUser?.photo :
                   auth?.user?.photo
                 } 
                alt='assets/avatar/user.png'  
              />
              <div className={style.time}>
                {infUser?.time === 1 || infUser?.time === 2 ? <BulletSvg/> : infUser?.time === 3 || infUser?.time === 5 ? <BlitzSvg/> : <FastSvg/>}
              </div>
              <img 
                className={style.profileChekMate} 
                src={
                  infUser.color === 'white' ? infUser?.photo :
                  auth?.user?.photo
                }
                alt='assets/avatar/user.png'  
              />
            </div>
            <div className={style.tittle}> 
            {`${infUser.color !== 'white' ? 
                 `${infUser?.username}  | 1/2 `: 
                 `${auth?.user?.username} | 1/2 `} 
              ${infUser.color !== 'black' ? 
              `- 1/2 | ${infUser?.username} `: 
              `- 1/2 | ${auth?.user?.username}`}
              `} 
          </div>
            <div className={style.button}>
              <button onClick={regresarHandle}>Regresar</button>
              <button onClick={revanchaHandle}>Revancha</button>
            </div>
          </div>
        </div>
      </div>
  )
}
