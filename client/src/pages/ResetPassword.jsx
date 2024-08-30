import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './ResetPassword.module.css';
import { useParams } from 'react-router-dom';
import  toast from 'react-hot-toast';
import { baseUrl } from '../utils/services';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useLanguagesContext } from '../context/languagesContext';
import AlertDismissible from '../components/alerts/AlertDismissible';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const {language} = useLanguagesContext();
  const { token } = useParams();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('La Contraseña no coinciden');
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/user/reset-password`, {
        token: token,
        newPassword: password,
      });

      console.log('response', response)

      if (response.data.success) {
        toast.success(`${response.data.message, } success`);
      } else {      
        setText(`${response.data.message } error`);
        setShow(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);    }
  };

  return (
    <> 
      <AlertDismissible title = {'Token'} text={text} show={show} setShow={setShow}/>
       <div className={style.resetPasswordContainer}>
      <h2>{language.reset_password}</h2>
      <Form onSubmit={handleResetPassword}>
      <Form.Group className="mb-3" controlId="formNewPassword">
        <Form.Control 
          type="password" 
          placeholder={language.password}
          value={password} 
          onChange={handlePasswordChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formConfirmPassword">
        <Form.Control 
          type="password" 
          placeholder={`${language.confirm} ${language.password}`}
          value={confirmPassword} 
          onChange={handleConfirmPasswordChange} 
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        {language.Accept}
      </Button>
    </Form>
    </div>
    
    </>
  );
};

export default ResetPassword;
