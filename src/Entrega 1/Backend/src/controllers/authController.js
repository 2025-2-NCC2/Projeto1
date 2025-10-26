import pool from "../db.js";
import bcrypt from "bcrypt";
import { createToken, denyToken } from "../services/tokenService.js";

const sanitizeUser = (u) => ({ id: u.id, name: u.name, email: u.email });

export const register = async (req, res) => {
  const { name, email, password, type } = req.body;
  if (!name || !email || !password || !type) {
    return res
      .status(400)
      .json({ error: "Envie name, email, password e type" });
  }

  try {
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (exists.length)
      return res.status(409).json({ error: "E-mail já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, `type`) VALUES (?, ?, ?, ?)",
      [name, email, hashed, type]
    );

    return res.status(201).json({ id: result.insertId, name, email, type });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: err });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ error: "Usuário não encontrado" });

    const user = rows[0];

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) return res.status(401).json({ error: "Senha inválida" });

    const userType = user.type || "Colaborador";

    const { token, jti } = createToken({
      id: user.id,
      email: user.email,
      type: userType,
    });

    return res.json({
      jti,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: userType,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro no login" });
  }
};

// Logout: revoga o token atual (via jti em denylist)
export const logout = async (req, res) => {
  try {
    const { jti } = req.user;
    denyToken(jti);
    return res.json({ message: "Logout realizado com sucesso" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ error: "Erro no logout" });
  }
};

// Esqueci minha senha (versão didática)
export const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ error: "Envie email e newPassword" });

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE email = ?", [
      hashed,
      email,
    ]);

    // Mensagem genérica: não revela se e-mail existe
    return res.json({
      message: "Se o e-mail existir, a senha foi redefinida.",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ error: "Erro ao redefinir senha" });
  }
};
