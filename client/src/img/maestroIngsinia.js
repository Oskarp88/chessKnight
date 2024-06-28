import React from 'react';
import style from'../components/channel/Friends.module.css';

function MaestroIngsinia() {
  return (
    <img className={style.insignia} 
        src={`/fondos/maestro.png`} 
        alt='assets/avatar/user.png' 
        title="Maestro"
    />
  )
}

export default MaestroIngsinia;