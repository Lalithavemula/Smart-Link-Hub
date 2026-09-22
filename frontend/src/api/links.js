import { apiClient } from './client';

export const linksApi = {
  getLinks: async (profileId) => {
    const response = await apiClient.get(`/api/v1/profiles/${profileId}/links`);
    return response.data;
  },
  createLink: async (profileId, data) => {
    const response = await apiClient.post(`/api/v1/profiles/${profileId}/links`, data);
    return response.data;
  },
  updateLink: async (profileId, linkId, data) => {
    const response = await apiClient.put(`/api/v1/profiles/${profileId}/links/${linkId}`, data);
    return response.data;
  },
  deleteLink: async (profileId, linkId) => {
    const response = await apiClient.delete(`/api/v1/profiles/${profileId}/links/${linkId}`);
    return response.data;
  }
};
