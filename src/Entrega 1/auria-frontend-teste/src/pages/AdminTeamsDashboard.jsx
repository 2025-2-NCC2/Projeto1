import { useMemo, useState } from 'react'

export default function AdminTeamsDashboard() {
  // Dados fictícios por enquanto
  const [teams] = useState([
    { id: 1, nome: 'Financeiro', lider: 'Maria Silva', membros: 8, projetos: 3, progresso: 72, status: 'Ativa' },
    { id: 2, nome: 'Operações',  lider: 'João Souza',  membros: 12, projetos: 5, progresso: 45, status: 'Ativa' },
    { id: 3, nome: 'Tecnologia', lider: 'Ana Lima',    membros: 15, projetos: 6, progresso: 83, status: 'Ativa' },
    { id: 4, nome: 'Parcerias',  lider: 'Carlos Reis',  membros: 6, projetos: 2, progresso: 28, status: 'Em pausa' },
    { id: 5, nome: 'Comunicação',lider: 'Paula Alves',  membros: 7, projetos: 2, progresso: 60, status: 'Ativa' },
  ])

  // Busca rápida
  const [q, setQ] = useState('')

  const filtradas = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return teams
    return teams.filter(t =>
      t.nome.toLowerCase().includes(s) ||
      t.lider.toLowerCase().includes(s)
    )
  }, [q, teams])

  // KPIs
  const kpis = useMemo(() => {
    const totalEquipes   = teams.length
    const totalMembros   = teams.reduce((acc, t) => acc + t.membros, 0)
    const totalProjetos  = teams.reduce((acc, t) => acc + t.projetos, 0)
    const convitesPend   = 5 // placeholder
    return { totalEquipes, totalMembros, totalProjetos, convitesPend }
  }, [teams])

  // Helpers
  function badgeClass(status) {
    switch ((status || '').toLowerCase()) {
      case 'ativa': return 'text-bg-success'
      case 'em pausa': return 'text-bg-warning'
      case 'arquivada': return 'text-bg-secondary'
      default: return 'text-bg-light text-dark'
    }
  }

  const topEquipes = useMemo(() => {
    return [...teams].sort((a, b) => b.progresso - a.progresso).slice(0, 5)
  }, [teams])

  const atividades = [
    { when: 'Hoje 10:12', who: 'maria@empresa.com', what: 'Incluiu membro em Tecnologia' },
    { when: 'Ontem 18:40', who: 'joao@empresa.com', what: 'Criou equipe Parcerias' },
    { when: 'Ontem 16:05', who: 'ana@empresa.com',  what: 'Atualizou projetos em Financeiro' },
  ]

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Dashboard de Equipes</h1>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasInvite"
            aria-controls="offcanvasInvite"
          >
            <i className="bi bi-envelope-plus me-1" aria-hidden="true"></i>
            Convidar membro
          </button>

          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalNovaEquipe"
          >
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
              <div className="text-secondary small">Projetos ativos</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.totalProjetos}</div>
                <i className="bi bi-kanban fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Convites pendentes</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.convitesPend}</div>
                <i className="bi bi-person-plus fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtro + Tabela de equipes */}
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
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
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
                      <th className="text-center">Projetos</th>
                      <th style={{ minWidth: 160 }}>Progresso</th>
                      <th>Status</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((t) => (
                      <tr key={t.id}>
                        <td className="fw-semibold">{t.nome}</td>
                        <td>{t.lider}</td>
                        <td className="text-center">{t.membros}</td>
                        <td className="text-center">{t.projetos}</td>
                        <td>
                          <div className="progress" role="progressbar" aria-label={`Progresso ${t.progresso}%`} aria-valuenow={t.progresso} aria-valuemin="0" aria-valuemax="100">
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
                    {filtradas.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-secondary py-4">
                          Nenhuma equipe encontrada para “{q}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar: Top equipes + Atividades */}
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

          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6 mb-3">Atividades recentes</h2>
              <div className="border-start ps-3">
                {atividades.map((a, i) => (
                  <div key={i} className="mb-3">
                    <div className="small text-secondary">{a.when} • {a.who}</div>
                    <div>{a.what}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Nova Equipe */}
      <div className="modal fade" id="modalNovaEquipe" tabIndex="-1" aria-labelledby="modalNovaEquipeLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => { e.preventDefault(); /* integrar backend depois */ }}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalNovaEquipeLabel">Nova equipe</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nome da equipe</label>
                  <input type="text" className="form-control" placeholder="Ex.: Operações Regionais" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Líder</label>
                  <input type="text" className="form-control" placeholder="Nome do líder" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descrição</label>
                  <textarea className="form-control" rows="3" placeholder="Objetivo e escopo da equipe"></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Criar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Offcanvas: Convidar membro */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasInvite" aria-labelledby="offcanvasInviteLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasInviteLabel" className="offcanvas-title">
            Convidar membro
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar"></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={(e) => { e.preventDefault(); /* integrar backend depois */ }}>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input type="email" className="form-control" placeholder="pessoa@empresa.com" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Equipe</label>
              <select className="form-select" defaultValue="">
                <option value="" disabled>Selecione...</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Mensagem (opcional)</label>
              <textarea className="form-control" rows="3" placeholder="Bem-vindo ao Projeto Auria!"></textarea>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" data-bs-dismiss="offcanvas">
                <i className="bi bi-send me-1" aria-hidden="true"></i>
                Enviar convite
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}