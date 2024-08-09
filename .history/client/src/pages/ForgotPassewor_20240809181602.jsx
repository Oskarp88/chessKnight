import React, { useState } from 'react';
import style from './Forgot.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/services';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axios.post(`${baseUrl}/user/forgot-password`, { email });

      // Realiza cualquier otra acción necesaria después de enviar el correo electrónico
        toast.success(`Se ha enviado un correo electrónico a ${email} para recuperar la contraseña.`);
        navigate('/login');

    } catch (error) {
        toast.error('send failed');
      // Maneja el error de acuerdo a tus necesidades
    }
  };

  return (
    <div className={style.forgotPasswordContainer}>
     <div className={style.container}>
      <h2>RECUPERAR CONTRASEÑA</h2>
        <form onSubmit={handleSubmit}>
          
            <input type="email" value={email} onChange={handleEmailChange} placeholder='correo electronico'/>

          <button type="submit">Enviar correo</button>
        </form>
     </div>
    </div>
  );
};

export default ForgotPassword;
