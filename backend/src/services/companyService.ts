import { companyRepository } from '../repositories/companyRepository';
import { problemRepository } from '../repositories/problemRepository';
import { AppError } from '../utils/AppError';
import { getPaginationOptions, formatPaginationResult } from '../utils/paginationHelper';

export const companyService = {
  async getCompanies(query: any) {
    const { page, limit, skip } = getPaginationOptions(query);
    
    let filter: any = {};
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    let sort: any = { name: 1 };
    if (query.sort) {
      if (query.sort === 'newest') sort = { createdAt: -1 };
      else if (query.sort === 'oldest') sort = { createdAt: 1 };
      else if (query.sort === 'problems_desc') sort = { totalProblems: -1 };
    }

    const { companies, total } = await companyRepository.findAll(filter, skip, limit, sort);
    return {
      companies,
      pagination: formatPaginationResult(page, limit, total),
    };
  },

  async getCompanyBySlug(slug: string) {
    const company = await companyRepository.findBySlug(slug);
    if (!company) {
      throw new AppError('Company not found', 404);
    }
    
    // Also fetch problem count and basic stats if necessary (already available in company doc)
    return company;
  }
};
