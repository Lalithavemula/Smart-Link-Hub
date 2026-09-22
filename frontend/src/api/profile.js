import { apiClient } from './client';

export const profileApi = {
  getMe: async () => {
    const response = await apiClient.get('/api/v1/profiles/me');
    return response.data;
  },
  getPublicProfile: async (username) => {
    const response = await apiClient.get(`/u/${username}`);
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await apiClient.put('/api/v1/profiles/me', data);
    return response.data;
  },
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/v1/uploads/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
