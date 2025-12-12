import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  userLogin,
  userRegistration
} from '../controller/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', userRegistration);
router.post('/login', userLogin);

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

export default router;