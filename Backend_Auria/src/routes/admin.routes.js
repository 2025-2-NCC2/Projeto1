// src/routes/admin.routes.js
import { Router } from 'express';
import { ensureAuth, ensureAdmin } from '../middlewares/auth.js';
import { createAdminInvite, createMentorInvite } from '../controllers/roles.controller.js';

const router = Router();

// Somente admin autenticado pode gerar convites
router.post('/role-invites/admin', ensureAuth, ensureAdmin, createAdminInvite);
router.post('/role-invites/mentor', ensureAuth, ensureAdmin, createMentorInvite);

export default router;
