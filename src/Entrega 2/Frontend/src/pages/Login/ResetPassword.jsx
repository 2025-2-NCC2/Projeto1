import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3000/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setMsg(data.message || data.error);

    if (res.ok) {
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-3" style={{
      background: "linear-gradient(135deg, #e8f5e9 0%, #3a533b 35%, #b2dfdb 100%)",
      minHeight: "100vh"
    }}>
      <div className="card p-4 p-md-5 shadow-lg rounded-4 w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4" style={{fontSize: 'clamp(1.5rem, 5vw, 2rem)'}}>Redefinir Senha</h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="password" className="form-label fw-semibold">Nova Senha</label>
            <input
              id="password"
              type="password"
              className="form-control p-2"
              placeholder="Digite sua nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 fw-semibold py-2">
            Redefinir Senha
          </button>
        </form>
        {msg && <p className="mt-3 text-center small" style={{color: msg.includes('sucesso') ? 'green' : 'red'}}>{msg}</p>}
      </div>
    </div>
  );
}
