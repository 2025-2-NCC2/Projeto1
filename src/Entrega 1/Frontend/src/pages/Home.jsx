import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="container py-5">
      {/* Hero */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Bem-vindo ao Projeto Auria</h1>
        {/* Bootstrap tem text-secondary (não "text-terciary") */}
        <p className="lead text-secondary mb-4">
          Transparência, controle e segurança: é o nosso dever
        </p>
      </div>

      {/* Botões */}
      <div className="d-flex justify-content-center gap-3 mb-5">
        <Link to="/colaborador" className="btn btn-primary btn-lg">
          <i className="bi bi-people me-2" aria-hidden="true"></i>
          Colaborador
        </Link>

        {/* Vai diretamente para a rota /admin (login do admin) */}

        <Link to="/admin" className="btn btn-primary btn-lg">
          <i className="bi bi-shield-lock me-2" aria-hidden="true"></i>
          Administrador
        </Link>

        <Link to="/mentor" className="btn btn-primary btn-lg">
          <i className="bi bi-mortarboard me-2" aria-hidden="true"></i>
          Mentor
        </Link>
      </div>

      {/* Cards */}
      <section className="row g-4 text-center">
        {[
          { valor: "87.763 kg", label: "Arrecadados", icon: "bi-box-seam" },
          {
            valor: "1.950",
            label: "Famílias Alimentadas",
            icon: "bi-house-heart",
          },
          {
            valor: "7.800",
            label: "Pessoas Alimentadas",
            icon: "bi-people-fill",
          },
          {
            valor: "+1.600",
            label: "Alunos Participantes",
            icon: "bi-mortarboard",
          },
        ].map((item, i) => (
          <div className="col-12 col-md-6 col-lg-3" key={i}>
            <div className="card shadow-sm h-100 bg-primary text-white">
              <div className="card-body">
                <i
                  className={`bi ${item.icon} fs-1 mb-3`}
                  aria-hidden="true"
                ></i>
                <h3 className="fw-bold">{item.valor}</h3>
                <p className="mb-0">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
