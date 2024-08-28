import React, { createContext, useContext, useState } from 'react';
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

  
  
  return (
    <LanguagesContext.Provider  value={{ language, setLanguage }}>
      {children}
    </LanguagesContext.Provider>
  );
};