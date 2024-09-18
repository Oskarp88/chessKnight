import React, { useEffect, useState } from 'react';
import style from './RankingTablaFast.module.css';
import { baseUrl, getRequest } from '../../utils/services';
import ModalProfile from './ModalProfile';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useLanguagesContext } from '../../context/languagesContext';
import Insignias from '../insignias/Insignias';
import Fast from '../../img/fast';


export const RankingTable = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState('');

  const {language} = useLanguagesContext();
  
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

  // const sortedUsers = users.slice().sort((a, b) => b.eloFast - a.eloFast);

   let count = 1; 
  return (
    <div className={style.tercerdiv} /*style={{border: '2px solid #229954'}}*/>
       <div className={style.title}>            
            <div className={style.icon}>
              <Fast />
            </div>
            <h4>{`${language.rating} ${language.fast}`}</h4>
       </div>
          
      <div className={style.itemContainer}>
        <li className={style.item}>
          <span>{language.Range?.toUpperCase()}</span>
          <div className={style.friendName}>
            <span >{language.name?.toUpperCase()}</span>
          </div>
          <span >{language.Score?.toUpperCase()}</span>
        </li>
          
        {users.length !== 0 ?  users.map((o, index) => (
          <>
               <li 
                key={index} 
                className={`${style.frienditem}`}              
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
                        <span>{o?.username.length > 8 ? o?.username.substring(0, 8) + '...' : o?.username}</span>
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


