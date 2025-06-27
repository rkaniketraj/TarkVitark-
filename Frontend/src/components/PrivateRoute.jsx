import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // or a spinner

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
