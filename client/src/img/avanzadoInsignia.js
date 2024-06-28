import React from 'react';
import style from'../components/channel/Friends.module.css';

function AvanzadoInsignia() {
  return (
    <img className={style.insignia} 
        src={`/fondos/avanzado.png`} 
        alt='assets/avatar/user.png' 
        title="Avanzado"
    />
  )
}

export default AvanzadoInsignia;