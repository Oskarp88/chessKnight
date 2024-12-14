import React from 'react';
import style from'../components/channel/rooms/Friends.module.css';
function Novato() {
  return (
    <img 
        className={style.insignia} 
        src={`/insignias/Novato.png`} 
        alt='assets/avatar/user.png' 
        title="Novato"
    />
  )
}

export default Novato;