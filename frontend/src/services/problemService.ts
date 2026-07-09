import { api } from './api';

export const problemService = {
  async getProblems(params = {}) {
    const response = await api.get('/problems', { params });
    return response.data.data;
  },

  async getProblemById(id: string) {
    const response = await api.get(`/problems/${id}`);
    return response.data.data;
  }
};
