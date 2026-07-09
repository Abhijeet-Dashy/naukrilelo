import { Request, Response, NextFunction } from 'express';
import { progressService } from '../services/progressService';
import { sendSuccess } from '../utils/responseFormatter';

export const getProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await progressService.getProgress(req.user._id);
    return sendSuccess(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const toggleSolved = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problemId, solved } = req.body;
    const data = await progressService.toggleSolved(req.user._id, problemId, solved);
    return sendSuccess(res, 200, data, 'Solved status updated');
  } catch (error) {
    next(error);
  }
};

export const toggleRevision = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problemId, revision } = req.body;
    const data = await progressService.toggleRevision(req.user._id, problemId, revision);
    return sendSuccess(res, 200, data, 'Revision status updated');
  } catch (error) {
    next(error);
  }
};
