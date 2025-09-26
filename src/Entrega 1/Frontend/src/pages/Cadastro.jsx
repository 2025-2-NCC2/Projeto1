import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css"; // Reutilizando o mesmo CSS

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("2")
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    console.log(nome, email, password, userType);
    try {
      const response = await fetch("https://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, email, password, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/login-colab"); // ou /login-admin
      } else {
        alert(data.error || "Erro ao cadastrar usuário.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Cadastro</h2>
        <form onSubmit={handleCadastro}>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
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
            <Link to="/login-admin" className="link-cadastro">
              Já possui cadastro? Faça login
            </Link>
          <div className="form-actions">
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
