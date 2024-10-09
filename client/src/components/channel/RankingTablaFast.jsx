import React, { useEffect, useRef, useState } from 'react';
import style from './RankingTablaFast.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useLanguagesContext } from '../../context/languagesContext';
import Insignias from '../insignias/Insignias';
import Fast from '../../img/fast';
import { useAuth } from '../../context/authContext';
import { Spinner } from 'react-bootstrap';

export const RankingTable = () => {
  const  {auth} = useAuth();
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
      const response = await getRequest(`${baseUrl}/users/rating-fast`);
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
          const response = await getRequest(`${baseUrl}/users/${auth.user._id}/elo`);
        
           if(response.error){
              return console.log('Error fetching users', response);
           }
            setElo( response.eloFast)
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
    <div className={style.tercerdiv}>
       <div className={style.title}>            
            <div className={style.icon}>
              <Fast />
            </div>
            <h4>{`${language.rating} ${language.fast}`}</h4>
       </div> 
        <li className={style.item}>
          <span>{language.Range?.toUpperCase()}</span>
          <div className={style.friendName}>
            <span >{language.name?.toUpperCase()}</span>
          </div>
          <span >{language.Score?.toUpperCase()}</span>
        </li>   
        <div className={style.itemContainer}>      
        {
        users.length !== 0 ?  
        users.map((o, index) => {
          if (o._id === auth.user._id) {
            userPosition = count;
          }
          return(
          <>
               <li 
                ref={o._id === auth.user._id ? userPositionRef : null}
                key={index} 
                className={o._id === auth.user._id ? ` ${style.frienditem} ${style.viewport}` : `${style.frienditem}`}                           
                onClick={() => handleModalOpen(o?._id)}
                title={o?.username}
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
                        <span>
                           {o?.username.length > 8 
                              ? o?.username.substring(0, 8) + '...' 
                              : o?.username}
                        </span>
                        <div className={style.containerInsignias}>
                          <img src={o?.imagenBandera} className={style.bandera} alt="" />
                          <div className={style.insignia}>
                            <Insignias o={o} time={'fast'}/>
                          </div>
                        </div>
                      </div>
                    </div>
                   </Col>
                </Row>
                <div className={style.friendRank}>
                  <div className={style.icon}>
                    <Fast />
                  </div>
                  <span className={style.puntuacion}>
                    {o?.eloFast}
                  </span>
                </div>
              </li>
          </>
        )}) : 
          <div style={{marginTop: '30%'}}>
            <SpinnerDowloand text={'Cargando rating....'}/>
          </div>
        }
      </div>
      {!isVisible && <li  
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
                    <Fast/>
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
            nivel={'fast'}
            handleModalClose={handleModalClose}
            racha={user.rachaFast}
            photo={photo}
            elo={user.eloFast}
            games={user.gamesFast}
            gamesWon={user.gamesWonFast}
            gamesTied={user.gamesTiedFast}
            gamesLost={user.gamesLostFast}
          /> 
      }                   
    </div>
  );
};


