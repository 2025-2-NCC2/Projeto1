import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "",
  });

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!formData.tipoUsuario) {
      alert("Selecione o tipo de usuário!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          password: formData.senha,
          type: formData.tipoUsuario, // precisa bater com o ENUM do banco
        }),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        // Após cadastro bem-sucedido

        switch (formData.tipoUsuario) {
          case "Administrador":
            navigate("/login/admin");
            break;
          case "Mentor":
            navigate("/login/mentor");
            break;
          case "Colaborador":
            navigate("/login/colaborador");
            break;
          default:
            navigate("/login"); // fallback
        }
      } else {
        const data = await response.json();
        alert("Erro: " + data.error);
      }
    } catch (err) {
      alert("Erro na conexão: " + err.message);
    }

    // Limpar formulário
    setFormData({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      tipoUsuario: "",
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome completo</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              name="senha"
              className="form-control"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar senha</label>
            <input
              type="password"
              name="confirmarSenha"
              className="form-control"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tipoUsuario" className="form-label">
              Tipo de usuário
            </label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              className="form-select"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Mentor">Mentor</option>
              <option value="Colaborador">Colaborador</option>
              <option value="Administrador">Administrador</option>
            </select>
            <div className="form-text">
              Escolha o que representa o seu papel no projeto.
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
