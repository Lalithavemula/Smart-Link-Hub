import { apiClient } from './client';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/api/v1/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post('/api/v1/auth/register', userData);
    return response.data;
  }
};
