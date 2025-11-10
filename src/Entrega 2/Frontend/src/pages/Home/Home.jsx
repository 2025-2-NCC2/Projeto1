import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const primaryColor = "#22B77E";
  const textColor = "#333";

  const stats = [
    { label: "Usuários Ativos", value: 1200 },
    { label: "Grupos Criados", value: 45 },
    { label: "Arrecadado (R$)", value: 25000 },
    { label: "Satisfação (%)", value: 98 },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();

    function animate(time) {
      const progress = Math.min((time - startTime) / duration, 1);
      const newCounts = stats.map((s) => Math.floor(s.value * progress));
      setCounts(newCounts);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <main
      className="position-relative"
      style={{
        fontFamily: "Montserrat, Roboto, sans-serif",
        color: textColor,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ===== CARROSSEL DE FUNDO ===== */}
      <div
        id="backgroundCarousel"
        className="carousel slide position-absolute top-0 start-0 w-100 h-100"
        data-bs-ride="carousel"
        data-bs-interval="4000"
        style={{ zIndex: 0 }}
      >
        <div className="carousel-inner w-100 h-100">
          {[
            "https://assets.zyrosite.com/dOq4lP0kVLiEl8Z3/dsc_0798-YD0BkDQ67LTQO1kL.JPG",
            "https://assets.zyrosite.com/dOq4lP0kVLiEl8Z3/dsc_0764-AoPq56gKP2skKa62.JPG",
            "https://assets.zyrosite.com/dOq4lP0kVLiEl8Z3/dsc_0835-YNqPkpgenLH62VK9.JPG",
            "https://assets.zyrosite.com/dOq4lP0kVLiEl8Z3/dsc_0703-AVL1kzjEnQFlg6GX.JPG",
            "https://assets.zyrosite.com/dOq4lP0kVLiEl8Z3/dsc_0721-AGBnk3lk5bFqLlg7.JPG",
          ].map((url, i) => (
            <div
              key={i}
              className={`carousel-item ${i === 0 ? "active" : ""} w-100 h-100`}
            >
              <div
                className="w-100 h-100"
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                  filter: "brightness(0.45)",
                  height: "110vh",
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        {/* Logo */}
        <div className="text-center mb-4"></div>

        {/* Hero */}
        <div className="text-center mb-5 text-white">
          <h1 className="display-5 fw-bold" style={{ color: "#fff" }}>
            Sistema de Gestão Inteligente
          </h1>
          <p className="lead mb-4" style={{ color: "#f1f1f1" }}>
            Plataforma completa para administração, colaboração, doações e
            inteligência artificial.
          </p>
        </div>

        {/* Botões com efeito hover branco */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          {[{ label: "Sobre Nós", to: "/about-us" }].map((btn, index) => (
            <Link
              key={index}
              to={btn.to}
              className="btn btn-lg btn-primary"
              style={{
                backgroundColor: primaryColor,
                borderColor: primaryColor,
                color: "#fff",
                fontWeight: "600",
                boxShadow: "0px 4px 10px rgba(34,183,126,0.4)",
                transition: "all 0.3s ease",
              }}
            >
              {btn.label}
            </Link>
          ))}
        </div>

        {/* === MÉTRICAS COM CONTADOR ANIMADO === */}
        <section className="row g-4 text-center mb-5">
          {stats.map((item, i) => (
            <div className="col-12 col-md-6 col-lg-3" key={i}>
              <div
                className="card shadow-lg h-100"
                style={{
                  borderColor: primaryColor,
                  borderWidth: "2px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: "12px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(34,183,126,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                <div className="card-body">
                  <h3
                    className="fw-bold"
                    style={{
                      color: primaryColor,
                      fontSize: "2rem",
                    }}
                  >
                    {item.label.includes("R$")
                      ? `R$ ${counts[i].toLocaleString("pt-BR")}`
                      : item.label.includes("%")
                      ? `${counts[i]}%`
                      : item.value > 1000
                      ? `${counts[i].toLocaleString("pt-BR")}+`
                      : counts[i]}
                  </h3>
                  <p className="mb-0" style={{ color: textColor }}>
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ===== CSS INTERNO PARA EFEITO HOVER ===== */}
      <style>{`
        .custom-btn:hover {
          background-color: #fff !important;
          color: ${primaryColor} !important;
          border-color: ${primaryColor} !important;
          box-shadow: 0px 4px 14px rgba(34,183,126,0.5) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
}
