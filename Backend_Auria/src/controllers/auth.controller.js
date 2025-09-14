import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export async function registerStudent(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'name, email e password são obrigatórios' });

  const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (exists.length) return res.status(400).json({ message: 'Email já cadastrado' });

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?, "student")',
    [name, email, hash]
  );
  res.status(201).json({ message: 'Aluno cadastrado com sucesso' });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'email e password são obrigatórios' });

  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?',
    [email]
  );
  const user = rows[0];
  if (!user || !user.is_active) return res.status(401).json({ message: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '8h' }
  );
  res.json({ token });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
