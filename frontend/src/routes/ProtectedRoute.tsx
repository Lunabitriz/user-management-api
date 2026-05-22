import { storage } from '../utils/storage';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  if(!storage.isAuthenticated())
    return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
