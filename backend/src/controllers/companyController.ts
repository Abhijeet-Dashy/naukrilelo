import { Request, Response, NextFunction } from 'express';
import { companyService } from '../services/companyService';
import { sendSuccess } from '../utils/responseFormatter';

export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.getCompanies(req.query);
    return sendSuccess(res, 200, data);
  } catch (error) {
    next(error);
  }
};

export const getCompanyBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await companyService.getCompanyBySlug(req.params.slug as string);
    return sendSuccess(res, 200, data);
  } catch (error) {
    next(error);
  }
};
