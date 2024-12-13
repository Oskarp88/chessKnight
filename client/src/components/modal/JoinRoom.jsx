import React, { useContext } from 'react'
import { useAuth } from '../../context/authContext';
import style from '../../pages/home/Home.module.css';
import { useSocketContext } from '../../context/socketContext';
import Fast from '../../img/fast';
import { useNavigate } from 'react-router-dom';
import { useCheckMateContext } from '../../context/checkMateContext';
import { GameContext } from '../../context/gameContext';

function JoinRoom({setShowModalMin}) {
    const {auth} = useAuth();
    const {socket,playersTotal, } = useSocketContext();
    const {setInfUser} = useContext(GameContext);
    const {setCheckMate} = useCheckMateContext();
    const navigate = useNavigate();

    const createRoom = (userId, time) => {
        if(socket === null) return;
        if (auth?.user) {  
          setCheckMate(null); 
          setInfUser((prevInfUser) => ({
            ...prevInfUser,
            time: parseInt(time)
          }));
          localStorage.setItem('time', time);
           socket.emit('userTime', {userId, time});
           socket.emit('join-room', time);
          navigate('/auth/channel');
          setShowModalMin(false);
        }else{
          navigate('/login');
          setShowModalMin(false);
        }
      };
    const handleModalClose = () => {
        setShowModalMin(false);
      }
  return (
    <div className={style.overlay}>
          <div className={style.gameOverModal}>
              <div className={style.header}>
                <a  className={style.close} onClick={() => handleModalClose()}>
                  <svg xmlns="http://www.w3.org/2000/svg"  width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16" >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                  </svg>
                </a>
                <h2> Unete a una sala</h2> 
              </div>  
             <div className={style.body}>                 
                <svg style={{ color: '#F9A825', marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                  <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                  <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
                </svg>
                <span style={{ color: '#1A237E ', fontWeight: 'bold' }}> 
                  Bullet
                </span>     
             
                <div className={style.buttons}>
                  <div className={style.containerButtons}>
                    <a 
                      className={style.a} 
                      onClick={() => createRoom(auth?.user?._id,  60)}
                    >
                      1 min
                      <div className={style.icon}>
                        <div className={style.arrow}></div>
                      </div>
                    </a>
                    <p className={style.playersTotal}>{ `(${playersTotal.uno} players)`}</p>
                  </div>
                  <div className={style.containerButtons}>
                    <a 
                      className={style.a} 
                      onClick={() => createRoom(auth?.user?._id, 120)}
                    >
                      2 min
                      <div className={style.icon}>
                        <div className={style.arrow}></div>
                      </div>
                    </a>
                    <p className={style.playersTotal}>{ `(${playersTotal.dos} players)`}</p>
                  </div>
              </div>
                <svg style={{ color: '#FFEB3B', marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                </svg>
                <span style={{ color: '#1A237E ', fontWeight: 'bold' }}> 
                  Blitz
                </span>       
                <div className={style.buttons}>   
                  <div className={style.containerButtons}>       
                    <a 
                      className={style.a} 
                      onClick={() => createRoom(auth?.user?._id, 180)}
                    >
                      3 min
                      <div className={style.icon}>
                        <div className={style.arrow}></div>
                      </div>
                    </a>
                    <p className={style.playersTotal}>{ `(${playersTotal.tres} players)`}</p>
                  </div>
                  <div className={style.containerButtons}> 
                    <a 
                      className={style.a} 
                      onClick={() => createRoom(auth?.user?._id, 300)}
                    >
                      5 min
                      <div className={style.icon}>
                      <div className={style.arrow}></div>
                    </div>
                    </a>
                  <p className={style.playersTotal}>{ `(${playersTotal.cinco} players)`}</p>
                  </div>
                </div>
                <div className={style.fast}>
                <div style={{width: '20px', height: '20px', marginRight: '5px'}}>
                  <Fast/>
                </div>
                <span style={{ color: '#1A237E ', fontWeight: 'bold' }}> 
                    Rapid
                </span>
                </div>
              <div className={style.buttons}>
                <div className={style.containerButtons}> 
                  <a 
                    className={style.a} 
                    onClick={() => createRoom(auth?.user?._id,  600)}
                  >
                    10 min
                    <div className={style.icon}>
                      <div className={style.arrow}></div>
                    </div>
                  </a>
                <p className={style.playersTotal}>{ `(${playersTotal.diez} players)`}</p>
                </div>
                <div className={style.containerButtons}> 
                  <a 
                    className={style.a} 
                    onClick={() => createRoom(auth?.user?._id,  1200)}
                  >
                    20 min
                    <div className={style.icon}>
                      <div className={style.arrow}></div>
                    </div>
                  </a>
                  <p className={style.playersTotal}>{ `(${playersTotal.veinte} players)`}</p>
                </div>
              </div>
             </div>
          </div>
        </div>
  )
}

export default JoinRoom