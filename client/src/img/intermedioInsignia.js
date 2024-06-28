import React from 'react';
import style from'../components/channel/Friends.module.css';

function IntermedioInsignia() {
  return (
    <img className={style.insignia} 
        src={`/fondos/intermedio.png`} 
        alt='assets/avatar/user.png' 
        title="Intermedio"
    />
  )
}

export default IntermedioInsignia;