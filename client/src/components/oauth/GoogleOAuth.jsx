import React from 'react';
import style from './GoogleOAuth.module.css';
import { GoogleAuthProvider, getAuth, signInWithPopup } from '@firebase/auth';
import { app } from '../../utils/firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import toast from 'react-hot-toast';
import { baseUrl } from '../../utils/services';

function GoogleOAuht() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log('result', result);

      // Dirección IP del usuario
      const ipResponse = await axios.get(`${baseUrl}/auth/get-ip`);
      const userIP = ipResponse.data.ip;
      console.log('User IP:', userIP);

      // Geolocalización basándose en la IP
      const geoResponse = await axios.get(`${baseUrl}/auth/get-geo/${userIP}`);
      const userCountry = geoResponse.data.country_name;
      console.log('User Country:', userCountry);

      // Obtener la bandera del país
      const banderaResponse = await axios.get('https://restcountries.com/v3.1/all');
      const countryData = banderaResponse.data.find(country => country.name.common === userCountry);
      const countryFlag = countryData ? countryData.flags.png : '';
      console.log('Country Flag URL:', countryFlag);

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

      console.log('google', response);
      if(response.data && response.data.message === 'Continue with the registration'){
        toast.success(response.data.message);
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem('auth', JSON.stringify(response.data));
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
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
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
      Log in with Google+
    </button>
  );
}

export default GoogleOAuht;
