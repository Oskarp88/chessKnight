import React from 'react';
import style from'../components/channel/rooms/Friends.module.css';
function Avanzado() {
  return (
    <img className={style.insignia} 
        src={`/insignias/Avanzado.png`} 
        alt='assets/avatar/user.png' 
        title="Avanzado"
    />
  )
}

export default Avanzado;