import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Convert } from './pages/Convert';
import { Conversions } from './pages/Conversions';
import { useAuth } from './auth/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/convert"
            element={
              <ProtectedRoute>
                <Convert />
              </ProtectedRoute>
            }
          />
          <Route
            path="/conversions"
            element={
              <ProtectedRoute>
                <Conversions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<RedirectToConvertOrLogin />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Helper component to redirect based on auth
const RedirectToConvertOrLogin: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return <Navigate to={isAuthenticated ? '/convert' : '/login'} replace />;
};

export default App;
