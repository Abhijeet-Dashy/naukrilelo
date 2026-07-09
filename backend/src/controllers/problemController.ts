import { Request, Response, NextFunction } from 'express';
import { problemService } from '../services/problemService';
import { sendSuccess } from '../utils/responseFormatter';

export const getProblems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await problemService.getProblems(req.query);
    return sendSuccess(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await problemService.getProblemById(req.params.id as string);
    return sendSuccess(res, 200, data);
  } catch (error) {
    next(error);
  }
};
