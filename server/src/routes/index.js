import express from 'express';
import authRoutes from './authRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import problemRoutes from './problemRoutes.js';
import submissionRoutes from './submissionRoutes.js';
import aiRoutes from './aiRoutes.js';
import authNewRoutes from './auth.routes.js';
import jobRoutes from './jobs.routes.js';
import overviewRoutes from './overview.routes.js';
import profileRoutes from './profile.routes.js';
import testRoutes from './tests.routes.js';
import adminRoutes from './admin.routes.js';
import aptitudeRoutes from './aptitude.routes.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to all API routes
router.use(apiLimiter);

// Mount routes
router.use('/auth', authRoutes);
router.use('/user', authNewRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/problems', problemRoutes);
router.use('/submissions', submissionRoutes);
router.use('/ai', aiRoutes);
router.use('/jobs', jobRoutes);
router.use('/overview', overviewRoutes);
router.use('/profile', profileRoutes);
router.use('/tests', testRoutes);
router.use('/admin', adminRoutes);
router.use('/aptitude', aptitudeRoutes);

export default router;
