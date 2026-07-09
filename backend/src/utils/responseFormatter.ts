import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
  meta?: any;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  meta?: any
) => {
  const response: SuccessResponse<T> = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any
) => {
  const response: ErrorResponse = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};
