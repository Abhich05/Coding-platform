import express from 'express';
import {
  submitCode,
  getCandidateSubmissions,
  getAssessmentSubmissions,
  completeAssessment,
  flagActivity,
  getSubmissionResult
} from '../controllers/submissionController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (for candidates)
router.post('/', submitCode);
router.get('/result/:submissionMongoId', getSubmissionResult);
router.post('/complete', completeAssessment);
router.post('/flag', flagActivity);
router.get('/assessment/:assessmentId/candidate/:email', getCandidateSubmissions);

// Protected routes (for recruiters)
router.get('/assessment/:assessmentId', authenticate, getAssessmentSubmissions);

export default router;
