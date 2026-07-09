import { Router } from 'express';
import { getOverview, getCompanyAnalytics } from '../controllers/analyticsController';

const router = Router();

router.get('/overview', getOverview);
router.get('/company/:slug', getCompanyAnalytics);

export default router;
