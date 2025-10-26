import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CollaboratorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login bem-sucedido!");
        console.log("Token JWT:", data.token);
        navigate("/colaborador/painel", { replace: true });
      } else {
        alert(data.error || "Email ou senha incorretos!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 mb-3">Entrar como colaborador</h1>

              <form noValidate onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="colab-email" className="form-label">E-mail</label>
                  <input
                    id="colab-email"
                    type="email"
                    className="form-control"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="colab-senha" className="form-label">Senha</label>
                  <input
                    id="colab-senha"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>
                  Entrar
                </button>
              </form>
            </div>
          </div>
          <p style={{fontSize: '1.1rem'}} className="text-center text-primary text-sm mt-3 mb-0">
            © {new Date().getFullYear()} Auria
          </p>
        </div>
      </div>
    </div>
  )
}