import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';

const RequireAuth = () => {
  const { token } = useAuth();
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;
