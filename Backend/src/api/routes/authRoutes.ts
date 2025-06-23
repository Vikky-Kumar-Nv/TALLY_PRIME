import { Router } from 'express';
import { loginHandler, register, resetPassword } from '../controllers/authController';

const router = Router();

// Authentication routes
router.post('/login', loginHandler);
router.post('/register', register);
router.post('/reset-password', resetPassword);

export default router;
