import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { getMe, updateProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/update', auth, updateProfile);

export default router;
