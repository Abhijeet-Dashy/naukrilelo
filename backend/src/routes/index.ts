import { Router } from 'express';
import companyRoutes from './companyRoutes';
import problemRoutes from './problemRoutes';
import analyticsRoutes from './analyticsRoutes';
import importRoutes from './importRoutes';
import authRoutes from './authRoutes';
import progressRoutes from './progressRoutes';

const router = Router();

router.use('/companies', companyRoutes);
router.use('/problems', problemRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/import', importRoutes);
router.use('/auth', authRoutes);
router.use('/progress', progressRoutes);

export default router;
