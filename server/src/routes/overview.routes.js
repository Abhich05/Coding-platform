import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { getStats } from '../controllers/overview.controller.js';

const router = express.Router();

router.get('/stats', auth, getStats);

export default router;
