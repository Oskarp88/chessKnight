import React, { useEffect, useState } from 'react';
import style from './RankingTabla.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import SpinnerDowloand from '../spinner/SpinnerDowloand';

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
    <div className={style.tercerdiv} style={{border: '1px solid #FFEB3B'}}>
       <div className={style.title}>            
            <svg style={{ color: '#FFEB3B',marginRight: '10px', marginTop: '7px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
            </svg>
            <h4>Ranking Blitz</h4>
       </div>
      <div className={style.itemContainer}>
          <li 
                className={style.item} 
              >
                <span>{"#"}</span>
                <div>
                  <span className={style.friendName}>{'Nombre'}</span>
                </div>
                <span className={style.friendRank}>{'ranking'}</span>
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
                onClick={() => handleModalOpen(o?._id)}
              > 
                <span>
                  {count++}.
                  {
                    count === 2 ?  <img className={style.medallaIcon} src='fondos/firts.png' alt='assets/avatar/user.png' /> :
                    count === 3 ? <img className={style.medallaIcon} src='fondos/second.png' alt='assets/avatar/user.png' /> : 
                    count === 4 ? <img className={style.medallaIcon} src='fondos/three.png' alt='assets/avatar/user.png' /> : ''
                  }    
                </span>
                <div className={style.name} style={count === 2 || count === 3 || count === 4 ? {marginRight: '15px'} : {}}>
                  <img className={style.userIcon} src={o?.photo} alt='assets/avatar/user.png' />                  
                  <div>
                     <span className={style.friendName}>{o?.username}</span>
                     <img src={o?.imagenBandera} className={style.bandera} alt="" />
                  </div>
                </div>
                <span className={style.friendRank}>
                    <svg style={{ color: '#FFEB3B',marginRight: '10px', marginTop: '-4px' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                    </svg>
                    {o?.eloBlitz}</span>
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


