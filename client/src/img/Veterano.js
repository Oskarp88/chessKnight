import React from 'react';
import style from'../components/channel/rooms/Friends.module.css';
function Veterano() {
  return (
    <img className={style.insignia} 
        src={`/insignias/Veterano.png`} 
        alt='assets/avatar/user.png' 
        title="Veterano"
    />
  )
}

export default Veterano;