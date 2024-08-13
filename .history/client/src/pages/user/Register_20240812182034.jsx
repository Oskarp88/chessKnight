import React from 'react';
import style from './Register.module.css';
import { useChessboardContext } from '../../context/boardContext';

function Register() {
    const {chessColor} = useChessboardContext();
  return (
    <div className={style.container} style={{background:chessColor.fondo}}>
        <div>
            <h3>Continue con el registro</h3>
        </div>
    </div>
  )
}

export default Register;