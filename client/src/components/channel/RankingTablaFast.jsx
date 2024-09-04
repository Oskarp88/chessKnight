import React, { useEffect, useState } from 'react';
import style from './RankingTablaFast.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


export const RankingTable = () => {
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

  const sortedUsers = users.slice().sort((a, b) => b.eloFast - a.eloFast);

   let count = 1; 
  return (
    <div className={style.tercerdiv} /*style={{border: '2px solid #229954'}}*/>
       <div className={style.title}>            
            <svg style={{ color: '#50c256', marginRight: '10px', marginTop: '7px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
            </svg>
            <h4>Ranking Fast</h4>
       </div>
          <li className={style.item}>
            <span>{"RANGO"}</span>
            <div className={style.friendName}>
              <span >{'NOMBRE'}</span>
            </div>
            <span>{'PUNTUACIÓN'}</span>
          </li>
      <div className={style.itemContainer}>
          
        {sortedUsers.length !== 0 ?  sortedUsers.map((o, index) => (
          <>
               <li 
                key={index} 
                className={`${style.frienditem}`}              
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
                      <img className={style.userIcon} src={o?.photo} alt='' />                  
                      <div className={style.column}>
                        <span>{o?.username.substring(0, 8) > 8 ? o?.username.substring(0, 8)+'...' :  o?.username }</span>
                        <img src={o?.imagenBandera} className={style.bandera} alt="" />
                      </div>
                    </div>
                   </Col>
                </Row>
                <div className={style.friendRank}>
                  <div>
                    <svg style={{ color: '#1cec23', marginRight: '10px', marginTop: '-5px' }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                    </svg> 
                  </div>
                  <span className={style.puntuacion}>
                    {o?.eloFast}
                  </span>
                </div>
              </li>
          </>
        )) : 
          <div style={{marginTop: '30%'}}>
            <SpinnerDowloand text={'Cargando rating....'}/>
          </div>
        }
      </div>
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


