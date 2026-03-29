import express from 'express';
import authRoutes from './authRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import problemRoutes from './problemRoutes.js';
import submissionRoutes from './submissionRoutes.js';
import aiRoutes from './aiRoutes.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to all API routes
router.use(apiLimiter);

// Mount routes
router.use('/auth', authRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/problems', problemRoutes);
router.use('/submissions', submissionRoutes);
router.use('/ai', aiRoutes);

export default router;
