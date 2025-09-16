// src/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const normalizeEmail = (e) => String(e || '').trim().toLowerCase();

/**
 * Registro genérico com prova de acesso:
 * - student: público
 * - mentor/admin: exige admin autenticado OU inviteCode válido
 *   (Se quiser incluir 'teacher', adicione nas allowedRoles e na tabela users ENUM)
 */
export async function register(req, res) {
  try {
    const { name, email, password, role = 'student', inviteCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email e password são obrigatórios' });
    }

    const requestedRole = String(role).toLowerCase();

    // Ajuste as roles permitidas conforme seu ENUM na tabela users
    const allowedRoles = ['student', 'mentor', 'admin']; // se quiser: ['student','teacher','mentor','admin']
    if (!allowedRoles.includes(requestedRole)) {
      return res.status(400).json({ message: 'Role inválida' });
    }

    const normalizedEmail = normalizeEmail(email);
    const requester = req.user ?? null;
    const roleRequiresProof = requestedRole !== 'student';

    let finalRole = 'student';
    let inviteRow = null;

    if (requester?.role === 'admin') {
      // Admin autenticado pode criar qualquer role
      finalRole = requestedRole;
    } else if (!roleRequiresProof) {
      // student é público
      finalRole = 'student';
    } else {
      // mentor/admin precisam de convite se quem chama NÃO é admin
      if (!inviteCode) {
        return res.status(403).json({ message: `Convite obrigatório para role ${requestedRole}` });
      }

      const [rows] = await pool.query(
        `SELECT id, role, email, expires_at, used_at
           FROM role_invites
          WHERE code = ?`,
        [inviteCode]
      );

      inviteRow = rows?.[0] || null;
      if (!inviteRow) {
        return res.status(403).json({ message: 'Convite inválido' });
      }
      if (inviteRow.used_at) {
        return res.status(403).json({ message: 'Convite já utilizado' });
      }
      if (inviteRow.role !== requestedRole) {
        return res.status(403).json({ message: 'Convite não corresponde à role solicitada' });
      }
      if (inviteRow.email && normalizeEmail(inviteRow.email) !== normalizedEmail) {
        return res.status(403).json({ message: 'Convite não é para este e-mail' });
      }
      if (inviteRow.expires_at && new Date(inviteRow.expires_at) < new Date()) {
        return res.status(403).json({ message: 'Convite expirado' });
      }

      finalRole = requestedRole;
    }

    // Transação: cria usuário e consome o convite (se houver)
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Checa duplicidade de e-mail
      const [exists] = await conn.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
      if (exists.length) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      const hash = await bcrypt.hash(password, 10);
      const [ins] = await conn.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)',
        [name, normalizedEmail, hash, finalRole]
      );
      const newUserId = ins.insertId;

      if (inviteRow && finalRole !== 'student') {
        // Consumir o convite garantindo que não foi usado (evita condição de corrida)
        const [upd] = await conn.query(
          'UPDATE role_invites SET used_at = NOW(), used_by_user_id = ? WHERE id = ? AND used_at IS NULL',
          [newUserId, inviteRow.id]
        );
        if (upd.affectedRows === 0) {
          throw new Error('Falha ao consumir o convite (concorrência). Tente novamente.');
        }
      }

      await conn.commit();
      conn.release();

      return res.status(201).json({ message: `Usuário cadastrado como ${finalRole}` });
    } catch (errTx) {
      try { await conn.rollback(); } catch {}
      try { conn.release(); } catch {}
      console.error(errTx);
      return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
  } catch (err) {
    // Trata UNIQUE (duplicate key)
    if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Erro interno no registro' });
  }
}

// Wrappers dedicados: fixam a role e reutilizam o register()
export async function registerAdmin(req, res) {
  req.body = { ...req.body, role: 'admin' };
  return register(req, res);
}

export async function registerMentor(req, res) {
  req.body = { ...req.body, role: 'mentor' };
  return register(req, res);
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email e password são obrigatórios' });
  }

  const normalizedEmail = normalizeEmail(email);
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?',
    [normalizedEmail]
  );

  const user = rows[0];
  if (!user || !user.is_active) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '8h' }
  );

  return res.json({ token });
}

export async function me(req, res) {
  // req.user é populado pelo middleware ensureAuth
  return res.json({ user: req.user });
}
