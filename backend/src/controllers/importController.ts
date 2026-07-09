import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/responseFormatter';
import { runImportTask } from '../scripts/importLogic';

export const importGithubData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await runImportTask();
    return sendSuccess(res, 200, summary, 'Import completed successfully');
  } catch (error) {
    next(error);
  }
};
