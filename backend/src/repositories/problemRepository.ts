import { Problem, IProblem } from '../models/Problem';
import mongoose from 'mongoose';

export const problemRepository = {
  async findAll(
    filter: Record<string, any> = {},
    skip: number = 0,
    limit: number = 20,
    sort: Record<string, mongoose.SortOrder> = { frequency: -1 }
  ) {
    const problems = await Problem.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Problem.countDocuments(filter);
    return { problems, total };
  },

  async findById(id: string) {
    return Problem.findById(id).lean();
  },

  async upsert(problemData: Partial<IProblem>) {
    return Problem.findOneAndUpdate(
      { leetcodeUrl: problemData.leetcodeUrl },
      { $set: problemData },
      { new: true, upsert: true }
    );
  },

  async count(filter: Record<string, any> = {}) {
    return Problem.countDocuments(filter);
  },

  async getDifficultyDistribution(filter: Record<string, any> = {}) {
    return Problem.aggregate([
      { $match: filter },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
  },
  
  async getTopicDistribution(filter: Record<string, any> = {}) {
    return Problem.aggregate([
      { $match: filter },
      { $unwind: '$topics' },
      { $group: { _id: '$topics', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
  }
};
