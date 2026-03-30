import express from 'express';
import { getJobs, applyJob, createJob } from '../controllers/job.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getJobs);
router.post('/', auth, createJob);
router.post('/:id/apply', auth, applyJob);

export default router;
