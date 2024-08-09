import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Login.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import GoogleOAuht from '../components/oauth/GoogleOAuth';
import { baseUrl } from '../utils/services';


const Login = () => {
  const { auth, setAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response && response.data.success) {
        toast.success(response.data && response.data.message, {
          autoClose: 3000,
          closeButton: <button className={style.closeButton}>X</button>,
        });
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(response.data));
      } else {
        toast.error(response.data.message, {
          autoClose: 3000,
          closeButton: <button className={style.closeButton}>X</button>,
        });
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Login failed', {
        autoClose: 3000,
        closeButton: <button className={style.closeButton}>X</button>,
      });
    }
  };

  return (
    <div className={style.backgroundImage}>
      <div className={style.container} > 
        <form className={style.form} onSubmit={handleSubmit}>
          <div className={style.h2}>
            <h2>LOGIN</h2>
          </div>
          <label>EMAIL</label>
          <input
            type="email"
            name="email"
            className={style.email}
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <label>PASSWORD</label>
          <input
            type="password"
            name="password"
            className={style.pwd}
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Link className={style.link} to="/forgot-password">
            <a >Forgot your password ?</a>
          </Link>
          <br />
          <button className={style.signin} type="submit">
            <span>sign in</span>
          </button>
          <button className={style.register} onClick={() => navigate('/register')}>
            <span>register</span>
          </button>
          <button>
          <GoogleOAuht />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
