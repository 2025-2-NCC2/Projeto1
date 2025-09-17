// src/middlewares/auth.js
import jwt from 'jsonwebtoken';

export function ensureAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token ausente' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

export function ensureAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Acesso negado' });
  next();
}

export function ensureAuthOptional(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return next();
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch {}
  return next();
}
