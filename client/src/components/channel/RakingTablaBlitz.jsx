import React, { useEffect, useState } from 'react';
import style from './RankingTablaBlitz.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useLanguagesContext } from '../../context/languagesContext';
import Insignias from '../insignias/Insignias';


export const RankingTableBlitz = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState('');

  const {language} = useLanguagesContext();

  useEffect(() => {
    const allUsers = async() => {
        const response = await getRequest(`${baseUrl}/users`);
          if(response.error){
             return console.log('Error fetching users', response);
          }

          setUsers(response);
    }

    allUsers();
  },[]);

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

  const sortedUsers = users.slice().sort((a, b) => b.eloBlitz - a.eloBlitz);

   let count = 1; 
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
      
      <div className={style.itemContainer}>
        <li className={style.item}>
          <span>{language.Range?.toUpperCase()}</span>
          <div className={style.friendName}>
            <span >{language.name?.toUpperCase()}</span>
          </div>
          <span >{language.Score?.toUpperCase()}</span>
        </li>
        {sortedUsers.length === 0 ? 
          <div style={{marginTop: '30%'}}>
            <SpinnerDowloand text={'Cargando rating....'}/>
          </div>
        :
        sortedUsers?.map((o, index) => (
          <>
               <li 
                key={index} 
                className={`${style.frienditem}`}              
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
        ))
        }
      </div>
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


