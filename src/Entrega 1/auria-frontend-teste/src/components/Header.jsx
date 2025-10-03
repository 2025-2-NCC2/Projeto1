import { NavLink, Link } from 'react-router-dom'

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary" aria-label="Navegação principal">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-lightning-charge-fill" aria-hidden="true"></i>
          <span>Auria</span>
        </Link>

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

        <div id="mainNav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink end to="/" className="nav-link">Home</NavLink></li>
            <li className="nav-item"><NavLink to="/cadastro" className="nav-link">Cadastro</NavLink></li>
            <li className="nav-item"><NavLink to="/config" className="nav-link">Config</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}