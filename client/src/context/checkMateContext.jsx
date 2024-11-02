import React, { createContext, useContext, useEffect, useState } from 'react';
import { baseUrl, putRequest } from '../utils/services';
import axios from 'axios';

const CheckMateContext = createContext();
const CheckMateProvider = ({ children }) => {

  const [error, setError] = useState(null);
  const [checkMate, setCheckMate] = useState(null);
  
  useEffect(() => {
    const updateCheckMate = async () => {
      
      if (!checkMate) return; // Asegurarse de que haya datos válidos en checkMate antes de hacer el request
      console.log('estoy dentreo de updateCheckMate')
      try {
        const response = await axios.put(`${baseUrl}/partida/user/update/${checkMate.userId}`, {
          name: checkMate?.name,
          opponentId: checkMate?.opponentId,
          nameOpponent: checkMate?.nameOpponent,
          bandera: checkMate?.bandera,
          banderaOpponent: checkMate?.banderaOpponent,
          country: checkMate?.country,
          countryOpponent: checkMate?.countryOpponent,
          time: checkMate?.time,
          game: checkMate?.game,
          elo: checkMate?.elo,
          eloUser: checkMate?.eloUser,
          eloOpponent: checkMate?.eloOpponent,
          color: checkMate?.color,
          score: checkMate?.score
        });

        if (response.error) {
          console.log('Error en la respuesta: ', response.error);
        }
      } catch (err) {
        console.log('Error de actualización de checkMate: ', err.message);
      }
    };

    updateCheckMate();
 },[checkMate]);

 const saveCheckMate = async () => {
    try {
      
    } catch (error) {
      
    }
 }

  return (
    <CheckMateContext.Provider value={{ checkMate, setCheckMate, saveCheckMate }}>
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
