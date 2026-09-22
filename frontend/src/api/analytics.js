import { apiClient } from './client';

export const analyticsApi = {
  getAnalytics: async (params) => {
    // params: { eventType, startDate, endDate, page, size }
    const response = await apiClient.get('/api/v1/analytics', { params });
    return response.data;
  }
};
