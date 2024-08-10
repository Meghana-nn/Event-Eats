import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role === 'admin') {
    return <Navigate to="admin" />;
  }
  if (user.role === 'caterer') {
    return <Navigate to="/caterer" />;
  }


  return children;
}
