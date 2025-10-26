import React from 'react';

export default function AdminTeamsDashboard() {
  // Dados fictícios zerados para layout
  const teams = [
    { id: 1, nome: 'Grupo 1', lider: '—', membros: 0, projetos: 0, progresso: 0, status: 'Inativa' },
    { id: 2, nome: 'Grupo 2',  lider: '—', membros: 0, projetos: 0, progresso: 0, status: 'Inativa' },
    { id: 3, nome: 'Grupo 3', lider: '—', membros: 0, projetos: 0, progresso: 0, status: 'Inativa' },
    { id: 4, nome: 'Grupo 4',  lider: '—', membros: 0, projetos: 0, progresso: 0, status: 'Inativa' },
    { id: 5, nome: 'Grupo 5',lider: '—', membros: 0, projetos: 0, progresso: 0, status: 'Inativa' },
  ];

  const kpis = {
    totalEquipes: 0,
    totalMembros: 0,
    totalAlimentos: 0,
    TotalDinheiro: 0,
  };

  const topEquipes = [...teams]; // apenas layout

  const atividades = []; // sem atividades

  function badgeClass(status) {
    switch ((status || '').toLowerCase()) {
      case 'ativa': return 'text-bg-success';
      case 'em pausa': return 'text-bg-warning';
      case 'arquivada': return 'text-bg-secondary';
      default: return 'text-bg-light text-dark';
    }
  }

  return (
    <div className="container py-4">

      {/* Cabeçalho */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Dashboard de Equipes</h1>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-primary">
            <i className="bi bi-envelope-plus me-1" aria-hidden="true"></i>
            Convidar membro
          </button>
          <button type="button" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>
            Nova equipe
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Equipes</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.totalEquipes}</div>
                <i className="bi bi-diagram-3 fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Membros</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.totalMembros}</div>
                <i className="bi bi-people fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Total de KG's doados</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.totalAlimentos}</div>
                <i className="bi bi-kanban fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Total de R$ arrecadado</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.total}</div>
                <i className="bi bi-person-plus fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h2 className="h6 mb-0">Equipes</h2>
                <div className="input-group" style={{ maxWidth: 320 }}>
                  <span className="input-group-text">
                    <i className="bi bi-search" aria-hidden="true"></i>
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Buscar por equipe ou líder..."
                    value=""
                    readOnly
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Equipe</th>
                      <th>Líder</th>
                      <th className="text-center">Membros</th>
                      <th className="text-center">KG's doados</th>
                      <th className="text-center">R$ doados</th>
                    
                    
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((t) => (
                      <tr key={t.id}>
                        <td className="fw-semibold">{t.nome}</td>
                        <td>{t.lider}</td>
                        <td className="text-center">{t.membros}</td>
                        <td className="text-center">{t.projetos}</td>
                        <td>
                          <div className="progress">
                            <div className="progress-bar" style={{ width: `${t.progresso}%` }}>
                              {t.progresso}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${badgeClass(t.status)}`}>{t.status}</span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-eye" aria-hidden="true"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                              <i className="bi bi-pencil" aria-hidden="true"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-archive" aria-hidden="true"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h6 mb-3">Top equipes (por progresso)</h2>
              <ul className="list-group list-group-flush">
                {topEquipes.map((t) => (
                  <li key={t.id} className="list-group-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                        <span className="small">{t.nome[0]}</span>
                      </div>
                      <div>
                        <div className="fw-semibold">{t.nome}</div>
                        <div className="text-secondary small">{t.lider}</div>
                      </div>
                    </div>
                    <span className="badge text-bg-primary">{t.progresso}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
