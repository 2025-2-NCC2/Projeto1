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

//GET http://localhost:3000/api/groups/:id (?)
r.get("/groups/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, members, monetary_target, food_goal, current_food_collection, current_money_collection FROM groups WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }
    res.json(rows[0]); // Retorna o usuário encontrado
  } catch {
    res.status(500).json({ error: "Erro ao Buscar Usuário" });
  }
});

//GET http://localhost:3000/api/user/groups/:id (?)
r.get("/user/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at, current_money_collection, current_food_collection, status FROM users WHERE group_id = ?",
      [groupId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }
    res.json(rows); // Retorna o usuário encontrado
  } catch(err) {
    res.status(500).json({ error: err.message });
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

//POST - http://localhost:3000/api/images
//Body - form-data - key: image (File)
//Inserir Imagem
r.post('/images', upload.single('image'), async(req, res)=>{
  try{
      const filepath = req.file.path
      await pool.execute("INSERT INTO images (img) VALUES (?)", [filepath])
      res.status(201).json({message: "Imagem enviada com sucesso!", img:filepath})
  } catch (error){
      res.status(500).json({error: error.message})
  }
})
//GET - http://localhost:3000/api/images
//Retornar a lista com o ID e o caminho da imagem
//Listar Imagem
r.get('/images', async(req, res)=>{
  try{
      const [rows] = await pool.execute("SELECT * FROM images")
      res.status(200).json(rows)
  } catch (error){
      res.status(500).json({error: error.message})
  }
})
//PUT - http://localhost:3000/api/images/1
//Body - form-data - key: image (File)
//Atualizar Imagem
r.put('/images/:id', upload.single('image'), async(req, res)=>{
  try{
      const{id} = req.params
      const newPath = req.file.path
      const [old] = await pool.execute("SELECT * FROM images WHERE id =?", [id])
      if (old.length === 0) return res.status(404).json({error:"Imagem não encontrada!"})
      const oldPath = old[0].img
      await pool.execute("UPDATE images SET img = ? WHERE id =?", [newPath, id])
      fs.unlink(oldPath, (err) =>{
          if(err) console.warn("Erro ao Remover:", err)
      })
      res.json({message: "Imagem Atualizada com sucesso!", img:newPath})
  } catch (error){
      res.status(500).json({error: error.message})
  }
})
//DELETE - http://localhost:3000/api/images/1
//Remove a imagem com o Id selecionado e do disco
//Deletar Imagem
r.delete('/images/:id', async(req, res)=>{
  try{
      const {id} = req.params
      const [rows] = await pool.execute("SELECT * FROM images WHERE id = ?", [id])
      if (rows.length === 0) return res.status(404).json({error:"Imagem não encontrada!"})
      const filePath = rows[0].img
      await pool.execute("DELETE FROM images WHERE id =?", [id])
      fs.unlink(filePath, (err) =>{
          if(err) console.warn("Erro ao Remover:", err)
      })
      res.json({message: "Imagem excluída com sucesso!"})
  } catch (error){
      res.status(500).json({error: error.message})
  }
})

export default r;
