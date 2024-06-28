import React from 'react';
import style from'../components/channel/Friends.module.css';

function NovatoInsignia() {
  return (
    <img className={style.insignia} 
        src={`/fondos/novato.png`} 
        alt='assets/avatar/user.png' 
        title="Novato"
    />
  )
}

export default NovatoInsignia;