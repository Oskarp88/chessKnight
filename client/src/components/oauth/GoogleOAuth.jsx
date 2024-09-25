import React, { useEffect, useState } from 'react';
import style from './GoogleOAuth.module.css';
import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth';
import { app } from '../../utils/firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import toast from 'react-hot-toast';
import { baseUrl } from '../../utils/services';
import { useLanguagesContext } from '../../context/languagesContext';
import { Spinner } from 'react-bootstrap';

function GoogleOAuht() {
  const {language} = useLanguagesContext();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // Dirección IP del usuario
      const ipResponse = await axios.get(`${baseUrl}/auth/get-ip`);
      const userIP = ipResponse.data.ip;

      // Geolocalización basándose en la IP
      const geoResponse = await axios.get(`${baseUrl}/auth/get-geo/${userIP}`);
      const userCountry = geoResponse.data.country_name;

      // Obtener la bandera del país
      const banderaResponse = await axios.get('https://restcountries.com/v3.1/all');
      const countryData = banderaResponse.data.find(country => country.name.common === userCountry);
      const countryFlag = countryData ? countryData.flags.png : '';

      const response = await axios.post(`${baseUrl}/auth/google`, {
        username: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        country: userCountry,
        imagenBandera: countryFlag,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(response.data && response.data.message === 'Continue with the registration'){
        toast.success(response.data.message);
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(response.data));
        setLoading(false);
       return navigate('/dashboard/next');
      }
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(response.data));
        setLoading(false);
        navigate('/');

      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log('could not sign in with Google', error);
      toast.error('Authentication failed. Please try again.');
    }
  }

  
  return (
    <button 
      className={`${style.socialsignin} ${style.google}`}
      onClick={handleGoogleClick}
      type='button'
    >  
      {loading ? 
                 <> <Spinner  className={style.spinner} animation="grow" /> {`${language.authenticating}...`}</>
               : language.Log_in_with_Google
      }
    </button>
  );
}

export default GoogleOAuht;
