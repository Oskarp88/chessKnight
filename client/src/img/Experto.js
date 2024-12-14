import React from 'react';
import style from'../components/channel/rooms/Friends.module.css';
function Experto() {
  return (
    <img className={style.insignia} 
        src={`/insignias/Experto.png`} 
        alt='assets/avatar/user.png' 
        title="Experto"
    />
  )
}

export default Experto;