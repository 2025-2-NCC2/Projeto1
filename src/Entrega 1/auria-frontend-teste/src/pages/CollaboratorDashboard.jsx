import { useMemo, useState } from 'react'

export default function CollaboratorDashboard() {
  // Dados fictícios
  const [tarefas, setTarefas] = useState([
    { id: 1, titulo: 'Revisar extratos Itaú', projeto: 'Financeiro', equipe: 'Financeiro', prioridade: 'Alta', vencimento: '2025-10-05', progresso: 60, status: 'Em andamento' },
    { id: 2, titulo: 'Validar OCR Santander', projeto: 'Tecnologia', equipe: 'Tecnologia', prioridade: 'Média', vencimento: '2025-10-07', progresso: 30, status: 'Em andamento' },
    { id: 3, titulo: 'Relatório semanal',     projeto: 'Operações', equipe: 'Operações',  prioridade: 'Baixa', vencimento: '2025-10-04', progresso: 90, status: 'Quase pronto' },
    { id: 4, titulo: 'Briefing parceria C6',   projeto: 'Parcerias', equipe: 'Parcerias',  prioridade: 'Alta',  vencimento: '2025-10-09', progresso: 10, status: 'Novo' },
  ])

  const [q, setQ] = useState('')

  const filtradas = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return tarefas
    return tarefas.filter(t =>
      t.titulo.toLowerCase().includes(s) ||
      t.projeto.toLowerCase().includes(s) ||
      t.equipe.toLowerCase().includes(s)
    )
  }, [q, tarefas])

  // KPIs
  const kpis = useMemo(() => {
    const minhasEquipes = new Set(tarefas.map(t => t.equipe)).size
    const abertas = tarefas.filter(t => t.progresso < 100).length
    const projetos = new Set(tarefas.map(t => t.projeto)).size
    const mensagens = 3 // placeholder
    return { minhasEquipes, abertas, projetos, mensagens }
  }, [tarefas])

  function badgePrioridade(p) {
    switch ((p || '').toLowerCase()) {
      case 'alta': return 'text-bg-danger'
      case 'média':
      case 'media': return 'text-bg-warning'
      case 'baixa': return 'text-bg-secondary'
      default: return 'text-bg-light text-dark'
    }
  }

  function statusBadge(s) {
    const v = (s || '').toLowerCase()
    if (v.includes('novo')) return 'text-bg-primary'
    if (v.includes('quase')) return 'text-bg-info'
    return 'text-bg-success'
  }

  // Simplesmente simula criação de tarefa local (sem backend)
  function criarTarefaLocal(tarefa) {
    setTarefas(prev => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map(x => x.id)) + 1 : 1, ...tarefa }
    ])
  }

  const proximosPrazos = useMemo(() => {
    return [...tarefas]
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
      .slice(0, 5)
  }, [tarefas])

  const anuncios = [
    { titulo: 'Manutenção 06/10 22h', msg: 'Sistema ficará indisponível por 30 minutos.' },
    { titulo: 'Nova política de revisões', msg: 'Padrão mínimo semanal para cada equipe.' }
  ]

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Meu painel</h1>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalRegistrarAtividade"
          >
            <i className="bi bi-clipboard2-check me-1" aria-hidden="true"></i>
            Registrar atividade
          </button>

        </div>
      </div>

      {/* KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Minhas equipes</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.minhasEquipes}</div>
                <i className="bi bi-people fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Tarefas abertas</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.abertas}</div>
                <i className="bi bi-list-check fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Projetos</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.projetos}</div>
                <i className="bi bi-kanban fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Mensagens</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{kpis.mensagens}</div>
                <i className="bi bi-chat-dots fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

<div className="card shadow-sm mb-4">
  <div className="card-body">
    <h2 className="h6 mb-3">Minhas metas de doação</h2>
    <div className="mb-3">
      <div className="d-flex justify-content-between">
        <span>Meta em kg: 500 kg</span>
        <span>320 kg</span>
      </div>
      <div className="progress">
        <div className="progress-bar bg-success" style={{ width: '64%' }}>64%</div>
      </div>
    </div>
    <div className="mb-3">
      <div className="d-flex justify-content-between">
        <span>Meta em R$: R$ 2.000</span>
        <span>R$ 1.200</span>
      </div>
      <div className="progress">
        <div className="progress-bar bg-info" style={{ width: '60%' }}>60%</div>
      </div>
    </div>
    <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalDoacao">
      <i className="bi bi-plus-lg me-1"></i> Registrar doação
    </button>
  </div>
  <div className="modal fade" id="modalDoacao" tabIndex="-1" aria-labelledby="modalDoacaoLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <form onSubmit={(e) => { e.preventDefault(); /* lógica para salvar */ }}>
        <div className="modal-header">
          <h5 className="modal-title" id="modalDoacaoLabel">Registrar doação</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Tipo de doação</label>
            <select className="form-select" required>
              <option value="kg">Alimento (kg)</option>
              <option value="dinheiro">Dinheiro (R$)</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Quantidade</label>
            <input type="number" className="form-control" placeholder="Ex.: 10" required />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</div>
