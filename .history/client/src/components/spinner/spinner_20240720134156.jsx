import React from 'react';
import style from './Spinner.module.css';

function Spinner({text}) {
  return (
    <div className={style.redirecting}>
        <div className={style.spinner}></div>
        <p className={style.dirigiendo}>{text}</p>
    </div>
  )
}

export default Spinner;