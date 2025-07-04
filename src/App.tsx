import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Payments } from './pages/Payments';
import { Reservations } from './pages/Reservations';
import { Incidents } from './pages/Incidents';
import { useAuth } from './hooks/useAuth';
import './i18n';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            {/* Aquí se agregarán más rutas protegidas */}
          </Route>
          
          {/* Rutas protegidas adicionales */}
          <Route path="/payments" element={
            <ProtectedRoute requiredRoles={['admin', 'residente']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Payments />} />
          </Route>
          
          <Route path="/reservations" element={
            <ProtectedRoute requiredRoles={['admin', 'residente']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Reservations />} />
          </Route>
          
          <Route path="/incidents" element={
            <ProtectedRoute requiredRoles={['admin', 'residente', 'proveedor']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Incidents />} />
          </Route>
          
          <Route path="/providers" element={
            <ProtectedRoute requiredRoles={['admin', 'residente']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<div>Providers - Coming Soon</div>} />
          </Route>
          
          <Route path="/votes" element={
            <ProtectedRoute requiredRoles={['admin', 'residente']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<div>Votes - Coming Soon</div>} />
          </Route>
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<div>Admin Panel - Coming Soon</div>} />
          </Route>
          
          {/* Ruta de fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;