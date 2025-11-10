import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMsg(data.message || "Verifique seu e-mail para redefinir a senha.");
    } catch (err) {
      setMsg("Erro ao enviar e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-3" style={{
      background: "linear-gradient(135deg, #e8f5e9 0%, #3a533b 35%, #b2dfdb 100%)",
      minHeight: "100vh"
    }}>
      <div className="card p-4 p-md-5 shadow-lg rounded-4 w-100" style={{ maxWidth: "500px" }}>
        <h3 className="mb-4 text-center" style={{fontSize: 'clamp(1.25rem, 4vw, 1.75rem)'}}>Recuperar Senha</h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="email" className="form-label fw-semibold">E-mail cadastrado</label>
            <input
              id="email"
              type="email"
              className="form-control p-2"
              placeholder="voce@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button 
            className="btn btn-success w-100 fw-semibold py-2" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </button>
          {msg && <p className="mt-3 text-center small">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
