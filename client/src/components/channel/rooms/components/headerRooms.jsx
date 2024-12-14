import React, { useContext, useState } from 'react';
import style from './HeaderRooms.module.css';
import { BlitzSvg, BulletSvg } from '../../../../svg';
import Fast from '../../../../img/fast';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { GameContext } from '../../../../context/gameContext';
import { Nav } from 'react-bootstrap';
import { useLanguagesContext } from '../../../../context/languagesContext';

export default function HeaderRooms({handleSignOut,setShowSettings}) {
    const {infUser} = useContext(GameContext);
    const {language} = useLanguagesContext();
    const [showModalSign, setShowModalSign] = useState(false);
  return (
    <div className={style.desafio}>
        <div className={style.SignOut} onMouseLeave={()=>setShowModalSign(false)}>
        <FaSignOutAlt 
            className={style.FaSignOutAlt}
            onMouseEnter={()=>setShowModalSign(true)}               
        />
        {showModalSign && 
            <div className={style.dropdown}>
            <p onClick={()=>handleSignOut()}>Cambiar de sala</p>
            <p><Nav.Link href="/">Salir</Nav.Link></p>
            </div>
        }
        </div>
        <div className={style.titleWithIcon}>          
            <img 
                src={'/icon/userswhite.png'} 
                alt="" 
            />
            <h5>
                {language.Challenge_a_match} {infUser?.time === 60 
                ? '1' : infUser?.time === 120 
                ? '2' : infUser?.time === 180 
                ? '3' : infUser.time === 300 
                ? '5' : infUser?.time === 600 
                ? '10' : '20'
                } mn
            </h5>
            {infUser?.time === 60  || infUser?.time === 120 
                ? <BulletSvg/> 
                : infUser?.time === 180 || infUser.time === 300 
                ? <BlitzSvg/> 
                : <div className={style.fastContainer}>
                    <div className={style.fast} >
                    <Fast/>
                    </div>
                </div>
            }
        </div>
        <div 
            className={style.setting} 
            title={language.settings}
            onClick={()=>setShowSettings(true)}
        >
            <FaCog className={style.FaCog} />
        </div>
    </div> 
  )
}
