import React, { createContext, useContext, useEffect, useState } from 'react';
import { baseUrl, putRequest } from '../utils/services';
import axios from 'axios';

const CheckMateContext = createContext();
const CheckMateProvider = ({ children }) => {

  const [error, setError] = useState(null);
  const [checkMate, setCheckMate] = useState({ 
    userId: '',
    name: '',
    nameOpponent: '',
    bandera: '',
    banderaOpponent: '',
    country: '',
    countryOpponent: '',
    time: '',
    game: '',
    elo: 0,
    eloUser: 0, 
    eloOpponent: 0,
    color: '',
   });

  useEffect(() => {
    const result = async() => {

     if(!checkMate.userId) return null;
     
        const response = await axios.put(`https://git.heroku.com/chessknigth.git/api/partida/user/update/${checkMate.userId}`, {
          name: checkMate?.name,
          nameOpponent: checkMate?.nameOpponent,
          bandera: checkMate?.bandera,
          banderaOpponent: checkMate?.banderaOpponent,
          country: checkMate?.country,
          countryOpponent: checkMate?.countryOpponent,
          time: checkMate?.time, 
          game:  checkMate?.game, 
          elo: checkMate?.elo,
          eloUser: checkMate?.eloUser,
          eloOpponent: checkMate?.eloOpponent,
          color: checkMate?.color
        });
  
        if(response.error){
           return setError(response.error);
        }
    }

    result();
 },[checkMate.userId]);

  return (
    <CheckMateContext.Provider value={{ checkMate, setCheckMate }}>
      {children}
    </CheckMateContext.Provider>
  );
};

const useCheckMateContext = () => {
  const context = useContext(CheckMateContext);
  if (!context) {
    throw new Error('useCheckMateContext must be used within a CheckMateProvider');
  }
  return context;
};

export { CheckMateProvider, useCheckMateContext };
