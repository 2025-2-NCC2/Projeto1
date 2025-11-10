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
          default:
            navigate("/login"); 
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
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-3" style={{
      background: "linear-gradient(135deg, #e8f5e9 0%, #3a533b 35%, #b2dfdb 100%)",
      minHeight: "100vh"
    }}>
      <div
        className="card p-4 p-md-5 shadow-lg rounded-4 w-100"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4" style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)'}}>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nome completo</label>
            <input
              type="text"
              name="nome"
              className="form-control p-2"
              placeholder="Digite seu nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">E-mail</label>
            <input
              type="email"
              name="email"
              className="form-control p-2"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Senha</label>
            <input
              type="password"
              name="senha"
              className="form-control p-2"
              placeholder="Digite uma senha segura"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirmar senha</label>
            <input
              type="password"
              name="confirmarSenha"
              className="form-control p-2"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tipoUsuario" className="form-label fw-semibold">
              Tipo de usuário
            </label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              className="form-select p-2"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Mentor">Mentor</option>
              <option value="Colaborador">Colaborador</option>
              <option value="Administrador">Administrador</option>
            </select>
            <small className="form-text text-muted d-block mt-1">
              Escolha o que representa o seu papel no projeto.
            </small>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-semibold py-2">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
