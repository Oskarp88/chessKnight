import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const AdminRoute = () => {
  const { auth } = useAuth();

  return auth?.user && auth?.user?.isAdmin ? <Outlet /> : <Navigate to="/" replace/>
};

export default AdminRoute;
