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
import { AvanzadoInsignia, ExpertoInsignia, GranMaestroInsignia, IntermedioInsignia, MaestroIngsinia, NovatoInsignia, PrincipianteInsignia } from '../img';
import PieChart from '../components/piechart/PieChart';
import SpinnerDowloand from '../components/spinner/SpinnerDowloand';
import TiedSvg from '../svg/tiedSvg';

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
  const navigate = useNavigate();
  const {auth} = useAuth();
  const {socket, setInfUser} = useSocketContext();
  const {setCheckMate} = useCheckMateContext();
  const [paginate, setPaginate] = useState(1);
  const [autoPaginate, setAutoPaginate] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 400);
  const [partida, setPartidas] = useState([]);
  const [user, setUser] = useState(null);
  console.log('user',user)
  const [stast, setStats] = useState('fast');

   useEffect(() => {
      const allPartidas = async() => {
        const response = await getRequest(`${baseUrl}/partida/user/historial/${auth.user._id}`);
        if(response.error){
          return console.log('Error fetching historial partidas', response);
        }

        console.log('partidas', response.partida)
        setPartidas(response.partida);
      }
      allPartidas()
   },[]);

  useEffect(()=>{
    const User = async() => {
      const response = await getRequest(`${baseUrl}/user/${auth.user._id}`);
      if(response.error){
         return console.log('Error fetching users', response);
      }
       setUser(response);
    }   
    
    User();
  },[]);
  
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
  
  const createRoom = (userId, time) => {
    if(socket === null) return;
    if (auth?.user) {  
      setCheckMate(prevCheckMate => ({
        ...prevCheckMate,
        userId: '',
        time: '',
        game: '',
        elo: 0
      })); 
      setInfUser((prevInfUser) => ({
        ...prevInfUser,
        time: parseInt(time)
      }));
      localStorage.setItem('time', time);
       socket.emit('userTime', {userId, time});
       socket.emit('join-room', time);
      navigate('/auth/channel');
    }else{
      navigate('/login');
    }
  };

  
    useInterval(() => {
      if (autoPaginate) {
        if (paginate === 1) {
          setPaginate(3);
        } else {
          setPaginate(p => p - 1);
        }
      }
    }, 30000);
 
  
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

  const handleModalClose = () => {
    setShowModalMin(false);
  }

  const handleClick = (data) => {
     setStats(data);
  }

  return (
    <div className={style.container} style={auth?.user ? {background: chessColor.fondo, paddingBottom: '4rem'}: {background: chessColor.fondo, height: '100vh'}}>
      <div className={style.image}>
        <div className={style.home}>
          <div className={style.homestyle}>
            <h1 className={style.titulo} style={{color: chessColor.titulo}}>
              Bienvenido a <br/>
              ChessKNIGTH
            </h1>
            <p style={{color: chessColor.color}}>
              Juega ajedrez online y mejora tus habilidades!
            </p>
            <button 
              className={style.playButton} 
              style={{background: chessColor.navbar, boxShadow: chessColor.boxShadow}} 
              onClick={joinRoom}>
               Unirse a una sala
            </button>
          </div> 
          <div className={style.table}>
             <div className={style.chevron} onClick={() => handleFormer()}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{color: '#2196F3', width: '40', height: '40'}}  fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
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
                <svg xmlns="http://www.w3.org/2000/svg" style={{color: '#2196F3', width: '40', height: '40'}} fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
             </div>
          </div>  
                
        </div>
      </div>
     {
      auth?.user  && 
      <div className={style.fondoDatos}>
        <div className={style.containerStats}>
          <h5 style={{color: chessColor.titulo}}>Estadisticas de {auth?.user?.name ? 
                                    `${auth.user.name} ${auth.user.lastName}`: 
                                    `${auth?.user?.username}`}
          </h5>
            
        </div>
        <div  className={style.containerStats}>
              <button 
                className={style.buttonStats} 
                style={stast === 'fast' ?{background: chessColor.navbar, opacity: '80%', border: `2px solid #239B56`} : {background: chessColor.navbar}}
                onClick={()=> handleClick('fast')}
              >
                  Fast <FastSvg/>
              </button>
              <button 
                  className={style.buttonStats} 
                  style={stast === 'blitz' ?{background: chessColor.navbar, opacity: '80%', border: `2px solid #F7DC6F `} : {background: chessColor.navbar}}
                  onClick={()=> handleClick('blitz')}
              >
                    Blitz <BlitzSvg/>
              </button>
              <button 
                className={style.buttonStats} 
                style={stast === 'bullet' ?{background: chessColor.navbar, opacity: '80%', border: `2px solid #F39C12 `} : {background: chessColor.navbar}}
                onClick={()=> handleClick('bullet')}
              >
                Bullet <BulletSvg/>
              </button>
        </div>
        <div className={style.containerStatsRating}>
         
            <div className={style.containerNivel} style={stast === 'fast' ? {border: '2px solid #229954'} : stast === 'blitz' ? {border: '2px solid #F4D03F'} : {border: '2px solid #F39C12 '}}>
            {!user?
          
            <SpinnerDowloand text={`Cargando estadisticas del usuario ${auth?.user?.name}. . .`} />
            :
            <>
            <div className={style.svg}>
                {stast === 'fast' ? 
                  <svg style={{ color: '#80de83' }} xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                  </svg> :
                stast === 'blitz' ?
                <svg style={{ color: '#FFEB3B' }} xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                </svg> :
                  <svg style={{ color: '#F9A825' }} xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                  <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                      <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
                  </svg>
              }
            </div>
            <div className={style.rating}>
                <div className={style.insignia}>
                  {   stast === 'fast' ?
                      user?.eloFast < 21 ? <PrincipianteInsignia /> : 
                      user?.eloFast >= 21  && user?.eloFast <= 61 ? <NovatoInsignia /> : 
                      user?.eloFast >= 62  && user?.eloFast <= 100 ? <IntermedioInsignia /> : 
                      user?.eloFast >= 101 && user?.eloFast <= 230 ? <AvanzadoInsignia /> :
                      user?.eloFast >= 231 && user?.eloFast <= 390 ? <ExpertoInsignia /> :
                      user?.eloFast >= 391 && user?.eloFast <= 549 ? <MaestroIngsinia /> : 
                      <GranMaestroInsignia/> : stast === 'blitz' ? 
                      user?.eloBlitz < 21 ? <PrincipianteInsignia /> : 
                      user?.eloBlitz >= 21  && user?.eloBlitz <= 61 ? <NovatoInsignia /> : 
                      user?.eloBlitz >= 62  && user?.eloBlitz <= 100 ? <IntermedioInsignia /> : 
                      user?.eloBlitz >= 101 && user?.eloBlitz <= 230 ? <AvanzadoInsignia /> :
                      user?.eloBlitz >= 231 && user?.eloBlitz <= 390 ? <ExpertoInsignia /> :
                      user?.eloBlitz >= 391 && user?.eloBlitz <= 549 ? <MaestroIngsinia /> : 
                      <GranMaestroInsignia/> : 
                      user?.eloBullet < 21 ? <PrincipianteInsignia /> : 
                      user?.eloBullet >= 21  && user?.eloBullet <= 61 ? <NovatoInsignia /> : 
                      user?.eloBullet >= 62  && user?.eloBullet <= 100 ? <IntermedioInsignia /> : 
                      user?.eloBullet >= 101 && user?.eloBullet <= 230 ? <AvanzadoInsignia /> :
                      user?.eloBullet >= 231 && user?.eloBullet <= 390 ? <ExpertoInsignia /> :
                      user?.eloBullet >= 391 && user?.eloBullet <= 549 ? <MaestroIngsinia /> : 
                      <GranMaestroInsignia/> 
                    }
                  <p style={{color: chessColor.titulo}}>{ stast === 'fast' ? user.eloFast :
                                                          stast === 'blitz' ? user.eloBlitz : user.eloBullet}</p>
                </div>
                <span style={{color: chessColor.color}}>Rating</span>
            </div>
            <div className={style.containerDatos}>
              <div className={style.span}>
                  <div>
                    <span style={{color: chessColor.color}}>Total juegos: </span> 
                    <span style={{color: chessColor.titulo}}>
                      {stast === 'fast' ? user?.gamesFast : stast === 'blitz' ? user.gamesBlitz : user.gamesBullet}
                    </span>
                  </div> 
                  <div>
                      <span style={{color: chessColor.color}}>Gananas: </span>
                      <span style={{color: chessColor.titulo}}>
                        {stast === 'fast' ? user?.gamesWonFast : stast === 'blitz' ? user.gamesWonBlitz : user.gamesWonBullet}
                      </span>
                  </div>
                  <div>
                    <span style={{color: chessColor.color}}>Perdidas: </span>
                    <span style={{color: chessColor.titulo}}>
                      {stast === 'fast' ? user?.gamesLostFast : stast === 'blitz' ? user?.gamesLostBlitz : user?.gamesLostBullet}
                    </span>
                  </div>
                  
              </div>
              <div className={style.span}>
                  <div>
                    <span style={{color: chessColor.color}}>Empate: </span>
                    <span style={{color: chessColor.titulo}}>
                      {stast === 'fast' ? user?.gamesTiedFast : stast === 'blitz' ? user.gamesTiedBlitz : user.gamesTiedBullet}
                    </span>
                  </div>
                  <div>
                    <span style={{color: chessColor.color}}>Racha Actual: </span>
                    <span style={{color: chessColor.titulo}}>
                      {stast === 'fast' ?  user?.rachaFast : stast === 'blitz' ? user?.rachaBlitz : user?.rachaBullet}
                    </span>
                  </div>
              </div>
            </div>
            <div>
            <div className={style.chartContainer} style={{color: chessColor.titulo}}>
              <PieChart data={stast} user={user}/>
            </div>
            </div>
            </> 
         
         }
         </div>
        </div>
        <div>
          <h5 style={{color: chessColor.titulo}}>Historial de partida</h5>
          <div className={style.scrollableContainer}>
              <h6> Partidas totales ({user?.games})</h6>
              <span>Ultimas partidas de {user?.username}</span>
              <div className={style.scrollableContent}>
              {partida?.slice(0, 15).reverse().map((p, index)=> (
              <>
                <div key={index}>
                   <div className={style.containerpartida}>
                      <div className={style.gameType}>
                         <div>
                         {p.gameType === 'bullet' ? 
                            <BulletSvg /> :
                          p.gameType === 'blitz' ? 
                            <BlitzSvg /> :
                            <FastSvg />
                          }
                         </div>
                          <span>
                            {p.gameType === 'bullet' ? 'Bullet' : 
                             p.gameType === 'blitz' ? 'Blizt' : 'Fast'}
                          </span>
                      </div>
                      <div>
                         {
                          p.player.color === 'white' ?
                             <div className={style.datos}> 
                               <p> {p.player.name}({p.player.elo})</p>
                               <img  src={p.player.bandera} alt={`${p.player.country} flag`} />  
                             </div>
                                 :
                            <div className={style.datos}>
                                <p> {p.nameOpponent.name}({p.nameOpponent.elo})</p>
                                <img  src={p.nameOpponent.bandera} alt={`${p.nameOpponent.country} flag`} />
                            </div>                        
                         }
                         {
                           p.player.color === 'black' ?
                           <div className={style.datos}> 
                             <p> {p.player.name}({p.player.elo})</p>
                             <img  src={p.player.bandera} alt={`${p.player.country} flag`} />  
                           </div>
                               :
                          <div className={style.datos}>
                              <p> {p.nameOpponent.name}({p.nameOpponent.elo})</p>
                              <img  src={p.nameOpponent.bandera} alt={`${p.nameOpponent.country} flag`} />
                          </div>  
                         }
                      </div>
                      <div className={style.result}>
                        <div className={style.valors}>
                            <p>{p.player.color === 'white' ? 
                                  p.player.estado === 'won' ? '1' : 
                                  p.player.estado === 'lost' ? '0' : '1/2' :
                                  p.nameOpponent.estado === 'won' ? '1' :
                                  p.nameOpponent.estado === 'lost' ? '0' : '1/2'
                               }
                            </p>
                            <p>{p.player.color === 'black' ? 
                                  p.player.estado === 'won' ? '1' : 
                                  p.player.estado === 'lost' ? '0' : '1/2' :
                                  p.nameOpponent.estado === 'won' ? '1' :
                                  p.nameOpponent.estado === 'lost' ? '0' : '1/2'
                               }
                            </p>
                        </div>
                        <div className={style.estado}>
                           {
                            p.player.estado === 'won' ? <WonSvg/> :
                            p.player.estado === 'lost' ? <LostSvg/> : <TiedSvg/>
                            }
                        </div>
                      </div>
                      
                   </div>
                </div>
              </>))}
              </div>
          </div>
        </div>
      </div>
     }
      { showModalMin &&
        <div className={style.overlay}>
          <div className={style.gameOverModal}>
              <div className={style.header}>
                <a  className={style.close} onClick={() => handleModalClose()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16" >
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
                <button onClick={() => createRoom(auth?.user?._id,  60)}>1 min</button>
                <button onClick={() => createRoom(auth?.user?._id, 120)}>2 min</button>
              </div>
                <svg style={{ color: '#FFEB3B', marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                </svg>
                <span style={{ color: '#1A237E ', fontWeight: 'bold' }}> 
                  Blitz
                </span>       
                <div className={style.buttons}>          
                  <button onClick={() => createRoom(auth?.user?._id, 180)}>3 min</button>
                  <button onClick={() => createRoom(auth?.user?._id, 300)}>5 min</button>
                </div>
                <svg style={{ color: '#4CAF50', marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                </svg>
              <span style={{ color: '#1A237E ', fontWeight: 'bold' }}> 
                  Rapid
              </span>
              <div className={style.buttons}>
                <button onClick={() => createRoom(auth?.user?._id,  600)}>10 min</button>
                <button onClick={() => createRoom(auth?.user?._id,  1200)}>20 min</button>
              </div>
             </div>
          </div>
        </div>
        } 
    </div>
  );
}