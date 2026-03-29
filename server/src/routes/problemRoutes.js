import express from 'express';
import {
  createProblem,
  getProblems,
  getProblem,
  updateProblem,
  deleteProblem
} from '../controllers/problemController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.route('/')
  .get(getProblems)
  .post(authorize('recruiter', 'admin'), createProblem);

router.route('/:id')
  .get(getProblem)
  .put(authorize('recruiter', 'admin'), updateProblem)
  .delete(authorize('recruiter', 'admin'), deleteProblem);

export default router;
