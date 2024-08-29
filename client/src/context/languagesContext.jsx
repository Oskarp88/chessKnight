import React, { createContext, useContext, useEffect, useState } from 'react';
import { languages } from '../utils/languages';

const LanguagesContext = createContext();

export const useLanguagesContext = () => {
  const context = useContext(LanguagesContext);
  if (!context) {
    throw new Error('useLanguagesContext must be used within a LanguagesContext');
  }
  return context;
};

export const LanguagesProvider = ({ children }) => {
  const [language, setLanguage] = useState(languages[1]);

  useEffect(()=>{
    const languageNum = localStorage.getItem('languageNum');
    
    if(!isNaN(languageNum) && languageNum) {
      setLanguage(languages[parseInt(languageNum)]);
    }
  },[language]);
  
  return (
    <LanguagesContext.Provider  value={{ language, setLanguage }}>
      {children}
    </LanguagesContext.Provider>
  );
};