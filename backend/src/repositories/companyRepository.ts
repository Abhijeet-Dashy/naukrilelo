import { Company, ICompany } from '../models/Company';
import mongoose from 'mongoose';

export const companyRepository = {
  async findAll(
    filter: Record<string, any> = {},
    skip: number = 0,
    limit: number = 20,
    sort: Record<string, mongoose.SortOrder> = { name: 1 }
  ) {
    const companies = await Company.find(filter)
      .select('_id name slug logo totalProblems difficultyCount')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Company.countDocuments(filter);
    return { companies, total };
  },

  async findBySlug(slug: string) {
    return Company.findOne({ slug }).lean();
  },

  async upsert(companyData: Partial<ICompany>) {
    return Company.findOneAndUpdate(
      { name: companyData.name },
      { $set: companyData },
      { new: true, upsert: true }
    );
  },

  async count() {
    return Company.countDocuments();
  },
  
  async getTopCompanies(limit: number = 10) {
    return Company.find()
      .sort({ totalProblems: -1 })
      .limit(limit)
      .select('name slug logo totalProblems')
      .lean();
  }
};
