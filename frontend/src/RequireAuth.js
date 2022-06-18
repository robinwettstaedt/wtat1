import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from './hooks/useAuth';

const RequireAuth = () => {
  const { authenticated } = useAuth();
  const location = useLocation();

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;
