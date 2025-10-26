  import { useState } from "react";
  import { useNavigate } from "react-router-dom";

  export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao logar");
        return;
      }

      const userType = data.user?.type; // Proteção mínima

      localStorage.setItem("token", data.token);

      switch (userType) {
        case "Administrador":
          navigate("/admin/painel");
          break;
        case "Colaborador":
          navigate("/colaborador/painel");
          break;
        case "Mentor":
          navigate("/mentor/painel");
          break;
        default:
          alert("Tipo de usuário desconhecido");
      }
    } catch (err) {
      alert("Erro na conexão: " + err.message);
    }
  };


    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h1 className="h4 mb-3">Entrar</h1>

                <form
                  className="needs-validation"
                  noValidate
                  onSubmit={handleLogin}
                >
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder="voce@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">
                      Informe um e-mail válido.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="senha" className="form-label">
                      Senha
                    </label>
                    <input
                      id="senha"
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Informe sua senha.</div>
                  </div>

                  <button className="btn btn-primary w-100" type="submit">
                    <i
                      className="bi bi-box-arrow-in-right me-1"
                      aria-hidden="true"
                    ></i>
                    Entrar
                  </button>
                </form>

                <p className="text-center small text-secondary mt-3 mb-0">
                  Esqueceu a senha? #Recuperar acesso
                </p>
              </div>
            </div>

            <p className="text-center text-secondary small mt-3 mb-0">
              © {new Date().getFullYear()} Auria
            </p>
          </div>
        </div>
      </div>
    );
  }
