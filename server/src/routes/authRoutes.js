import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  updateProfile
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);
router.put('/profile', authenticate, updateProfile);

export default router;
