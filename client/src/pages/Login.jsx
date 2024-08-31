import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import style from './Login.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/authContext';
import  toast from 'react-hot-toast';
import GoogleOAuht from '../components/oauth/GoogleOAuth';
import { baseUrl } from '../utils/services';
import { useLanguagesContext } from '../context/languagesContext';


const Login = () => {
  const {language} = useLanguagesContext();
  const { auth, setAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if(auth?.user){
            navigate(redirect)
        }
    },[navigate, redirect, auth?.user]);
 
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
        toast.success(response.data && response.data.message);
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(response.data));
      } else {
        toast.error(response.data.message);
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Login failed');
    }
  };

  return (
    <div className={style.backgroundImage}>
      <div className={style.container} > 
        <Form className={style.form} onSubmit={handleSubmit}>
          <div className={style.h2}>
            <h2 style={{ textTransform: 'uppercase' }}>{language?.login}</h2>
          </div>
          <label style={{ textTransform: 'uppercase' }}>{language.email}</label>
          <Form.Control 
            type="email" 
            name="email"
            placeholder={language.email}
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <label style={{ textTransform: 'uppercase' }}>{language.password}</label>
          <Form.Control 
             type="email"
             name="password" 
             placeholder={language.password} 
             value={formData.password}
             onChange={handleChange}
          />

          <Link className={style.link} to="/forgot-password">
            <a >{language.Forgot_your_password}</a>
          </Link>
          <br />
          <Button 
            
            type="submit"
            className='text-uppercase'
          >
            {language.sign_in}
          </Button>
          {/* <button className={style.signin} type="submit">
            <span>{language.sign_in}</span>
          </button> */}
           <div className={style.customer}>
                <p className="text-white">
                   {language.New_user} {" "}
                   <Link 
                     to={redirect ? `/register?redirect=${redirect}` : '/register'}
                     className={style.registerLink}
                   >
                     {language.register}
                   </Link>
                </p>
            </div>
          <div className={style.oauth}>
            <GoogleOAuht/>
          </div>        
        </Form>
      </div>
    </div>
  );
};

export default Login;
