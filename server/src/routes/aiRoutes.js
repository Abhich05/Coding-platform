import express from 'express';
import {
  generateProblem,
  generateTestCases,
  enhanceDescription,
} from '../controllers/aiController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/generate-problem', authenticate, generateProblem);
router.post('/generate-testcases', authenticate, generateTestCases);
router.post('/enhance-description', authenticate, enhanceDescription);

export default router;
