import React from 'react';
import style from '../../pages/Registro.module.css';

function OAuthGoogle() {
  return (
    <button className={`${style.socialsignin} ${style.facebook}`}>Log in with Facebook</button>
    )
}

export default OAuthGoogle