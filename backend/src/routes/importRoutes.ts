import { Router } from 'express';
import { importGithubData } from '../controllers/importController';

const router = Router();

router.post('/github', importGithubData);

export default router;
