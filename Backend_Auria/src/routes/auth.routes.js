// src/routes/auth.routes.js
import { Router } from 'express';
import { registerStudent, login, me } from '../controllers/auth.controller.js';
import jwt from 'jsonwebtoken';


const router = Router();

function authRequired(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token ausente' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

router.post('/register', registerStudent);
router.post('/login', login);
router.get('/me', authRequired, me);

export default router;
