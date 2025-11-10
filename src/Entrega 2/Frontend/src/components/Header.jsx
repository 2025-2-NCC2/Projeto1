
import { NavLink, Link, useLocation } from "react-router-dom";
import logo from "../assets/logofundo.png";
import { useLogout } from "../hooks/resetSession";
import { useState, useEffect } from "react";

export default function Header() {
  const location = useLocation();
  const logout = useLogout();
  const [isLogged, setIsLogged] = useState(false);
  const primaryColor = "#fff"; // Fundo branco
  const accentColor = "#22B77E"; // Verde para botões

  useEffect(() => {
    setIsLogged(!!localStorage.getItem("token"));
    const onStorage = () => setIsLogged(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [location]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm "
      style={{
        borderBottom: `4px solid ${accentColor}`
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold"
          to="/"
        >
          <img
            src={logo}
            alt="Auria"
            style={{ height: "38px", width: "auto" }}
          />
        </Link>

        {/* Botão Hamburguer (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Alternar navegação"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navegação */}
        <div
          id="mainNav"
          className="collapse navbar-collapse justify-content-end"
        >
          <ul className="navbar-nav d-flex align-items-center gap-3">
            {[
              { path: "/", label: "HOME" },
              { path: "/login", label: "LOGIN" }, // botão novo
              ...(location.pathname === "/"
                ? [{ path: "/cadastro", label: "CADASTRO" }]
                : []),
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `btn nav-btn ${item.path === "/" ? "home-btn" : ""} ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
           {/* Botão Logout global (não mostrar na página home) */}
           {isLogged && location.pathname !== "/" && (
             <button
               className="btn nav-btn ms-3"
               style={{
                 minWidth: 100,
                 fontWeight: 500,
                 letterSpacing: 1,
                 backgroundColor: primaryColor,
                 color: accentColor,
                 border: `2px solid ${accentColor}`,
                 boxShadow: "0 4px 10px rgba(34, 183, 126, 0.3)",
                 textTransform: "uppercase"
               }}
               onClick={logout}
               onMouseOver={e => {
                 e.currentTarget.style.backgroundColor = accentColor;
                 e.currentTarget.style.color = "#fff";
                 e.currentTarget.style.border = `2px solid ${accentColor}`;
               }}
               onMouseOut={e => {
                 e.currentTarget.style.backgroundColor = primaryColor;
                 e.currentTarget.style.color = accentColor;
                 e.currentTarget.style.border = `2px solid ${accentColor}`;
               }}
             >
               Logout
             </button>
           )}
        </div>
      </div>

      {/* ===== ESTILOS INLINE DO COMPONENTE ===== */}
      <style>{`
        .nav-btn {
          background-color: ${primaryColor};
          color: ${accentColor} !important;
          border: 10px; ${accentColor};
          border-radius: 10px;
          padding: 5px 22px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-size: 0.95rem;
          box-shadow: 0 4px 10px rgba(34, 183, 126, 0.3);
          transition: all 0.3s ease;
        }

        /* Hover de todos os botões */
        .nav-btn:hover {
          background-color: #fff !important;
          color: ${accentColor} !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(34, 183, 126, 0.4);
        }

        /* Botões ativos (exceto Home) */
        .nav-btn.active:not(.home-btn) {
          background-color: ${accentColor} !important;
          color: #fff !important;
          border: 2px solid ${accentColor};
        }

        .nav-btn.active:not(.home-btn):hover {
          background-color: #fff !important;
          color: ${accentColor} !important;
          border: 2px solid ${accentColor};
        }

        /* Botão HOME sempre verde */
        .home-btn {
          color: ${accentColor} !important;
        }

        .home-btn.active {
          color: ${accentColor} !important;
        }

        @media (max-width: 991px) {
          .nav-btn {
            width: 100%;
            margin-top: 8px;
          }
        }
      `}</style>
    </nav>
  );
}
