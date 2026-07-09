import { Router } from 'express';
import { getCompanies, getCompanyBySlug } from '../controllers/companyController';
import { validateRequest } from '../middlewares/validateRequest';
import { companyQueryValidator } from '../validators';

const router = Router();

router.get('/', companyQueryValidator, validateRequest, getCompanies);
router.get('/:slug', getCompanyBySlug);

export default router;
