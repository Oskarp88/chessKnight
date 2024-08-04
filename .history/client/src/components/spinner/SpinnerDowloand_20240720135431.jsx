import React from 'react';
import style from './Spinner.module.css';
import { useChessboardContext } from '../../context/boardContext';

function SpinnerDowloand({text}) {
    const {chessColor} = useChessboardContext();
    return (
        <div className={style.redirecting}>
            <div className={style.spinner}></div>
            <p className={style.dirigiendo} style={{color: chessColor.titulo}}>{text}</p>
        </div>
      )
}

export default SpinnerDowloand