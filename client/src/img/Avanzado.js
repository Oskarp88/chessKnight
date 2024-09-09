import React from 'react';
import style from'../components/channel/Friends.module.css';

function Avanzado() {
  return (
    <img className={style.insignia} 
        src={`/insignias/Avanzado.png`} 
        alt='assets/avatar/user.png' 
        title="Intermedio"
    />
  )
}

export default Avanzado;