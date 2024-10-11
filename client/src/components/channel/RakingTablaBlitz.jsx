import React, { useEffect, useRef, useState } from 'react';
import style from './RankingTablaBlitz.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useLanguagesContext } from '../../context/languagesContext';
import Insignias from '../insignias/Insignias';
import { useAuth } from '../../context/authContext';
import { Spinner } from 'react-bootstrap';

export const RankingTableBlitz = () => {
  const {auth} = useAuth();
  const [elo, setElo] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState('');

  const {language} = useLanguagesContext();

  const [isVisible, setIsVisible] = useState(true);
  const userPositionRef = useRef(null); // Create a ref to track the user position
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Cambia el estado según la visibilidad
      setIsVisible(entry.isIntersecting);
  });

  if (userPositionRef.current) {
      observer.observe(userPositionRef.current); // Observa el elemento
  }
  // Limpieza al desmontar
  return () => {
      if (userPositionRef.current) {
          observer.unobserve(userPositionRef.current); // Deja de observar al desmontar
      }
  };
  }, [users]);

  useEffect(() => {
    const allUsers = async() => {
        const response = await getRequest(`${baseUrl}/users/rating-blitz`);
          if(response.error){
             return console.log('Error fetching users', response);
          }

          setUsers(response);
    }

    allUsers();
  },[]);

  useEffect(() => {
    const getUsersElo = async() =>{
       
        if(auth?.user){
          const response = await getRequest(`${baseUrl}/users/${auth?.user?._id}/elo`);
        
           if(response.error){
              return console.log('Error fetching users', response);
           }
            setElo( response.eloBlitz)
        }
     }
  
    getUsersElo();
  },[auth]);

  const handleModalOpen = async(userId) => {
    const response = await getRequest(`${baseUrl}/user/${userId}`);
    if(response.error){
       return console.log('Error fetching users', response);
    }

    setUser(response);
    setPhoto(userId);
    setShowModal(true);
  }

  const handleModalClose = () => {
    setShowModal(false)
  }


   let count = 1; 
   let userPosition = null;
  return (
    <div className={style.tercerdiv} >
       <div className={style.title}>            
            <div className={style.icon}>
              <svg style={{ color: '#FFEB3B'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
              </svg>
            </div>
            <h4>{`${language.rating} Blitz`}</h4>
       </div>     
        <li className={style.item}>
          <span>{language.Range?.toUpperCase()}</span>
          <div className={style.friendName}>
            <span >{language.name?.toUpperCase()}</span>
          </div>
          <span >{language.Score?.toUpperCase()}</span>
        </li>
      <div className={style.itemContainer}>
        {users.length === 0 ? 
          <div style={{marginTop: '30%'}}>
            <SpinnerDowloand text={'Cargando rating....'}/>
          </div>
        :
       users?.map((o, index) => {
        if (auth?.user && o._id === auth.user._id) {
          userPosition = count;
        }
        return(
          <>
               <li 
                ref={auth?.user && o._id === auth.user._id  ? userPositionRef : null}
                key={index} 
                className={auth?.user && o._id === auth.user._id ? ` ${style.frienditem} ${style.viewport}` : `${style.frienditem}`}              
             
                // onMouseEnter={() => setHoveredFriend(o._id)}
                // onMouseLeave={() => setHoveredFriend(null)}
                title={o?.username}
                onClick={() => handleModalOpen(o?._id)}
              > 
                <Row>
                    <Col>
                      <span className={style.rango}>
                        {count++}.
                        {
                          count === 2 ?  <img className={style.medallaIcon} src='fondos/firts.png' alt='assets/avatar/user.png' /> :
                          count === 3 ? <img className={style.medallaIcon} src='fondos/second.png' alt='assets/avatar/user.png' /> : 
                          count === 4 ? <img className={style.medallaIcon} src='fondos/three.png' alt='assets/avatar/user.png' /> : ''
                        }   
                      </span>
                    </Col>
                    <Col>
                      <div className={style.name}>
                        <div className={style.imageContainer}>
                          <img className={style.photo} src={o?.photo} alt="User Photo" />
                          <img className={style.marco} src={o?.marco} alt="Marco" />
                        </div>                  
                        <div className={style.column}>
                          <span>{o?.username.length > 8 ? o?.username.substring(0, 8) + '...' : o?.username}</span>
                          <div className={style.containerInsignias}>
                            <img src={o?.imagenBandera} className={style.bandera} alt="" />
                            <div className={style.insignia}>
                              <Insignias o={o} time={'blitz'}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                </Row>
                <div className={style.friendRank}>
                    <div className={style.icon}>
                      <svg style={{ color: '#FFEB3B' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                      </svg>
                    </div>
                    <span className={style.puntuacion}>
                       {o?.eloBlitz}
                    </span>
                </div>
              </li>
          </>
        )})
        }
      </div>
     {!isVisible && auth?.user &&<li  
                className={`${style.itemUser}`}              
                title={auth?.user?.username}
                onClick={() => handleModalOpen(auth?.user?._id)}
              > 
                <Row>
                    <Col>
                      <span className={style.rango}>
                        {userPosition}.
                        {
                          userPosition === 1 ?  <img className={style.medallaIcon} src='fondos/firts.png' alt='assets/avatar/user.png' /> :
                          userPosition === 2 ? <img className={style.medallaIcon} src='fondos/second.png' alt='assets/avatar/user.png' /> : 
                          userPosition === 3 ? <img className={style.medallaIcon} src='fondos/three.png' alt='assets/avatar/user.png' /> : ''
                        }    
                      </span>
                    </Col>
                    <Col>
                      <div className={style.name}>
                        <div className={style.imageContainer}>
                          <img className={style.photo} src={auth?.user?.photo} alt="User Photo" />
                          <img className={style.marco} src={auth?.user?.marco} alt="Marco" />
                        </div>                  
                        <div className={style.column}>
                          <span>{auth?.user?.username.length > 8 ? auth?.user?.username.substring(0, 8) + '...' : auth?.user?.username}</span>
                          <div className={style.containerInsignias}>
                            <img src={auth?.user?.imagenBandera} className={style.bandera} alt="" />
                            <div className={style.insignia}>
                              <Insignias o={auth?.user} time={'blitz'}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                </Row>
                <div className={style.friendRank}>
                    <div className={style.icon}>
                      <svg style={{ color: '#FFEB3B' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                      </svg>
                    </div>
                    <span className={style.puntuacion}>
                      {elo ? elo : <Spinner animation="grow" /> }
                    </span>
                </div>
      </li>}
      { 
        showModal && 
          <ModalProfile 
            user={user}
            nivel={'blitz'}
            handleModalClose={handleModalClose}
            racha={user.rachaBlitz}
            photo={photo}
            elo={user.eloBlitz}
            games={user.gamesBlitz}
            gamesWon={user.gamesWonBlitz}
            gamesTied={user.gamesTiedBlitz}
            gamesLost={user.gamesLostBlitz}
          /> 
      }
    </div>
  );
};


