import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export const useProfile = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a UserProvider');
  }
  return context;
};
