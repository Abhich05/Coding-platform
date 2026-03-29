import apiClient from '../lib/apiClient';
import { Assessment } from '../types/assessment';

export const assessmentService = {
  async getAll(params?: { status?: string; page?: number; limit?: number }) {
    const response = await apiClient.get('/assessments', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/assessments/${id}`);
    return response.data;
  },

  async getPublicInfo(id: string) {
    const response = await apiClient.get(`/assessments/${id}/public`);
    return response.data;
  },

  async getForCandidate(id: string) {
    const response = await apiClient.get(`/assessments/${id}/candidate`);
    return response.data;
  },

  async startAsCandidate(id: string, name: string, email: string) {
    const response = await apiClient.post(`/assessments/${id}/start`, { name, email });
    return response.data;
  },

  async create(data: Partial<Assessment>) {
    const response = await apiClient.post('/assessments', data);
    return response.data;
  },

  async update(id: string, data: Partial<Assessment>) {
    const response = await apiClient.put(`/assessments/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/assessments/${id}`);
    return response.data;
  },

  async addCandidate(assessmentId: string, candidate: { name: string; email: string }) {
    const response = await apiClient.post(`/assessments/${assessmentId}/candidates`, candidate);
    return response.data;
  },

  async getStats(assessmentId: string) {
    const response = await apiClient.get(`/assessments/${assessmentId}/stats`);
    return response.data;
  },
};
