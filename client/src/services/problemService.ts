import apiClient from '../lib/apiClient';
import { Problem } from '../types/assessment';

export const problemService = {
  async getAll(params?: { 
    difficulty?: string; 
    language?: string; 
    tags?: string; 
    search?: string;
    page?: number; 
    limit?: number;
  }) {
    const response = await apiClient.get('/problems', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/problems/${id}`);
    return response.data;
  },

  async create(data: Partial<Problem>) {
    const response = await apiClient.post('/problems', data);
    return response.data;
  },

  async update(id: string, data: Partial<Problem>) {
    const response = await apiClient.put(`/problems/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/problems/${id}`);
    return response.data;
  },
};
