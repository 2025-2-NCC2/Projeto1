import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  if(localStorage.getItem('token')){
    localStorage.removeItem('token');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro no login");
        return;
      }
      //console.log(data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", data.user.type);
      console.log(data);

      switch (data.user.type) {
        case "Administrador":
          localStorage.setItem("id", data.user.id);
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("idGroup", data.group.idGroup);
          localStorage.setItem("foodGoal", data.group.foodGoal);
          localStorage.setItem("groupName", data.group.groupName);
          localStorage.setItem("monetaryTarget", data.group.monetaryTarget);
          navigate("/admin/painel");
          break;
        case "Mentor":
          /* console.log(data.user.id); */
          localStorage.setItem("id", data.user.id);
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("idGroup", data.group.idGroup);
          localStorage.setItem("foodGoal", data.group.foodGoal);
          localStorage.setItem("groupName", data.group.groupName);
          localStorage.setItem("monetaryTarget", data.group.monetaryTarget);
          navigate("/mentor/painel");
          break;
        case "Colaborador":
          localStorage.setItem("id", data.user.id);
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("idGroup", data.group.idGroup);
          localStorage.setItem("currentFoodCollection", data.user.currentFoodCollection)
          localStorage.setItem("currentMoneyCollection", data.user.currentMoneyCollection)
          /* localStorage.setItem("mentorGroupId", data.user.id); */
          navigate("/colaborador/painel");
          break;
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Erro ao conectar ao servidor.");
    }
  };

  const handleForgot = async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:3000/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  console.log(data);

  if (data.resetLink) {
    // redireciona direto para a página de redefinição
    window.location.href = data.resetLink;
  } else {
    alert(data.message);
  }
};

  return (
    <div className="d-flex justify-content-center align-items-center vh-100"style={{
    background:
      "linear-gradient(135deg, #e8f5e9 0%, #3a533b 35%, #b2dfdb 100%)"}}>
  <div
    className="d-flex flex-column flex-md-row shadow-lg rounded-4 overflow-hidden"
    style={{
      maxWidth: "950px",
      width: "100%",
      backgroundColor: "#fff",
    }}
  >
    {/* Box da esquerda — login */}
    <div
      className="d-flex flex-column justify-content-center p-5"
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <h2 className="text-center mb-4 fw-bold " style={{color: '#5b5b5b'}}>Bem-vindo ao Áuria</h2>

      <form onSubmit={handleLogin} className="d-flex flex-column gap-4">
        <div>
          <label className="form-label text-muted small">E-mail</label>
          <input
            type="email"
            className="form-control p-3 rounded-3 border-success-subtle"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="form-label text-muted small">Senha</label>
          <input
            type="password"
            className="form-control p-3 rounded-3 border-success-subtle"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn fw-semibold text-white py-3 rounded-3"
          style={{
            background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
            border: "none",
            transition: "0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #388e3c, #81c784)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #2e7d32, #66bb6a)")
          }
        >
          Entrar
        </button>
      </form>

      {erro && <p className="text-danger mt-3">{erro}</p>}

      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-success text-decoration-none">
          Esqueceu sua senha?
        </Link>
      </div>
    </div>

    {/* Box da direita — verde clean e moderna */}
    <div
      className="d-flex flex-column justify-content-center align-items-center text-white p-5"
      style={{
        flex: 1,
        background: "linear-gradient(135deg, #43a047 0%, #81c784 100%)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15), transparent 70%)",
        }}
      ></div>

      <div className="position-relative text-center" style={{ maxWidth: "320px" }}>
        <h3 className="fw-bold mb-3" style={{color: '#e9e9e9'}}>Saúde e Equilíbrio</h3>
        <p className="mb-4 opacity-75">
          Viva uma experiência que conecta corpo, mente e energia. Com o Áuria, você
          trilha o caminho do bem-estar de forma inteligente e inspiradora.
        </p>
        <div
          style={{
            height: "4px",
            width: "60px",
            backgroundColor: "rgba(255,255,255,0.6)",
            borderRadius: "2px",
            margin: "0 auto",
          }}
        ></div>
      </div>
    </div>
  </div>
</div>
  );
}
