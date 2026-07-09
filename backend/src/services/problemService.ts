import { problemRepository } from '../repositories/problemRepository';
import { AppError } from '../utils/AppError';
import { getPaginationOptions, formatPaginationResult } from '../utils/paginationHelper';

export const problemService = {
  async getProblems(query: any) {
    const { page, limit, skip } = getPaginationOptions(query);
    
    let filter: any = {};
    
    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }
    if (query.difficulty) {
      filter.difficulty = query.difficulty;
    }
    if (query.topic) {
      filter.topics = { $in: [query.topic] };
    }
    if (query.company) {
      filter.companies = { $in: [query.company] };
    }
    if (query.isPremium !== undefined) {
      filter.isPremium = query.isPremium === 'true';
    }

    let sort: any = { frequency: -1 };
    if (query.sort) {
      if (query.sort === 'newest') sort = { createdAt: -1 };
      else if (query.sort === 'oldest') sort = { createdAt: 1 };
      else if (query.sort === 'alphabetical') sort = { title: 1 };
    }

    const { problems, total } = await problemRepository.findAll(filter, skip, limit, sort);
    return {
      problems,
      pagination: formatPaginationResult(page, limit, total),
    };
  },

  async getProblemById(id: string) {
    const problem = await problemRepository.findById(id);
    if (!problem) {
      throw new AppError('Problem not found', 404);
    }
    return problem;
  }
};
