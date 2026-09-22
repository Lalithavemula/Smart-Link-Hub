import React, { createContext, useState, useCallback } from 'react';
import { profileApi } from '../api/profile';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await profileApi.getMe();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (data) => {
    const updated = await profileApi.updateProfile(data);
    setProfile(updated);
    return updated;
  };

  return (
    <UserContext.Provider value={{ profile, loading, error, fetchProfile, updateProfile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};
