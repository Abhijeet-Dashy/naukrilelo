import { Router } from 'express';
import { getProblems, getProblemById } from '../controllers/problemController';
import { validateRequest } from '../middlewares/validateRequest';
import { problemQueryValidator } from '../validators';

const router = Router();

router.get('/', problemQueryValidator, validateRequest, getProblems);
router.get('/:id', getProblemById);

export default router;
