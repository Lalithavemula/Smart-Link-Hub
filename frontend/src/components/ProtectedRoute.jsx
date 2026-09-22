import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import Loader from './ui/Loader';


export default function ProtectedRoute() {
  const { user, loading: authLoading } = useAuth();
  const { fetchProfile, profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    if (user && !profile && !profileLoading) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile, profileLoading]);

  if (authLoading || profileLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader size={48} /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
