import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const name = 'Administrador';
  const email = 'admin@auria.com';
  const plain = 'Admin@123'; // troque depois
  const hash = await bcrypt.hash(plain, 10);

  console.log({ name, email, hash }); // ✅ log para verificar os dados

  const [exists] = await conn.execute('SELECT id FROM users WHERE email=?', [email]);
  if (exists.length) {
    console.log('Admin já existe:', email);
    await conn.end();
    return;
  }

 await conn.execute(
  `INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at)
   VALUES (?, ?, ?, "admin", 1, NOW(), NOW())`,
  [name, email, hash]
);


  console.log('✅ Admin criado:', email, 'senha:', plain);
  await conn.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
