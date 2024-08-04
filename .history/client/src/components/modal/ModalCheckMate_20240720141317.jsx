import React, { useState, useEffect } from 'react';
import style from './ModalCheckMate.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useSocketContext } from '../../context/socketContext';
import { useCheckMateContext } from '../../context/checkMateContext';
import FastSvg from '../../svg/fastSvg';
import { BlitzSvg, BulletSvg } from '../../svg';

export default function ModalCheckMate({ infUser, time, revanchaHandle, frase }) {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { socket, room } = useSocketContext();
  const { setCheckMate } = useCheckMateContext();
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
      localStorage.removeItem('destinationCell');
      localStorage.removeItem('startCell');
      localStorage.removeItem('pieces'); 
      localStorage.removeItem('whiteTime');
      localStorage.removeItem('blackTime');
      if (auth?.user) {
        setCheckMate((prevCheckMate) => ({
          ...prevCheckMate,
          userId: '',
          time: '',
          game: '',
          elo: 0,
        }));
        socket.emit('join-room', 123);
        socket.emit('userAvailable', auth?.user?._id);
        socket.emit('deletePartida', { room: infUser?.time, roomPartida: room });
        navigate('/auth/channel');
      } else {
        navigate('/login');
      }
    }
  }, [redirecting, countdown]);

  const regresarHandle = () => {
    
    setRedirecting(true);
  };

  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.container}>
          <h3>{infUser?.turn === 'white' ? 'Negras' : 'Blancas'} ganan</h3>
          <p>{frase}</p>
        </div>
        <div className={style.body}>
          <div className={style.image}>
          <img 
             className={style.profileChekMate}
             style={ infUser.color === 'white' ? infUser?.status === '1' ? {border: 'solid 7px #D32F2F'} : {border: 'solid 7px #388E3C '} :  infUser?.status === '1' ?  {border: 'solid 7px #388E3C '} : {border: 'solid 7px #D32F2F'} } 
             src={infUser?.color === 'white' ?  infUser?.photo : auth?.user?.photo}
             alt='' />
          <div className={style.time}>
            {time === 60 || time === 120 ? <BulletSvg/> : time === 180 || time === 300 ? <BlitzSvg/> : <FastSvg/>}
          </div>
          <img 
             className={style.profileChekMate} 
             style={ infUser.color === 'black' ? infUser?.status === '1' ? {border: 'solid 7px #D32F2F'} : {border: 'solid 7px #388E3C '} :  infUser?.status === '1' ?  {border: 'solid 7px #388E3C '} : {border: 'solid 7px #D32F2F'} } 

             src={ infUser?.color === 'black' ? infUser?.photo : auth?.user?.photo} 
            alt='' />
          </div>
          <div className={style.tittle}> 
            {`${infUser.color === 'white' ? 
                 `${infUser?.nameOpponent} ${infUser?.status === '1' ? '| 0' : '| 1'}`: 
                 `${infUser?.username} ${infUser?.status === '1' ? '| 1' : '| 0'} -`} 
              ${infUser.color === 'black' ? 
                 `${infUser?.status === '1' ? '0 |' : '1 |'} ${infUser?.nameOpponent} `: 
                 `- ${infUser?.status === '1' ? '1 |': '0 |'} ${infUser?.username} `}
              `} 
          </div>
          {redirecting ? (
            <div className={style.redirecting}>
              <div className={style.spinner}></div>
              <p className={style.dirigiendo}>Dirigiendo a sala de juego en {countdown} segundos...</p>
            </div>
          
          ) : (
            <div className={style.button}>
              <button onClick={regresarHandle}>Regresar</button>
              <button onClick={revanchaHandle}>Revancha</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
