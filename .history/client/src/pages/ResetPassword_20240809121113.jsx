import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './ResetPassword.module.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();

  useEffect(() => {
    console.log(token);
  }, [token]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('La Contraseña no coinciden', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const response = await axios.post('https://chessknigth-22fe0ebf751e.herokuapp.com/api/user/reset-password', {
        token: token,
        newPassword: password,
      });

      if (response.data) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(response.data.error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(String(error), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className={style.resetPasswordContainer}>
      <h2>Restablecer contraseña</h2>
      <form className="resetPasswordForm" onSubmit={handleResetPassword}>
        <label>
          Nueva contraseña:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <label>
          Confirmar contraseña:
          <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
        </label>
        <button type="submit">Restablecer contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;