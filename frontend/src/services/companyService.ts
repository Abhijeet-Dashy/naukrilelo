import { api } from './api';

export const companyService = {
  async getCompanies(params = {}) {
    const response = await api.get('/companies', { params });
    return response.data.data;
  },

  async getCompanyBySlug(slug: string) {
    const response = await api.get(`/companies/${slug}`);
    return response.data.data;
  }
};
