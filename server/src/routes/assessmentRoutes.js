import express from 'express';
import {
  createAssessment,
  getAssessments,
  getAssessment,
  getAssessmentPublic,
  getAssessmentForCandidate,
  startAssessment,
  updateAssessment,
  deleteAssessment,
  addCandidate,
  getAssessmentStats
} from '../controllers/assessmentController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes — must be before authenticate middleware
router.get('/:id/public', getAssessmentPublic);
router.get('/:id/candidate', getAssessmentForCandidate);
router.post('/:id/start', startAssessment);

// All routes below require authentication
router.use(authenticate);

router.route('/')
  .get(getAssessments)
  .post(authorize('recruiter', 'admin'), createAssessment);

router.route('/:id')
  .get(getAssessment)
  .put(authorize('recruiter', 'admin'), updateAssessment)
  .delete(authorize('recruiter', 'admin'), deleteAssessment);

router.post('/:id/candidates', authorize('recruiter', 'admin'), addCandidate);
router.get('/:id/stats', getAssessmentStats);

export default router;
