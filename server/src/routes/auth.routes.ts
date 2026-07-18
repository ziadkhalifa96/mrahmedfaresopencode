import { Router } from 'express';
import { register, login, refreshToken, logout, getMe, updateProfile, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../validators/auth.validator';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
