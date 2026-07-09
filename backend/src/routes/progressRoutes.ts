import { Router } from 'express';
import { getProgress, toggleSolved, toggleRevision } from '../controllers/progressController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect); // Protect all progress routes

router.get('/', getProgress);
router.post('/solved', toggleSolved);
router.post('/revision', toggleRevision);

export default router;
