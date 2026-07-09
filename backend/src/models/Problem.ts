import mongoose, { Schema, Document } from 'mongoose';

export interface IProblem extends Document {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  companies: string[];
  frequency: number;
  leetcodeUrl: string;
  isPremium: boolean;
  acceptanceRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topics: [{ type: String, index: true }],
    companies: [{ type: String, index: true }],
    frequency: { type: Number, default: 0 },
    leetcodeUrl: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    acceptanceRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for common queries
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ isPremium: 1 });

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
