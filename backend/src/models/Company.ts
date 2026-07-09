import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  slug: string;
  logo?: string;
  totalProblems: number;
  difficultyCount: {
    easy: number;
    medium: number;
    hard: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String },
    totalProblems: { type: Number, default: 0 },
    difficultyCount: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
