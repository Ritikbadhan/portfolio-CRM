import axios from 'axios';
import { API_URLS } from '@portfolio/config';

export const apiClient = axios.create({
  baseURL: API_URLS.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach tokens if needed later
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global API errors here (e.g. 401 refresh token logic)
    return Promise.reject(error);
  }
);
