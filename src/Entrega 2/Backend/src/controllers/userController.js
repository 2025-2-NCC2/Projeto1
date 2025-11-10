import db from "../db.js";
import bcrypt from "bcrypt";

export const profile = async (req, res) => {
  try {
  const [rows] = await db.query(
  'SELECT id, name, email, created_at FROM users WHERE id = ?',
  [req.user.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' })
    return res.json(rows[0])
    } catch (err) {
    console.error('profile error:', err)
    return res.status(500).json({ error: 'Erro ao buscar perfil' })
  }
}


// Atualizar usuário (sem alterar e-mail). Permite name e/ou password.
export const updateMe = async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  if (!name && !newPassword) {
    return res
      .status(400)
      .json({ error: "Envie ao menos name ou newPassword" });
  }
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (!rows.length)
      return res.status(404).json({ error: "Usuário não encontrado" });
    const user = rows[0];
    const updates = [];
    const params = [];
    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ error: "Envie currentPassword para trocar a senha" });
      }
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      updates.push("password = ?");
      params.push(hashed);
    }
    if (!updates.length) {
      return res.status(400).json({ error: "Nada para atualizar" });
    }
    params.push(req.user.id);
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    await db.query(sql, params);
    const [fresh] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    return res.json(fresh[0]);
  } catch (err) {
    console.error("updateMe error:", err);
    return res.status(500).json({ error: "Erro ao atualizar" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (parseInt(id, 10) !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Você só pode deletar a sua própria conta" });
  }
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return res.json({ message: "Conta deletada com sucesso" });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};

export const createMember = async (req, res) => {
  console.log('Requisição recebida:', {
    ...req.body,
    password: req.body.password ? '[REDACTED]' : undefined
  });

  const { nome, email, tipo, groupId, invitedByUserId } = req.body;

  // Validação básica
  if (!nome || !email || !tipo || !groupId) {
    return res.status(400).json({ 
      error: "Campos obrigatórios faltando",
      required: ["nome", "email", "tipo", "groupId"]
    });
  }

  // Valida formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Formato de email inválido" });
  }

  try {
    // Verifica se email já existe
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Verifica se o grupo existe
    const [groups] = await db.query(
      "SELECT id FROM `groups` WHERE id = ?",
      [groupId]
    );

    if (groups.length === 0) {
      return res.status(400).json({ error: "Grupo não encontrado" });
    }

    // Capitaliza o primeiro caractere do tipo
    const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
    
    // Gera uma senha aleatória de 8 caracteres
    const tempPassword = 'admin123';
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    // Insere o novo membro
    const [result] = await db.query(
      `INSERT INTO users (name, email, type, status, group_id, password) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, tipoCapitalizado,1 , groupId, hashedPassword]
    );
    
    // Log da senha temporária (em produção, deveria ser enviada por email)
    console.log(`Senha temporária para ${email}: ${tempPassword}`);

    // Log do sucesso (sem expor dados sensíveis)
    console.log(`Novo membro criado: ID ${result.insertId}`);

    return res.status(201).json({ 
      message: "Membro registrado com sucesso",
      userId: result.insertId,
      password: tempPassword
    });

  } catch (error) {
    // Log do erro (para debug)
    console.error("Erro ao criar membro:", error);
    
    // Resposta amigável ao usuário
    res.status(500).json({ 
      error: "Erro ao registrar membro",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
