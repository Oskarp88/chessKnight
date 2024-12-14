import React, { useContext } from 'react';
import style from './ListPlayers.module.css';
import Insignias from '../../../insignias/Insignias';
import { BlitzSvg, BulletSvg } from '../../../../svg';
import Fast from '../../../../img/fast';
import { GameContext } from '../../../../context/gameContext';
import { useAuth } from '../../../../context/authContext';

export default function ListPlayers({
    handleModalOpen,
    setHoveredFriend,
    hoveredFriend,
    user
}) {

    const {infUser} = useContext(GameContext);
    const {auth} = useAuth();
    let count = 1;
  return (
    <li               
        className={`${style.frienditem} ${hoveredFriend === user._id ? `${style.frienditem} ${style.frienditemHovered}` : ''}`}              
        style={user._id === auth?.user?._id ? {background: 'linear-gradient(to top, #4e8381  0%, #73c2c0 100%)'} : {}}
        onMouseEnter={() => setHoveredFriend(user._id)}
        onMouseLeave={() => setHoveredFriend(null)}
        onClick={() => handleModalOpen(user)}
    >                
        <div className={style.containerProfile}>
            <span style={{marginRight: '7px', color: '#fff'}}>{count++}.</span>
            <div className={style.imageContainer} >
                <img className={style.photoImage} src={user?.photo} alt="User Photo" />                  
                <img className={style.marco} src={user?.marco} alt="Marco"/>
            </div> 
            <div className={style.friendName}>
                    <span  >
                    {user?.username.substring(0, 8) > 8 ? user?.username.substring(0, 8)+'...' :  user?.username }
                    </span>
                    <img src={user?.imagenBandera} title={user?.country} className={style.bandera} alt="" />
            </div>
        </div>
        <div className={style.containerFlex}>
            <div className={style.imageInsignia}>
               <Insignias o={user} time={infUser?.time}/>
            </div>            
            <div className={style.containerRanking}>
                <div style={{marginTop: '-2px'}} >
                {infUser?.time === 60 || infUser?.time === 120 
                    ?  <BulletSvg/> : infUser?.time === 180 || infUser?.time === 300 
                    ?  <BlitzSvg /> : 
                        <div style={{width: '25px', height: '25px'}}>
                          <Fast/>
                        </div>
                }
                </div>
                <div className={style.friendRank}>
                    <span >{infUser?.time === 60 || infUser?.time === 120 ? user?.eloBullet : 
                        infUser?.time === 180 || infUser?.time === 300 ? user?.eloBlitz : user?.eloFast}
                    </span>
                </div>
            </div>
        </div>              
    </li>
  )
}
