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
    <div className="reset-container">
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Redefinir</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
