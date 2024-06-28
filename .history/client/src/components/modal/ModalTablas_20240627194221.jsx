import React from 'react';
import style from './ModalTablas.module.css'; // Asegúrate de importar correctamente el archivo CSS

const ModalTablas = ({infUser, cancelarTablas}) => {
  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.header}>
          <h2>Ofreciendo tablas</h2> 
        </div>
        <div className={style.body}>
          <img className={style.profileChekMate} src={`http://localhost:8080/api/user-photo/${infUser?.idOpponent}`} alt='assets/avatar/user.png'  />
          <p>Esperando respuesta de {infUser?.username}</p>
          
            <div className={style.ldsring}><div></div><div></div><div></div><div></div></div>
          
          <button onClick={cancelarTablas}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalTablas;