import axiosInstance from './axiosInstance';

export const authService = {
  // Login User
  login: async (credentials: any) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    // Expected response: { token: "...", user: { id: "...", name: "..." } }
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  // Register User
  register: async (userData: any) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user-storage');
  },
};
