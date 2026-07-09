import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';
import { sendSuccess } from '../utils/responseFormatter';
import { AppError } from '../utils/AppError';

export const getOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getOverview();
    return sendSuccess(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const getCompanyAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getCompanyAnalytics(req.params.slug as string);
    if (!data) {
      throw new AppError('Company not found', 404);
    }
    return sendSuccess(res, 200, data);
  } catch (error) {
    next(error);
  }
};
