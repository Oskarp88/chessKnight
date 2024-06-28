import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import Spinner from '../Spinner';

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(true);

 
    useEffect(()=>{
      const authCheck = async () => {
        setOk(true);
        console.log('authCheck');
        try {
          console.log('llegue al trycatch');
          const res = await axios.get('http://localhost:8080/api/user-auth');
          
           if (res.data.ok) {
             console.log('llegue a data: ', res.data.ok)
             setOk(true);          
           } else {
             console.log('llegue a data else: ', res.data.ok)
             setOk(false);
           }      
        } catch (error) {
          setOk(false);
        }
        
      };
      
     if(auth?.token){
      
       authCheck();
       
     }
    },[auth]);
  
  console.log('llegue al return', ok);
  return  ok ? <Outlet /> : <Spinner loading={loading}/>;
 
}