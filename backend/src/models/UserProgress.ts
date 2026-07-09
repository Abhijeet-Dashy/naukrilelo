import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  solved: boolean;
  revision: boolean;
  notes?: string;
  solvedAt?: Date;
}

const UserProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    solved: { type: Boolean, default: false },
    revision: { type: Boolean, default: false },
    notes: { type: String },
    solvedAt: { type: Date },
  },
  { timestamps: true }
);

// Prevent duplicate entries for the same user and problem
UserProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
