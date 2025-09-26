import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Reutilizando o mesmo CSS do LoginColab

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("0"); // 0 = Admin, 1 = Mentor, 2 = Grupo
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType }),
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
        <h2>Login</h2>
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

          <div className="container-radio">
            <label className="label-form">Tipo de usuário:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="0"
                  checked={userType === "0"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="1"
                  checked={userType === "1"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Mentor
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="2"
                  checked={userType === "2"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Grupo
              </label>
            </div>
          </div>
          <hr />
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

export default Login;
