import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'auria_mentor_group_v1'

export default function MentorGroupManager() {
  // ---------- Estado base (carrega do localStorage se existir) ----------
  const initial = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)

    // Dados iniciais (mock)
    return {
      grupo: { nome: 'Grupo Aurora', metas: { kg: 500, brl: 2000 } },
      participantes: [
        { id: 1, nome: 'Maria Silva', email: 'maria@empresa.com', desde: '2025-06-10', ativo: true },
        { id: 2, nome: 'João Souza',  email: 'joao@empresa.com',  desde: '2025-07-03', ativo: true },
        { id: 3, nome: 'Ana Lima',    email: 'ana@empresa.com',   desde: '2025-08-15', ativo: true },
      ],
      doacoes: [
        { id: 1, participanteId: 1, tipo: 'kg',  quantidade: 25,    data: '2025-10-01' },
        { id: 2, participanteId: 2, tipo: 'brl', quantidade: 300,   data: '2025-10-01' },
        { id: 3, participanteId: 3, tipo: 'kg',  quantidade: 12.5,  data: '2025-10-02' },
        { id: 4, participanteId: 1, tipo: 'brl', quantidade: 150.0, data: '2025-10-02' },
      ],
    }
  }

  const [grupo, setGrupo] = useState(initial().grupo)
  const [participantes, setParticipantes] = useState(initial().participantes)
  const [doacoes, setDoacoes] = useState(initial().doacoes)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ grupo, participantes, doacoes }))
  }, [grupo, participantes, doacoes])

  // ---------- Utils ----------
  const nextId = (arr) => (arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1)

  const participantesAtivos = useMemo(
    () => participantes.filter(p => p.ativo),
    [participantes]
  )

  const totalKg = useMemo(
    () => doacoes.filter(d => d.tipo === 'kg').reduce((acc, d) => acc + Number(d.quantidade || 0), 0),
    [doacoes]
  )

  const totalBRL = useMemo(
    () => doacoes.filter(d => d.tipo === 'brl').reduce((acc, d) => acc + Number(d.quantidade || 0), 0),
    [doacoes]
  )

  const progressoKg = useMemo(
    () => (grupo.metas.kg ? Math.min(100, Math.round((totalKg / grupo.metas.kg) * 100)) : 0),
    [totalKg, grupo.metas.kg]
  )

  const progressoBRL = useMemo(
    () => (grupo.metas.brl ? Math.min(100, Math.round((totalBRL / grupo.metas.brl) * 100)) : 0),
    [totalBRL, grupo.metas.brl]
  )

  function somaPorParticipante(id, tipo) {
    return doacoes
      .filter(d => d.participanteId === id && d.tipo === tipo)
      .reduce((acc, d) => acc + Number(d.quantidade || 0), 0)
  }

  // ---------- Ações: participantes ----------
  function adicionarParticipante({ nome, email }) {
    const novo = {
      id: nextId(participantes),
      nome,
      email,
      desde: new Date().toISOString().slice(0, 10),
      ativo: true,
    }
    setParticipantes(prev => [...prev, novo])
  }

  function removerParticipante(id) {
    const p = participantes.find(x => x.id === id)
    if (!p) return
    if (!confirm(`Remover ${p.nome} do grupo?`)) return

    // Mantemos histórico de doações — apenas desativa o participante.
    setParticipantes(prev => prev.map(x => x.id === id ? { ...x, ativo: false } : x))
  }

  function reativarParticipante(id) {
    setParticipantes(prev => prev.map(x => x.id === id ? { ...x, ativo: true } : x))
  }

  // ---------- Ações: metas ----------
  function atualizarMetas({ kg, brl }) {
    setGrupo(prev => ({ ...prev, metas: { kg: Number(kg), brl: Number(brl) } }))
  }

  // ---------- Ações: doações ----------
  function registrarDoacao({ participanteId, tipo, quantidade, data }) {
    const idNum = Number(participanteId)
    const qtd = Number(quantidade)
    if (!idNum || !qtd || qtd <= 0) return
    setDoacoes(prev => [
      ...prev,
      { id: nextId(prev), participanteId: idNum, tipo, quantidade: qtd, data: data || new Date().toISOString().slice(0, 10) }
    ])
  }

  // ---------- Busca e filtros ----------
  const [q, setQ] = useState('')
  const participantesFiltrados = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return participantes
    return participantes.filter(p =>
      p.nome.toLowerCase().includes(s) ||
      p.email.toLowerCase().includes(s)
    )
  }, [q, participantes])

  const [qDoacao, setQDoacao] = useState('')
  const doacoesFiltradas = useMemo(() => {
    const s = qDoacao.trim().toLowerCase()
    if (!s) return doacoes
    return doacoes.filter(d => {
      const p = participantes.find(x => x.id === d.participanteId)
      const nome = p?.nome?.toLowerCase() || ''
      const tipo = d.tipo.toLowerCase()
      const data = (d.data || '').toLowerCase()
      return nome.includes(s) || tipo.includes(s) || data.includes(s)
    })
  }, [qDoacao, doacoes, participantes])

  // ---------- UI ----------
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h4 mb-0">Gestão do Grupo</h1>
          <div className="text-secondary small">{grupo.nome}</div>
        </div>

        <div className="d-flex gap-2">
          {/* Abrir modal de metas */}
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMetas"
          >
            <i className="bi bi-bullseye me-1" aria-hidden="true"></i>
            Definir metas
          </button>

          {/* Abrir modal de doação */}
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalDoacao"
          >
            <i className="bi bi-gift-fill me-1" aria-hidden="true"></i>
            Registrar doação
          </button>
        </div>
      </div>

      {/* KPIs e progresso das metas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Participantes ativos</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{participantesAtivos.length}</div>
                <i className="bi bi-people fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Meta (kg) • Atingido</div>
              <div className="fw-semibold">{grupo.metas.kg} kg • {totalKg.toFixed(1)} kg</div>
              <div className="progress mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressoKg}>
                <div className="progress-bar bg-success" style={{ width: `${progressoKg}%` }}>{progressoKg}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Meta (R$) • Atingido</div>
              <div className="fw-semibold">R$ {grupo.metas.brl.toLocaleString()} • R$ {totalBRL.toLocaleString()}</div>
              <div className="progress mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressoBRL}>
                <div className="progress-bar bg-info" style={{ width: `${progressoBRL}%` }}>{progressoBRL}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Doações registradas</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{doacoes.length}</div>
                <i className="bi bi-gift fs-3 text-primary" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abas: Participantes | Doações */}
      <ul className="nav nav-tabs mb-3" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="tab-participantes-tab" data-bs-toggle="tab" data-bs-target="#tab-participantes" type="button" role="tab" aria-controls="tab-participantes" aria-selected="true">
            Participantes
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="tab-doacoes-tab" data-bs-toggle="tab" data-bs-target="#tab-doacoes" type="button" role="tab" aria-controls="tab-doacoes" aria-selected="false">
            Doações
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Tab: Participantes */}
        <div className="tab-pane fade show active" id="tab-participantes" role="tabpanel" aria-labelledby="tab-participantes-tab">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h2 className="h6 mb-0">Participantes do grupo</h2>
                <div className="d-flex gap-2">
                  <div className="input-group" style={{ maxWidth: 320 }}>
                    <span className="input-group-text"><i className="bi bi-search" aria-hidden="true"></i></span>
                    <input type="search" className="form-control" placeholder="Buscar por nome ou e-mail..." value={q} onChange={e => setQ(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAddParticipante">
                    <i className="bi bi-person-plus me-1" aria-hidden="true"></i>
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Entrada</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Doado (kg)</th>
                      <th className="text-center">Doado (R$)</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantesFiltrados.map(p => {
                      const kg = somaPorParticipante(p.id, 'kg')
                      const brl = somaPorParticipante(p.id, 'brl')
                      return (
                        <tr key={p.id} className={!p.ativo ? 'table-light' : ''}>
                          <td className="fw-semibold">{p.nome}</td>
                          <td>{p.email}</td>
                          <td>{new Date(p.desde).toLocaleDateString('pt-BR')}</td>
                          <td className="text-center">
                            <span className={`badge ${p.ativo ? 'text-bg-success' : 'text-bg-secondary'}`}>
                              {p.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="text-center">{kg.toFixed(1)}</td>
                          <td className="text-center">R$ {brl.toLocaleString()}</td>
                          <td className="text-end">
                            <div className="btn-group">
                              <button className="btn btn-sm btn-outline-primary" title="Registrar doação" data-bs-toggle="modal" data-bs-target="#modalDoacao"
                                onClick={() => {
                                  // Prefill participante no modal
                                  const sel = document.querySelector('#modalDoacao select[name="participanteId"]')
                                  if (sel) sel.value = String(p.id)
                                }}>
                                <i className="bi bi-gift" aria-hidden="true"></i>
                              </button>

                              {p.ativo ? (
                                <button className="btn btn-sm btn-outline-danger" title="Remover (inativar)" onClick={() => removerParticipante(p.id)}>
                                  <i className="bi bi-person-dash" aria-hidden="true"></i>
                                </button>
                              ) : (
                                <button className="btn btn-sm btn-outline-secondary" title="Reativar" onClick={() => reativarParticipante(p.id)}>
                                  <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {participantesFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-secondary py-4">
                          Nenhum participante encontrado para “{q}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

        {/* Tab: Doações */}
        <div className="tab-pane fade" id="tab-doacoes" role="tabpanel" aria-labelledby="tab-doacoes-tab">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <h2 className="h6 mb-0">Doações do grupo</h2>
                <div className="d-flex gap-2">
                  <div className="input-group" style={{ maxWidth: 320 }}>
                    <span className="input-group-text"><i className="bi bi-search" aria-hidden="true"></i></span>
                    <input type="search" className="form-control" placeholder="Buscar por nome, tipo ou data..." value={qDoacao} onChange={e => setQDoacao(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalDoacao">
                    <i className="bi bi-gift-fill me-1" aria-hidden="true"></i>
                    Nova doação
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Participante</th>
                      <th>Tipo</th>
                      <th className="text-end">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doacoesFiltradas
                      .sort((a, b) => new Date(b.data) - new Date(a.data))
                      .map(d => {
                        const p = participantes.find(x => x.id === d.participanteId)
                        return (
                          <tr key={d.id}>
                            <td>{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                            <td>{p?.nome || '—'}</td>
                            <td>{d.tipo === 'kg' ? 'Alimento (kg)' : 'Dinheiro (R$)'}</td>
                            <td className="text-end">
                              {d.tipo === 'kg' ? `${d.quantidade.toFixed(1)} kg` : `R$ ${d.quantidade.toLocaleString()}`}
                            </td>
                          </tr>
                        )
                      })}
                    {doacoesFiltradas.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary py-4">
                          Nenhuma doação registrada para “{qDoacao}”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --------- MODAL: Definir/editar metas --------- */}
      <div className="modal fade" id="modalMetas" tabIndex="-1" aria-labelledby="modalMetasLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const kg = form.kg.value
              const brl = form.brl.value
              atualizarMetas({ kg, brl })
            }}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalMetasLabel">Definir metas do grupo</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Meta em kg</label>
                  <input name="kg" type="number" min="0" step="0.1" defaultValue={grupo.metas.kg} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Meta em R$</label>
                  <input name="brl" type="number" min="0" step="1" defaultValue={grupo.metas.brl} className="form-control" required />
                </div>
                <div className="alert alert-info small mb-0">
                  Por enquanto as metas são globais (período atual). Podemos evoluir para metas mensais com histórico.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Salvar metas</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --------- MODAL: Adicionar participante --------- */}
      <div className="modal fade" id="modalAddParticipante" tabIndex="-1" aria-labelledby="modalAddParticipanteLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const nome = form.nome.value.trim()
              const email = form.email.value.trim()
              if (!nome || !email) return
              adicionarParticipante({ nome, email })
              form.reset()
            }}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalAddParticipanteLabel">Adicionar participante</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input name="nome" type="text" className="form-control" placeholder="Nome completo" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input name="email" type="email" className="form-control" placeholder="pessoa@empresa.com" required />
                </div>
                <div className="alert alert-light border small mb-0">
                  O participante será marcado como <strong>ativo</strong>. Você pode inativá-lo a qualquer momento.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --------- MODAL: Registrar doação --------- */}
      <div className="modal fade" id="modalDoacao" tabIndex="-1" aria-labelledby="modalDoacaoLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const participanteId = form.participanteId.value
              const tipo = form.tipo.value
              const quantidade = form.quantidade.value
              const data = form.data.value
              registrarDoacao({ participanteId, tipo, quantidade, data })
              form.reset()
            }}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalDoacaoLabel">Registrar doação</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Participante</label>
                  <select name="participanteId" className="form-select" defaultValue="" required>
                    <option value="" disabled>Selecione...</option>
                    {participantes.map(p => (
                      <option key={p.id} value={p.id} disabled={!p.ativo}>
                        {p.nome} {p.ativo ? '' : '(inativo)'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">Tipo</label>
                    <select name="tipo" className="form-select" defaultValue="kg">
                      <option value="kg">Alimento (kg)</option>
                      <option value="brl">Dinheiro (R$)</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">Quantidade</label>
                    <input name="quantidade" type="number" min="0.1" step="0.1" className="form-control" placeholder="Ex.: 10" required />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label">Data</label>
                  <input name="data" type="date" className="form-control" defaultValue={new Date().toISOString().slice(0,10)} />
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