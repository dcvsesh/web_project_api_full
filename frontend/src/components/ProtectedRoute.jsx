import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../utils/auth';
import { api } from '../utils/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isLoggedIn());

  useEffect(() => {
    const verifyToken = async () => {
      if (auth.isLoggedIn()) {
        try {
          await api.getUserInfo(); // Verifica el token con el backend
          setIsAuthenticated(true);
        } catch (error) {
          auth.removeToken();
          setIsAuthenticated(false);
        }
      }
    };

    verifyToken();
  }, [location.pathname]);

  // Redirigir si está autenticado
  if (isAuthenticated && ['/signin', '/signup'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // Redirigir si no está autenticado y va a ruta protegida
  if (!isAuthenticated && !['/signin', '/signup'].includes(location.pathname)) {
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;