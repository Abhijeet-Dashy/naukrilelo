import { api } from './api';

export const progressService = {
  async getProgress() {
    const response = await api.get('/progress');
    return response.data.data;
  },

  async toggleSolved(problemId: string, solved: boolean) {
    const response = await api.post('/progress/solved', { problemId, solved });
    return response.data.data;
  },

  async toggleRevision(problemId: string, revision: boolean) {
    const response = await api.post('/progress/revision', { problemId, revision });
    return response.data.data;
  }
};
