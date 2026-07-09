import { api } from './api';

export const analyticsService = {
  async getOverview() {
    const response = await api.get('/analytics/overview');
    return response.data.data;
  },

  async getCompanyAnalytics(slug: string) {
    const response = await api.get(`/analytics/company/${slug}`);
    return response.data.data;
  }
};
