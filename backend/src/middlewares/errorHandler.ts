import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/responseFormatter';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message, err.stack);

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    return sendError(res, 400, 'Validation Error', err);
  }

  // Handle Mongoose Duplicate Key Error
  if ((err as any).code === 11000) {
    return sendError(res, 400, 'Duplicate Field Value Entered');
  }

  // Default server error
  return sendError(res, 500, 'Internal Server Error');
};
