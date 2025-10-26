import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function CollaboratorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const primaryColor = "#22B77E";
  const secondaryColor = "#17A2B8";
  const textColor = "#333";

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

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
    <div
      className="container-fluid position-relative p-0"
      style={{
        fontFamily: "Montserrat, Roboto, sans-serif",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Vídeo de background */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(8px) brightness(0.7)", // desfoca e escurece um pouco
          zIndex: 0,
        }}
      >
        <source src="../src/assets/Animação_de_Imagem_com_Movimentos_Naturais (1).mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      {/* Conteúdo do formulário */}
      <div
        className={`container py-5 d-flex align-items-center justify-content-center position-relative`}
        style={{ zIndex: 1, color: textColor, minHeight: "100vh" }}
      >
        <div
          className={`row justify-content-center w-100 transition-all ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{
            transition: "all 1.0s ease",
            transform: animate ? "translateY(0)" : "translateY(200px)",
            opacity: animate ? 1 : 0,
          }}
        >
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            {/* Logo */}
            <div className="text-center mb-4">
              
            </div>

            {/* Card do formulário */}
            <div
              className="card shadow-sm"
              style={{ borderColor: primaryColor, borderWidth: "2px" }}
            >
              <div className="card-body p-4">
                <h1
                  className="h4 mb-3 text-center fw-bold text-uppercase"
                  style={{ color: primaryColor }}
                >
                  Entrar como Colaborador
                </h1>

                <form noValidate onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label
                      htmlFor="colab-email"
                      className="form-label"
                      style={{ color: textColor }}
                    >
                      E-mail
                    </label>
                    <input
                      id="colab-email"
                      type="email"
                      className="form-control"
                      placeholder="voce@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderColor: secondaryColor }}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="colab-senha"
                      className="form-label"
                      style={{ color: textColor }}
                    >
                      Senha
                    </label>
                    <input
                      id="colab-senha"
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ borderColor: secondaryColor }}
                    />
                  </div>

                  <button
                    className="btn w-100 fw-bold text-uppercase"
                    type="submit"
                    style={{
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      color: "#fff",
                      transition: "0.3s ease",
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>
                    Entrar
                  </button>
                </form>
              </div>
            </div>

            <p
              style={{ fontSize: "1.1rem", color: primaryColor }}
              className="text-center text-sm mt-3 mb-0 fw-semibold"
            >
              © {new Date().getFullYear()} Auria
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
