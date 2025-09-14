import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { pool } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conectado ao MySQL');
    app.listen(PORT, () => console.log(`🚀 auria API rodando na porta ${PORT}`));
  } catch (err) {
    console.error('🔥 ERRO AO INICIAR:', err);
    process.exit(1);
  }
}

start();