</div>

      {/* Conteúdo principal */}
      <div className="row g-4">
        {/* Tarefas */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h2 className="h6 mb-0">Minhas tarefas</h2>
                <div className="input-group" style={{ maxWidth: 360 }}>
                  <span className="input-group-text">
                    <i className="bi bi-search" aria-hidden="true"></i>
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Buscar por título, projeto ou equipe..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Tarefa</th>
                      <th>Projeto</th>
                      <th>Equipe</th>
                      <th>Prioridade</th>
                      <th style={{ minWidth: 160 }}>Progresso</th>
                      <th>Vencimento</th>
                      <th>Status</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map(t => (
                      <tr key={t.id}>
                        <td className="fw-semibold">{t.titulo}</td>
                        <td>{t.projeto}</td>
                        <td>{t.equipe}</td>
                        <td><span className={`badge ${badgePrioridade(t.prioridade)}`}>{t.prioridade}</span></td>
                        <td>
                          <div className="progress" role="progressbar" aria-valuenow={t.progresso} aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar" style={{ width: `${t.progresso}%` }}>{t.progresso}%</div>
                          </div>
                        </td>
                        <td>{new Date(t.vencimento).toLocaleDateString()}</td>
                        <td><span className={`badge ${statusBadge(t.status)}`}>{t.status}</span></td>
                        <td className="text-end">
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary" title="Detalhes">
                              <i className="bi bi-eye" aria-hidden="true"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" title="Atualizar progresso"
                              onClick={() => {
                                // Simples incremento de progresso local
                                setTarefas(prev => prev.map(x => x.id === t.id ? { ...x, progresso: Math.min(100, x.progresso + 10) } : x))
                              }}>
                              <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-success" title="Concluir"
                              onClick={() => {
                                setTarefas(prev => prev.map(x => x.id === t.id ? { ...x, progresso: 100, status: 'Concluída' } : x))
                              }}>
                              <i className="bi bi-check2-circle" aria-hidden="true"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtradas.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center text-secondary py-4">
                          Nenhuma tarefa encontrada para “{q}”.
                        </td>
                      </tr>
                    )}
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
              <h2 className="h6 mb-3">Minhas equipes</h2>
              <ul className="list-group list-group-flush">
                {[...new Set(tarefas.map(t => t.equipe))].map((nome, i) => (
                  <li key={i} className="list-group-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                        <span className="small">{nome[0]}</span>
                      </div>
                      <div className="fw-semibold">{nome}</div>
                    </div>
                    <span className="badge text-bg-primary">
                      {tarefas.filter(t => t.equipe === nome && t.progresso < 100).length} abertas
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h6 mb-3">Próximos prazos</h2>
              <ul className="list-unstyled mb-0">
                {proximosPrazos.map(t => (
                  <li key={t.id} className="mb-2">
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="fw-semibold">{t.titulo}</div>
                        <div className="small text-secondary">{t.projeto} • {t.equipe}</div>
                      </div>
                      <div className="text-end">
                        <div className="small">{new Date(t.vencimento).toLocaleDateString()}</div>
                        <span className={`badge ${badgePrioridade(t.prioridade)}`}>{t.prioridade}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6 mb-3">Anúncios</h2>
              <div className="border-start ps-3">
                {anuncios.map((a, i) => (
                  <div key={i} className="mb-3">
                    <div className="fw-semibold">{a.titulo}</div>
                    <div className="text-secondary small">{a.msg}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Registrar atividade */}
      <div className="modal fade" id="modalRegistrarAtividade" tabIndex="-1" aria-labelledby="modalRegistrarAtividadeLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => { e.preventDefault(); /* integrar backend depois */ }}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalRegistrarAtividadeLabel">Registrar atividade</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input type="text" className="form-control" placeholder="Ex.: Revisão de extratos" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descrição</label>
                  <textarea className="form-control" rows="3" placeholder="O que foi feito?"></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Projeto</label>
                  <input type="text" className="form-control" placeholder="Nome do projeto" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}