// src/routes/auth.routes.js
import { Router } from 'express';
import { register, registerAdmin, registerMentor, login, me } from '../controllers/auth.controller.js';
import { ensureAuth, ensureAuthOptional } from '../middlewares/auth.js';

const router = Router();

router.post('/register', ensureAuthOptional, register);             // body.role: 'student' | 'mentor' | 'admin'
router.post('/register/admin', ensureAuthOptional, registerAdmin);  // allows with token admin OR inviteCode
router.post('/register/mentor', ensureAuthOptional, registerMentor);

router.post('/login', login);
router.get('/me', ensureAuth, me);

export default router;
