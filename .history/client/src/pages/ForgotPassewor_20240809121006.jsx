import React, { useState } from 'react';
import style from './Forgot.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axios.post('https://chessknigth-22fe0ebf751e.herokuapp.com/api/user/forgot-password', { email });

      // Realiza cualquier otra acción necesaria después de enviar el correo electrónico
      setTimeout(()=>{
        toast.success(`Se ha enviado un correo electrónico a ${email} para recuperar la contraseña.`,{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          closeButton: (
            <button className={style.closeButton}>X</button>
          ),
        });
      },3000);

        navigate('/login');
    } catch (error) {
        toast.error(String(error), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            closeButton: (
              <button className={style.closeButton}>X</button>
            ),
            });
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