import axios from 'axios';

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
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user-storage'); // Clear Zustand persistence
window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
