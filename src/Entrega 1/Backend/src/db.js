import "dotenv/config"; // Carrega variáveis do .env
import mysql from "mysql2/promise"; // Importa MySQL com suporte a Promises

// Cria um pool de conexões com o banco de dados
const pool = await mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
});

console.log("Usuário:", process.env.MYSQL_USER);
console.log("Senha:", process.env.MYSQL_PASSWORD);

export default pool;
