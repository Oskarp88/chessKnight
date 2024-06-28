import React from 'react';
import style from './ModalsendTablas.module.css'; // Asegúrate de importar correctamente el archivo CSS

const ModalSendTablas = ({infUser, rechazarTablas, aceptarTablas}) => {
  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.header}>
          <h2>Ofreciendo tablas</h2> 
        </div> 
        <div className={style.body}>
          <img className={style.profileChekMate} src={`http://localhost:8080/api/user-photo/${infUser?.idOpponent}`} alt='assets/avatar/user.png'  />
          <p>{infUser?.username} te ofrece tablas</p>
          <button onClick={aceptarTablas}>Aceptar</button>
          <button onClick={rechazarTablas}>Rechazar</button>
          </div>
      </div>
    </div>
  );
};

export default ModalSendTablas;