import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../../context/authContext';
import Spinner from '../Spinner';

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/dashboard');
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        // Manejar el error aquí si es necesario
      }
    };

    if (auth && auth.token) {
      authCheck();
    }
  }, [auth, setAuth]);

  return ok ? <Outlet /> : <Spinner path="/" />;
};

export default AdminRoute;
