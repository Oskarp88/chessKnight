import React from 'react';
import style from'../components/channel/Friends.module.css';

function ExpertoInsignia() {
  return (
    <img className={style.insignia} 
        src={`/fondos/experto.png`} 
        alt='assets/avatar/user.png' 
        title="Experto"
    />
  )
}

export default ExpertoInsignia;