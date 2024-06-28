import React from 'react';
import style from'../components/channel/Friends.module.css';

function PrincipianteInsignia() {
  return (
    <img 
        className={style.insignia} 
        src={`/fondos/principiante.png`} 
        alt='assets/avatar/user.png' 
        title="Principiante"
    />
  )
}

export default PrincipianteInsignia;