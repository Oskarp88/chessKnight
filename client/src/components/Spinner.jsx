import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import style from '../components/navbar/Sidebar.module.css'; 


const Spinner = ({ path = 'login'}) => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const {auth, setAuth} = useAuth();

  useEffect(() => {
   
    const interval = setInterval(() => {
      setCount((prevValue) => prevValue - 1);
    }, 1000);

    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname
      });
    }

    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  useEffect(()=>{
    if(count > 0 ) return;
     console.log('vuelve a iniciar sesion');
     setAuth({
      ...auth,
      user: null,
      token: ''
    });
   
    localStorage.removeItem('auth');
    toast.success('vuelve a iniciar sesion', {
      autoClose: 3000,
      closeButton: (
        <button className={style.closeButton}>X</button>
      ),
    });
  },[count]);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh', color: 'white' }}>
        <h1 className="text-center">Redirecting to you in {count} seconds</h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
