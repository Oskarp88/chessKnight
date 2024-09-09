import React from 'react';
import style from'../components/channel/Friends.module.css';

function Veterano() {
  return (
    <img className={style.insignia} 
        src={`/insignias/Veterano.png`} 
        alt='assets/avatar/user.png' 
        title="Maestro"
    />
  )
}

export default Veterano;