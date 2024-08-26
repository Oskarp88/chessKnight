import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import Spinner from '../Spinner';
import { baseUrl } from '../../utils/services';

export default function PrivateRoute() {
  const { auth } = useAuth();
 
  return  auth?.user ? <Outlet /> : <Navigate to='login' replace/>;
 
}