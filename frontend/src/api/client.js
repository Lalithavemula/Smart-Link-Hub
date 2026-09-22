import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the backend's ApiResponse structure if present
    if (response.data && response.data.hasOwnProperty('success')) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally dispatch an event or redirect to login
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);
