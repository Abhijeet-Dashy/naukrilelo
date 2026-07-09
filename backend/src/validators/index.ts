import { query } from 'express-validator';

export const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
];

export const companyQueryValidator = [
  ...paginationValidator,
  query('search').optional().isString(),
  query('sort').optional().isIn(['newest', 'oldest', 'problems_desc']),
];

export const problemQueryValidator = [
  ...paginationValidator,
  query('search').optional().isString(),
  query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  query('topic').optional().isString(),
  query('company').optional().isString(),
  query('isPremium').optional().isBoolean(),
  query('sort').optional().isIn(['newest', 'oldest', 'alphabetical', 'frequency']),
];
