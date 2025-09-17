// scripts/createAdmin.js
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import { pool } from '../src/config/db.js';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
      args[key] = val;
    }
  }
  return args;
}
const normalizeEmail = (e) => String(e || '').trim().toLowerCase();

async function main() {
  const { name, email, password } = parseArgs(process.argv);
  if (!name || !email || !password) {
    console.error('Uso: node scripts/createAdmin.js --name "Admin" --email "admin@auria.local" --password "StrongP@ss1"');
    process.exit(1);
  }
  const normalizedEmail = normalizeEmail(email);

  try {
    await pool.query('SELECT 1');
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    const hash = await bcrypt.hash(password, 10);

    if (rows.length) {
      await pool.query('UPDATE users SET role = "admin", password_hash = ?, is_active = 1 WHERE email = ?', [hash, normalizedEmail]);
      console.log(`✅ Usuário ${normalizedEmail} promovido a admin e senha atualizada.`);
    } else {
      await pool.query('INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?,?,?,?,1)', [name, normalizedEmail, hash, 'admin']);
      console.log(`✅ Admin criado: ${normalizedEmail}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('🔥 Erro:', err);
    process.exit(1);
  }
}
main();
