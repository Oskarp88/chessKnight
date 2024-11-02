import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Home.module.css';
import { useSocketContext } from '../context/socketContext';
import { useAuth } from '../context/authContext';
import { useCheckMateContext } from '../context/checkMateContext';
import { RankingTable } from '../components/channel/RankingTablaFast';
import { RankingTableBlitz } from '../components/channel/RakingTablaBlitz';
import { RankingTableBullet } from '../components/channel/RakingTablaBullet';
import { useChessboardContext } from '../context/boardContext';
import { BlitzSvg, BulletSvg, FastSvg, LostSvg, WonSvg } from '../svg';
import { baseUrl, getRequest } from '../utils/services';
import SpinnerDowloand from '../components/spinner/SpinnerDowloand';
import TiedSvg from '../svg/tiedSvg';
import { useLanguagesContext } from '../context/languagesContext';
import RechartsPieChart from '../components/piechart/RechartsPieChart';
import Insignias from '../components/insignias/Insignias';
import Fast from '../img/fast';
import { ChatContext } from '../context/ChatContext';
import JoinRoom from '../components/modal/JoinRoom';


const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export function Home() {
  const {chessColor} = useChessboardContext();
  const [showModalMin, setShowModalMin] = useState(false);
  const [paginate, setPaginate] = useState(1);
  const [autoPaginate, setAutoPaginate] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 400);
  const [partida, setPartidas] = useState([]);
  const [user, setUser] = useState(null);
  const [stast, setStats] = useState('fast');
  const { onlineUsers} = useContext(ChatContext);
  const {auth} = useAuth();
  const {socket, setOnline} = useSocketContext();
  const {language} = useLanguagesContext();

  const miContaineHistorial = useRef(null);

  useEffect(() => {
    setOnline(onlineUsers);
  },[onlineUsers]);
   useEffect(() => {
      const allPartidas = async() => {
        const response = await getRequest(`${baseUrl}/partida/user/historial/${auth?.user?._id}`);
        if(response.error){
          return console.log('Error fetching historial partidas', response);
        }
        setPartidas(response.partida);
      }
      allPartidas()
   },[auth?.user?._id]);

  useEffect(()=>{
    const User = async() => {
      const response = await getRequest(`${baseUrl}/user/${auth?.user?._id}`);
      if(response.error){
         return console.log('Error fetching users', response);
      }
       setUser(response);
    }   
    
    User();
  },[auth?.user?._id]);
  
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

    useInterval(() => {
      if (autoPaginate) {
        if (paginate === 1) {
          setPaginate(3);
        } else {
          setPaginate(p => p - 1);
        }
      }
    }, 15000);
 
  
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
  
  const handleFormer = () => {
    if(parseInt(paginate) === 2 || parseInt(paginate) === 3) setPaginate(parseInt(paginate) -1);
    setAutoPaginate(false);
    setTimeout(()=>{
       setAutoPaginate(true);
    },30000)
  }

  const handleNext = () => {
    if(parseInt(paginate) === 1 || parseInt(paginate) === 2) setPaginate(parseInt(paginate) +1);
    setAutoPaginate(false);
    setTimeout(()=>{
       setAutoPaginate(true);
    },30000)
  }

  const handleClick = (data) => {
     setStats(data);
     miContaineHistorial.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div 
      className={style.container} 
      style={auth?.user 
        ? {background: chessColor?.fondo, paddingBottom: '4rem'} 
        : {background: chessColor?.fondo}}
    >
     <div className={style.containerFondoImage}>
     <div className={style.image}>
        <div className={style.home}>
          <div className={style.homestyle}>
            <img src={'logo/CHESS.png'} className={style.logo} alt="" />
            <div className={style.containerWelcome}>
              <h1 
                className={style.titulo} 
              >           
                {language.welcome_to} 
                {' '}
                {auth?.user?.name 
                    ? auth.user.name.length > 8 
                        ? auth.user.name.charAt(0).toUpperCase() + auth.user.name.substring(1, 8) + '...' 
                        : auth.user.name.charAt(0).toUpperCase() + auth.user.name.slice(1)
                    : ''
                }

              </h1>
              <p style={{color: chessColor?.color}}>
                {language?.play_chess_online_and_improve_your_skills}
              </p>
            </div>
                        
              <button 
                className={style.wrapper}
                onClick={joinRoom}
                ref={miContaineHistorial}
              >
                {language?.join_a_room} 
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>            
          </div> 
          <div className={style.table}>
             <div 
               className={style.chevron} 
               onClick={() => handleFormer()}
             >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                style={ paginate === 1 
                         ? {color: '#50c256'}  : paginate === 2 
                         ? {color: '#FFEB3B'}  : {color: '#F9A825'}
                      }  
                fill="currentColor" 
                width="40" height="40"
                className="bi bi-chevron-left" 
                viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
              </svg>
             </div>
             <div>
               {
                 paginate === 1 ? <RankingTable/> : 
                 paginate === 2 ? <RankingTableBlitz/> : 
                 <RankingTableBullet />
               }
             </div>
             <div className={style.chevron} onClick={() => handleNext()}>
                <svg 
                   xmlns="http://www.w3.org/2000/svg" 
                   style={ paginate === 1 
                           ? {color: '#50c256'} : paginate === 2 
                           ? {color: '#FFEB3B'} : {color: '#F9A825'}
                         }  
                   width="40" height="40"
                   fill="currentColor" 
                   className="bi bi-chevron-right" 
                   viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
             </div>
          </div>                  
        </div>
      </div>
     {
      auth?.user  && 
      <div className={style.fondoDatos} >
        <div className={style.containerStats}>
          <h5>
            {language.statistics_of} {auth?.user?.name 
              ? `${auth.user.name} ${auth.user.lastName}`
              : `${auth?.user?.username}`}
          </h5>
        </div>
        <div  className={style.containerStats}>
           <a  className={`${style.button} ${style.lightbgblue} ${style.clearfix}`}
             onClick={()=> handleClick('fast')}
           >
              <span>{language.fast}</span>
              <div className={style.icon}>
                <svg style={{ color: '#80de83' }} xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                </svg>
              </div>
          </a>
          <a  className={`${style.button} ${style.lightbgyellow} ${style.clearfix}`}
            onClick={()=> handleClick('blitz')}
          >
              <span>Blitz</span>
              <div className={style.icon}>
                <svg style={{ color: '#FFEB3B' }} xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                </svg>
              </div>
          </a>
          <a  className={`${style.button} ${style.lightbgorange} ${style.clearfix}`}
            onClick={()=> handleClick('bullet')}
          >
              <span>{language.bullet}</span>
              <div className={style.icon}>
                <svg style={{ color: '#F9A825' }} xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                    <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                    <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
                </svg>
              </div>
          </a>
        </div>
        <div className={style.containerStatsRating} >        
          <div className={style.containerNivel} 
             style={stast === 'fast' 
                     ? { background: 'rgba(162, 217, 206 ,0.4)'} 
                     : stast === 'blitz' 
                     ? { background: 'rgba(249, 231, 159 ,0.4)'} 
                     : { background: 'rgba(250, 215, 160,0.4)'}}
          >
            {!user?
              <SpinnerDowloand text={`${language?.loading_user_statistics} ${auth?.user?.name}. . .`} />
            :
            <>
              <div className={style.roww}>
                <div className={style.ratingSvg}>
                  <div className={style.svg}>
                    <Insignias o={user} time={stast}/>               
                  </div>
                  <div  className={style.rating}>
                      <div className={style.insignia}>
                        <div>
                          {stast === 'fast' ? 
                              <svg style={{ color: '#80de83' }} xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                              </svg> :
                            stast === 'blitz' ?
                            <svg style={{ color: '#FFEB3B' }} xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                                <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                            </svg> :
                              <svg style={{ color: '#F9A825' }} xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                              <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                                  <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
                              </svg>
                          }
                        </div>
                        
                        <p style={{color: chessColor?.titulo}}>
                          { stast === 'fast' 
                              ? user.eloFast 
                              : stast === 'blitz' 
                              ? user.eloBlitz 
                              : user.eloBullet
                          }
                        </p>
                      </div>
                      <span style={{color: chessColor?.color}}>
                        {language?.rating}
                      </span>
                  </div>
                </div>
                <div className={style.containerDatos}>
                  <div className={style.span}>
                      <div>
                        <span style={{color: chessColor?.color}}>
                          {language?.total_games}: 
                        </span> 
                        <span style={{color: chessColor?.titulo}}>
                          {stast === 'fast' 
                            ? user?.gamesFast 
                            : stast === 'blitz' 
                            ? user.gamesBlitz 
                            : user.gamesBullet
                          }
                        </span>
                      </div> 
                      <div>
                          <span style={{color: chessColor?.color}}>
                            {language?.win}: 
                          </span>
                          <span style={{color: chessColor?.titulo}}>
                            {stast === 'fast' 
                              ? user?.gamesWonFast 
                              : stast === 'blitz' 
                              ? user?.gamesWonBlitz 
                              : user?.gamesWonBullet
                            }
                          </span>
                      </div>
                      <div>
                        <span style={{color: chessColor?.color}}>
                          {language?.lost}: 
                        </span>
                        <span style={{color: chessColor?.titulo}}>
                          {stast === 'fast' 
                            ? user?.gamesLostFast 
                            : stast === 'blitz' 
                            ? user?.gamesLostBlitz 
                            : user?.gamesLostBullet
                          }
                        </span>
                      </div>
                      <div>
                        <span style={{color: chessColor?.color}}>
                          {language?.draw}: 
                        </span>
                        <span style={{color: chessColor?.titulo}}>
                          {stast === 'fast' 
                            ? user?.gamesTiedFast 
                            : stast === 'blitz' 
                            ? user?.gamesTiedBlitz 
                            : user?.gamesTiedBullet
                          }
                        </span>
                      </div>
                      <div>
                        <span style={{color: chessColor?.color}}>
                          {language?.win_streak}: 
                        </span>
                        <span style={{color: chessColor?.titulo}}>
                          {stast === 'fast' 
                            ?  user?.rachaFast 
                            : stast === 'blitz' 
                            ? user?.rachaBlitz 
                            : user?.rachaBullet
                          }
                        </span>
                      </div>                 
                  </div>               
                </div>
              </div>          
              <div 
                className={style.chartContainer} 
                style={{color: chessColor?.titulo}}
              >
                <RechartsPieChart data={stast} user={user}/>
              </div>           
            </>          
         }
        </div>
        </div>
        <div className={style.scrollableContainer}>
          <h3>
            {language?.game_history.toUpperCase()}
          </h3>
          <div>
              <h6 style={{color: chessColor?.color}}> 
                {language?.total_games} ({user?.games})
              </h6>
              <span style={{color: chessColor?.color}}>
                {language?.Last_games_of} {user?.username}
              </span>
              <div className={style.scrollableContent}>
                {partida?.slice().reverse().slice(0,15).map((p, index)=> (
                  <>
                    <div key={index}>
                      <div className={style.containerpartida}>
                          <div className={style.gameType}>
                            <div>
                              {
                                p?.gameType === 'bullet' ? 
                                  <BulletSvg /> :
                                p?.gameType === 'blitz' ? 
                                  <BlitzSvg /> :
                                  <div style={{width: '25px'}}>
                                    <Fast />
                                  </div>
                                  }
                            </div>
                              {
                                
                                  p?.gameType === 'bullet' ? 
                                     <span style={{color: '#dc7633'}}>Bullet  </span> : 
                                  p?.gameType === 'blitz' ? 
                                     <span style={{color: '#f1c40f '}}>Blizt</span> : 
                                     <span style={{color: chessColor?.fast}}>Fast</span>
                                
                             }
                          </div>
                          <div>
                            {
                              p?.player?.color === 'white' ?
                                <div className={style.datos}> 
                                  <span> {p?.player?.name}({p?.player?.elo})</span>
                                  <img  
                                    src={p?.player?.bandera} 
                                    alt={`${p?.player?.country} flag`} 
                                  />  
                                </div>
                                    :
                                <div className={style.datos}>
                                    <span> {p?.nameOpponent?.name}({p?.nameOpponent?.elo})</span>
                                    <img  
                                      src={p?.nameOpponent?.bandera} 
                                      alt={`${p?.nameOpponent?.country} flag`} 
                                    />
                                </div>                        
                              }
                              {
                                p?.player?.color === 'black' ?
                                  <div className={style.datos}> 
                                    <span> {p?.player?.name}({p?.player?.elo})</span>
                                    <img  
                                      src={p?.player?.bandera} 
                                      alt={`${p?.player?.country} flag`} 
                                    />  
                                  </div>
                                    :
                                  <div className={style.datos}>
                                      <span> {p?.nameOpponent?.name}({p?.nameOpponent?.elo})</span>
                                      <img  
                                         src={p?.nameOpponent?.bandera} 
                                         alt={`${p?.nameOpponent?.country} flag`} 
                                      />
                                  </div>  
                              }
                          </div>
                          <div className={style.result}>
                            <div className={style.valors}>
                                <p>
                                    {
                                      p?.player?.color === 'white' ? 
                                      p?.player?.estado === 'won' ? '1' : 
                                      p?.player?.estado === 'lost' ? '0' : '1/2' :
                                      p?.nameOpponent?.estado === 'won' ? '1' :
                                      p?.nameOpponent?.estado === 'lost' ? '0' : '1/2'
                                    }
                                </p>
                                <p>
                                  {
                                      p?.player?.color === 'black' ? 
                                      p?.player?.estado === 'won' ? '1' : 
                                      p?.player?.estado === 'lost' ? '0' : '1/2' :
                                      p?.nameOpponent?.estado === 'won' ? '1' :
                                      p?.nameOpponent?.estado === 'lost' ? '0' : '1/2'
                                  }
                                </p>
                            </div>
                            <div className={style.estado}>
                              {
                                p?.player?.estado === 'won' ? <WonSvg/> :
                                p?.player?.estado === 'lost' ? <LostSvg/> : <TiedSvg/>
                              } 
                            </div>
                          </div>                          
                      </div>
                    </div>
                  </>))
                }
              </div>
          </div>
        </div>
      </div>
     }
     </div>
      { showModalMin &&
        <JoinRoom setShowModalMin={setShowModalMin}/>
      } 
    </div>
  );
}
