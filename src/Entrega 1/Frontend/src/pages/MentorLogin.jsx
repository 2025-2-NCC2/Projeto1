import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png';

export default function MentorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [animate, setAnimate] = useState(false); // controla a animação
  const navigate = useNavigate();

  const primaryColor = "#22B77E"; // Verde
  const secondaryColor = "#17A2B8"; // Azul-claro
  const textColor = "#000000ff"; // Texto branco sobre o vídeo

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
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
        navigate("/mentor/painel", { replace: true });
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
      className="container-fluid p-0"
      style={{ 
        fontFamily: 'Montserrat, Roboto, sans-serif', 
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        color: textColor
      }}
    >
      {/* Vídeo de fundo desfocado */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(8px)',
          zIndex: -1
        }}
      >
        <source src="../src/assets/video.mp4" type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>

      {/* Formulário */}
      <div 
        className="col-12 col-sm-10 col-md-8 col-lg-5"
        style={{
          transform: animate ? 'translateY(0)' : 'translateY(200px)',
          opacity: animate ? 1 : 0,
          transition: 'all 1.0s ease-out',
          zIndex: 1
        }}
      >
        <div className="text-center mb-4">
          
        </div>
        <div className="card shadow-sm" style={{ borderColor: primaryColor, borderWidth: '2px', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="card-body p-4">
            <h1 className="h4 mb-3 text-center" style={{ color: primaryColor }}>Entrar como mentor</h1>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="mentor-email" className="form-label" style={{ color: textColor }}>E-mail</label>
                <input
                  id="mentor-email"
                  type="email"
                  className="form-control"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ borderColor: secondaryColor, backgroundColor: 'rgba(255,255,255,0.1)', color: textColor }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mentor-senha" className="form-label" style={{ color: textColor }}>Senha</label>
                <input
                  id="mentor-senha"
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ borderColor: secondaryColor, backgroundColor: 'rgba(255,255,255,0.1)', color: textColor }}
                />
              </div>

              <button className="btn w-100" type="submit" style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: '#fff' }}>
                <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>
                Entrar
              </button>
            </form>

            <p className="text-center small mt-3 mb-0" style={{ color: textColor }}>
              *Sem validação por enquanto: apenas navegação.
            </p>
          </div>
        </div>

        <p className="text-center small mt-3 mb-0" style={{ fontSize: '1.1rem', color: primaryColor }}>
          © {new Date().getFullYear()} Auria
        </p>
      </div>
    </div>
  )
}
