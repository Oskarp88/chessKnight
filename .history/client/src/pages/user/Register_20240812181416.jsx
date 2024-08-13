import React from 'react'
import { useChessboardContext } from '../../context/boardContext'

function Register() {
    const {chessColor} = useChessboardContext();
  return (
    <div className={style.container} style={{background:chessColor.fondo}}>Register</div>
  )
}

export default Register