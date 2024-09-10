import React from 'react';
import style from'../components/channel/Friends.module.css';

function Aprendiz() {
  return (
    <img className={style.insignia} 
        src={`/insignias/Aprendiz.png`} 
        alt='assets/avatar/user.png' 
        title="Novato"
    />
  )
}

export default Aprendiz;