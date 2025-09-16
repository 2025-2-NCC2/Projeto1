// src/controllers/roles.controller.js
import crypto from 'crypto';
import { pool } from '../config/db.js';

async function createInvite(role, email, expiresInHours, creatorId) {
  const code = crypto.randomBytes(24).toString('base64url');
  const expiresAt = expiresInHours ? new Date(Date.now() + Number(expiresInHours) * 3600 * 1000) : null;

  await pool.query(
    'INSERT INTO role_invites (code, role, email, created_by_user_id, expires_at) VALUES (?,?,?,?,?)',
    [code, role, email || null, creatorId, expiresAt]
  );

  return { code, role, email: email || null, expiresAt };
}

// POST /admin/role-invites/admin
export async function createAdminInvite(req, res) {
  const { email, expiresInHours = 168 } = req.body; // padrão 7 dias
  const creatorId = req.user.id;
  const invite = await createInvite('admin', email, expiresInHours, creatorId);
  return res.status(201).json(invite);
}

// POST /admin/role-invites/mentor
export async function createMentorInvite(req, res) {
  const { email, expiresInHours = 168 } = req.body;
  const creatorId = req.user.id;
  const invite = await createInvite('mentor', email, expiresInHours, creatorId);
  return res.status(201).json(invite);
}
