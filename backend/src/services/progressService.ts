import { UserProgress } from '../models/UserProgress';
import mongoose from 'mongoose';

export const progressService = {
  async getProgress(userId: string) {
    const progressList = await UserProgress.find({ userId }).populate('problemId', 'title slug difficulty topics leetcodeUrl companies');
    return progressList;
  },

  async toggleSolved(userId: string, problemId: string, solved: boolean) {
    const progress = await UserProgress.findOneAndUpdate(
      { userId, problemId },
      { $set: { solved, solvedAt: solved ? new Date() : null } },
      { upsert: true, new: true }
    );
    return progress;
  },

  async toggleRevision(userId: string, problemId: string, revision: boolean) {
    const progress = await UserProgress.findOneAndUpdate(
      { userId, problemId },
      { $set: { revision } },
      { upsert: true, new: true }
    );
    return progress;
  }
};
