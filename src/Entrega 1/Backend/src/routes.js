import { json, Router } from "express"; // Importa Express e Router
import { pool } from "./db.js"; // Importa pool de conexões com MySQL
import bcrypt from 'bcrypt'; // Para criptografar senhas
import jwt from 'jsonwebtoken'; // Para gerar tokens JWT

const r = Router(); // Cria instância de rotas


//GET http://localhost:3000/api/db/health
r.get("/db/health", async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS db_ok");
    res.json({ ok: true, db: rows[0].db_ok }); // Retorna sucesso se o banco responder
  } catch (error) {
    res.status(500).json({ erro: error.message, db: "down" }); // Erro se não conseguir conectar
  }
});

//GET http://localhost:3000/api/users/list
r.get("/users/list", async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json({ ok: true, users: rows });
  } catch (error) {
    res.status(500).json({ erro: error.message, db: "down" }); // Erro se não conseguir conectar
  }
});

//GET http://localhost:3000/api/groups/list
r.get("/groups/list", async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM groups");
    res.json({ ok: true, groups: rows });
  } catch (error) {
    res.status(500).json({ erro: error.message, db: "down" }); // Erro se não conseguir conectar
  }
});


//GET http://localhost:3000/api/users

r.post("/users", async (req, res) => {
  const { name, email, password, grupo } = req.body;

  // Validação dos campos obrigatórios
  if (!name || !email || !password || !grupo) {
    return res.status(400).json({ error: "name, email e password são obrigatórios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha

    // Insere o usuário no banco
    const [ins] = await pool.query(
      "INSERT INTO users (name, email, grupo) VALUES (?, ?, ?)",
      [name, email, grupo]
    );
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at, grupo FROM users WHERE id = ?",
      [ins.insertId]
    );

    res.status(201).json(rows[0]); // Retorna o usuário criado
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "email já cadastrado" }); // Email duplicado
    }
    res.status(500).json({ error: err.code }); // Erro genérico
  }
});


//POST http://localhost:3000/api/users
//Body Json {"name": "Fulano", "email": "fulano@teste.com"}

/* r.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email || !group) {
    return res.status(400).json({ error: "name e email obrigatórios" });
  }
  try {
    const [ins] = await pool.query(
      "INSERT INTO users (name, email, grupo) VALUES (?, ?, ?)",
      [name, email, grupo]
    );
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at, grupo FROM users WHERE id = ?",
      [ins.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "email já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
}); */

//GET http://localhost:3000/api/users/1 (?)
// Buscar Usuário específico

r.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(rows[0]); // Retorna o usuário encontrado
  } catch {
    res.status(500).json({ error: "Erro ao Buscar Usuário" });
  }
});
//PUT http://localhost:3000/api/users/1 (?)

r.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "name e email obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE users SET name=?, email=? WHERE id=?",
      [name, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id=?",
      [id]
    );

    res.json(rows[0]); // Retorna o usuário atualizado
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

//DELETE http://localhost:3000/api/users/1 (?)

r.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id =?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json({ message: "Usuário excluído com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir um usuário" });
  }
});

//GET http://localhost:3000/api/pokemon/pikachu

r.get("/pokemon/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`);
    console.log("resposta api", resp.status, resp.statusText);

    if (!resp.ok)
      return res.status(404).json({ error: "Pokemon não encontrado" });

    const data = await resp.json();
    res.json({
      id: data.id,
      name: data.name,
      types: data.types.map((t) => t.type.name),
    });
  } catch {
    res.status(500).json({ error: "Erro ao consultar uma API externa" });
  }
});



// POST http://localhost:3000/api/login

r.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email e password são obrigatórios' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      'seuSegredoJWT', // Use variável de ambiente em produção
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login bem-sucedido', token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao validar login' });
  }
});


export default r;
