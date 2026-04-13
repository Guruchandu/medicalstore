import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-success"></div></div>;

  if (!user) {
    // Redirect to home if not logged in
    return <Navigate to="/" />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
