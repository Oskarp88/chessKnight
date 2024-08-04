import React, { useEffect, useState } from 'react';
import style from './RankingTabla.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import Spinner from '../spinner/spinner';


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
    <div className={style.tercerdiv} style={{border: '1px solid #229954'}}>
       <div className={style.title}>            
            <svg style={{ color: '#50c256', marginRight: '10px', marginTop: '7px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
            </svg>
            <h4>Ranking Fast</h4>
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
        {sortedUsers ?  sortedUsers?.map((o, index) => (
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
                  <img className={style.userIcon} src={o?.photo} alt='' />                  
                  <span className={style.friendName}>{o?.username}</span>
                </div>
                <span className={style.friendRank}>
                <svg style={{ color: '#1cec23', marginRight: '10px', marginTop: '-5px' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
            </svg> 
                    {o?.eloFast}</span>
              </li>
          </>
        )) : 
          <Spinner text={'Cargando rating....'}/>
        }
      </ul>
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


