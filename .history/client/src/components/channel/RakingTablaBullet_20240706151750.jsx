import React, { useEffect, useState } from 'react';
import style from './RankingTabla.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';

export const RankingTableBullet = () => {
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

  const sortedUsers = users.slice().sort((a, b) => b.eloBullet - a.eloBullet );

   let count = 1; 
  return (
    <div className={style.tercerdiv} style={{border: '1px solid #F9A825'}}>
       <div className={style.title}>            
            <svg style={{ color: '#F9A825', marginRight: '10px', marginTop: '7px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
            </svg>
            <h4>Ranking Bullet</h4>
       </div>
      <ul>
          <li 
                className={style.item} 
              >
                <span>{"#"}</span>
                <div>
                  <span className={style.friendName}>{'Nombre'}</span>
                </div>
                <span className={style.friendRank}>{'ranking'}</span>
              </li>
        {sortedUsers?.map((o, index) => (
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
                  <span className={style.friendName}>{o?.username}</span>
                </div>
                <span className={style.friendRank}>
                <svg style={{ color: '#F9A825', marginRight: '10px', marginTop: '-4px' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                    <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                        <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
                    </svg>
                    {o?.eloBullet}</span>
              </li>
          </>
        ))}
      </ul>
      { 
        showModal && 
          <ModalProfile 
            user={user}
            nivel={'bullet'}
            handleModalClose={handleModalClose}
            racha={user.rachaBullet}
            photo={photo}
            elo={user.eloBullet}
            games={user.gamesBullet}
            gamesWon={user.gamesWonBullet}
            gamesTied={user.gamesTiedBullet}
            gamesLost={user.gamesLostBullet}
          /> 
      } 
    </div>
  );
};


