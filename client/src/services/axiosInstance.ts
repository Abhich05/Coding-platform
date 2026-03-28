import axios from 'axios';
import { useUserStore } from '../store/useUserStore';

// Replace with your actual backend URL from server/server.js
const API_BASE_URL = 'http://localhost:4000/api'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches Token
axiosInstance.interceptors.request.use(
  (config) => {
    // We will store token in localStorage with key 'auth_token'
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear data and redirect
      console.log('401 Unauthorized - checking if it was a real auth failure');
      
      // If we are already on the signin page, don't clear and redirect again
      if (window.location.pathname.startsWith('/auth/')) {
        return Promise.reject(error);
      }

      console.log('Clearing auth data and redirecting to signin');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user-storage'); // Clear Zustand persistence
      useUserStore.getState().clearUser();
      
      // Use router navigation instead of hard redirect if possible
      // but window.location.href is a sure way to reset the app state
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
