import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginAdmin.css"; // Reutilizando o mesmo CSS do LoginColab

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://auriadb.vercel.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login bem-sucedido!");
        console.log("Token JWT:", data.token);
        navigate("/");
      } else {
        alert(data.error || "Email ou senha incorretos!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login Admin</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Link to="/cadastro" className="link-cadastro">
            Não possui cadastro? Cadastre-se
          </Link>
          <div className="form-actions">
            <button type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;
