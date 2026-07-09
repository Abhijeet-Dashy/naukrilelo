import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { sendSuccess } from '../utils/responseFormatter';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.register(req.body);
    return sendSuccess(res, 201, data, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body);
    return sendSuccess(res, 200, data, 'User logged in successfully');
  } catch (error) {
    next(error);
  }
};
