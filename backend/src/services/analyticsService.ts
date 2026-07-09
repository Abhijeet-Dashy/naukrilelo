import { companyRepository } from '../repositories/companyRepository';
import { problemRepository } from '../repositories/problemRepository';

export const analyticsService = {
  async getOverview() {
    const totalCompanies = await companyRepository.count();
    const totalProblems = await problemRepository.count();
    
    const difficultyDist = await problemRepository.getDifficultyDistribution();
    const formattedDiff = { easy: 0, medium: 0, hard: 0 };
    difficultyDist.forEach((d: any) => {
      if (d._id === 'Easy') formattedDiff.easy = d.count;
      if (d._id === 'Medium') formattedDiff.medium = d.count;
      if (d._id === 'Hard') formattedDiff.hard = d.count;
    });

    const topCompanies = await companyRepository.getTopCompanies(10);
    const topTopics = await problemRepository.getTopicDistribution();

    return {
      totalCompanies,
      totalProblems,
      difficulty: formattedDiff,
      topCompanies,
      topTopics,
    };
  },

  async getCompanyAnalytics(slug: string) {
    const company = await companyRepository.findBySlug(slug);
    if (!company) {
      return null;
    }

    const filter = { companies: { $in: [company.name] } };
    const topicDistribution = await problemRepository.getTopicDistribution(filter);
    
    return {
      company: { name: company.name, slug: company.slug },
      totalProblems: company.totalProblems,
      difficultyDistribution: company.difficultyCount,
      topicDistribution,
    };
  }
};
