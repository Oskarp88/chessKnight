import React, { useEffect, useState } from 'react';
import style from './RankingTabla.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


export const RankingTableBlitz = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState('');

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
    <div className={style.tercerdiv} style={{border: '2px solid #FFEB3B'}}>
       <div className={style.title}>            
            <svg style={{ color: '#FFEB3B',marginRight: '10px', marginTop: '7px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
            </svg>
            <h4>Ranking Blitz</h4>
       </div>
       <li className={style.item}>
          <span>{"RANGO"}</span>
          <div className={style.friendName}>
            <span >{'NOMBRE'}</span>
          </div>
          <span >{'PUNTUACION'}</span>
        </li>
      <div className={style.itemContainer}>
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
                        <img className={style.userIcon} src={o?.photo} alt='assets/avatar/user.png' />                  
                        <div className={style.column}>
                          <span>{o?.username}</span>
                          <img src={o?.imagenBandera} className={style.bandera} alt="" />
                        </div>
                      </div>
                    </Col>
                </Row>
                <div className={style.friendRank}>
                    <div>
                      <svg style={{ color: '#FFEB3B',marginRight: '10px', marginTop: '-4px' }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
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


