import { useEffect, useMemo, useState } from 'react'

/** Persistência local */
const STORAGE_KEY_GROUPS = 'auria_groups_v1'

export default function MentorDashboard() {

  // ---------------------------------------------------------------------
  // IDENTIDADE DO MENTOR LOGADO (mock)
  // Em produção, isso virá do login/contexto (ex.: auth.user.id)
  // Aqui deixamos fixo para demonstrar: este mentor é o dono do grupo 1.
  // ---------------------------------------------------------------------
  const currentMentorId = 'mentor-001'
  const currentMentorName = 'Você'

  const [grupos, setGrupos] = useState([]);
  const [currGroup, setCurrGroup] = useState([]);
  const [members, setMembers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState({ id: null, name: '', email: '' });


  useEffect(() => {
  const fetchGroups = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/groups/list");
      if (!response.ok) throw new Error("Erro na resposta do servidor");
      
      const data = await response.json();
      setGrupos(data.groups);
      console.log("Grupos:", data.groups); // imprime como objeto
    } catch (err) {
      console.error("Erro ao buscar grupos:", err);
    }
  };
  fetchGroups();
}, []);

const handleMembers = async (idGroup) => {
    //console.log("Grupo selecionado ID:", idGroup);
    try {
      const response = await fetch(`http://localhost:3000/api/user/groups/${idGroup}`, { // dev: http://localhost:3000/api/groups/${id}
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMembers((prev) => [...prev, data][0]); // adiciona o grupo retornado
      } else {
        alert(data.error || "Erro ao carregar usuários do grupo");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor" + err.message);
    }
  };
  console.log("Grupo selecionado ID:", members);

  const handleGroup = async (id) => {
    //console.log("Grupo selecionado ID:", id);
    try {
      const response = await fetch(`http://localhost:3000/api/groups/${id}`, { // dev: http://localhost:3000/api/groups/${id}
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Grupo ${data.name} carregado com sucesso!`);
        setCurrGroup((prev) => [...prev, data]); // adiciona o grupo retornado
        handleMembers(id)
      } else {
        alert(data.error || "Erro ao carregar grupo");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor" + err.message);
    }
  };
  console.log(currGroup);

  // ---------------------------------------------------------------------
  // DADOS DE GRUPOS (múltiplos grupos com metas/participantes/doações)
  // Todos os grupos têm o MESMO PROPÓSITO: doações (kg e R$)
  // ---------------------------------------------------------------------
  const initialGroups = () => {
    const saved = localStorage.getItem(STORAGE_KEY_GROUPS)
    if (saved) return JSON.parse(saved)

    return [
      {
        id: 1,
        nome: 'Grupo Aurora',
        mentorOwner: { id: 'mentor-001', nome: 'Você' }, // dono (este mentor)
        metas: { kg: 500, brl: 2000 },
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
      },
      {
        id: 2,
        nome: 'Grupo Horizonte',
        mentorOwner: { id: 'mentor-002', nome: 'Carla Mentor' }, // outro mentor
        metas: { kg: 600, brl: 2500 },
        participantes: [
          { id: 1, nome: 'Pedro Santos', email: 'pedro@empresa.com', desde: '2025-05-20', ativo: true },
          { id: 2, nome: 'Beatriz Nunes', email: 'bia@empresa.com',  desde: '2025-07-25', ativo: true },
        ],
        doacoes: [
          { id: 1, participanteId: 1, tipo: 'kg',  quantidade: 10, data: '2025-09-28' },
          { id: 2, participanteId: 2, tipo: 'brl', quantidade: 90, data: '2025-09-30' },
        ],
      },
      {
        id: 3,
        nome: 'Grupo Caminho',
        mentorOwner: { id: 'mentor-003', nome: 'Rafael Mentor' }, // outro mentor
        metas: { kg: 300, brl: 1000 },
        participantes: [
          { id: 1, nome: 'Luiza Costa', email: 'luiza@empresa.com', desde: '2025-06-02', ativo: true },
        ],
        doacoes: [
          { id: 1, participanteId: 1, tipo: 'kg',  quantidade: 5, data: '2025-09-15' },
        ],
      },
    ]
  }

  const [groups, setGroups] = useState(initialGroups)
  const [selectedGroupId, setSelectedGroupId] = useState(() => groups[0]?.id ?? 1)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups))
  }, [groups])

  const group = useMemo(
    () => groups.find(g => g.id === Number(selectedGroupId)),
    [groups, selectedGroupId]
  )

  const isOwner = group?.mentorOwner?.id === currentMentorId

  // Helpers de update imutável
  function updateGroup(groupId, updater) {
    setGroups(prev => prev.map(g => (g.id === groupId ? updater(g) : g)))
  }
  const nextId = (arr) => (arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1)

  // Totais/metas (sempre kg e R$)
  const totalKg = useMemo(
    () => (group?.doacoes || []).filter(d => d.tipo === 'kg').reduce((acc, d) => acc + Number(d.quantidade || 0), 0),
    [group]
  )
  const totalBRL = useMemo(
    () => (group?.doacoes || []).filter(d => d.tipo === 'brl').reduce((acc, d) => acc + Number(d.quantidade || 0), 0),
    [group]
  )
  const progressoKg = useMemo(
    () => (group?.metas?.kg ? Math.min(100, Math.round((totalKg / group.metas.kg) * 100)) : 0),
    [group, totalKg]
  )
  const progressoBRL = useMemo(
    () => (group?.metas?.brl ? Math.min(100, Math.round((totalBRL / group.metas.brl) * 100)) : 0),
    [group, totalBRL]
  )
  const participantesAtivos = useMemo(
    () => (group?.participantes || []).filter(p => p.ativo),
    [group]
  )

  function somaPorParticipante(participanteId, tipo) {
    return (group?.doacoes || [])
      .filter(d => d.participanteId === participanteId && d.tipo === tipo)
      .reduce((acc, d) => acc + Number(d.quantidade || 0), 0)
  }

  // AÇÕES do grupo — respeitam isOwner (somente leitura quando não dono)
  function atualizarMetas({ kg, brl }) {
    if (!isOwner) return
    updateGroup(group.id, (g) => ({
      ...g,
      metas: { kg: Number(kg), brl: Number(brl) },
    }))
  }
  function adicionarParticipante({ nome, email }) {
    if (!isOwner) return
    updateGroup(group.id, (g) => ({
      ...g,
      participantes: [
        ...g.participantes,
        {
          id: nextId(g.participantes),
          nome, email,
          desde: new Date().toISOString().slice(0, 10),
          ativo: true,
        }
      ]
    }))
  }
  function removerParticipante(id) {
    if (!isOwner) return
    const p = group.participantes.find(x => x.id === id)
    if (!p) return
    if (!confirm(`Remover ${p.nome} do grupo?`)) return
    updateGroup(group.id, (g) => ({
      ...g,
      participantes: g.participantes.map(x => x.id === id ? { ...x, ativo: false } : x)
    }))
  }
  function reativarParticipante(id) {
    if (!isOwner) return
    updateGroup(group.id, (g) => ({
      ...g,
      participantes: g.participantes.map(x => x.id === id ? { ...x, ativo: true } : x)
    }))
  }
  function registrarDoacao({ participanteId, tipo, quantidade, data }) {
    if (!isOwner) return
    const idNum = Number(participanteId)
    const qtd = Number(quantidade)
    if (!idNum || !qtd || qtd <= 0) return
    updateGroup(group.id, (g) => ({
      ...g,
      doacoes: [
        ...g.doacoes,
        {
          id: nextId(g.doacoes),
          participanteId: idNum,
          tipo, quantidade: qtd,
          data: data || new Date().toISOString().slice(0, 10)
        }
      ]
    }))
  }

  // Busca (participantes / doações)
  const [qPart, setQPart] = useState('')
  const [qDoacao, setQDoacao] = useState('')
  const participantesFiltrados = useMemo(() => {
    const s = qPart.trim().toLowerCase()
    if (!s) return group?.participantes || []
    return (group?.participantes || []).filter(p =>
      p.nome.toLowerCase().includes(s) || p.email.toLowerCase().includes(s)
    )
  }, [qPart, group])
  const doacoesFiltradas = useMemo(() => {
    const s = qDoacao.trim().toLowerCase()
    if (!s) return group?.doacoes || []
    return (group?.doacoes || []).filter(d => {
      const p = (group?.participantes || []).find(x => x.id === d.participanteId)
      const nome = p?.nome?.toLowerCase() || ''
      return nome.includes(s) || d.tipo.toLowerCase().includes(s) || (d.data || '').toLowerCase().includes(s)
    })
  }, [qDoacao, group])

  // ---------------------------------------------------------------------
  // BLOCO Mentor (Visão Geral) — mantido, tema consistente
  // (mocks para sessões/mentorados; sem relação direta com grupos)
  // ---------------------------------------------------------------------
  const [mentorados] = useState([
    { id: 1, nome: 'Maria Silva', progresso: 70, objetivo: 'Metodologia de doações', satisfacao: 4.8, ultimaAtividade: '2025-10-01' },
    { id: 2, nome: 'João Souza',  progresso: 45, objetivo: 'Engajamento de equipe',  satisfacao: 4.2, ultimaAtividade: '2025-10-02' },
    { id: 3, nome: 'Ana Lima',    progresso: 85, objetivo: 'Liderança de grupo',      satisfacao: 4.9, ultimaAtividade: '2025-09-30' },
  ])
  const [sessoes, setSessoes] = useState([
    { id: 1, mentee: 'Maria Silva', tema: 'Aumentar doações em kg',  datetime: '2025-10-05T10:00', status: 'Agendada',  feedbackPendente: false },
    { id: 2, mentee: 'João Souza',  tema: 'Campanhas financeiras',   datetime: '2025-10-04T14:00', status: 'Agendada',  feedbackPendente: false },
    { id: 3, mentee: 'Ana Lima',    tema: 'Boa governança de grupo', datetime: '2025-10-03T09:00', status: 'Concluída', feedbackPendente: true  },
  ])
  const kpisMentor = useMemo(() => {
    const totalMentorados = mentorados.length
    const now = new Date()
    const in7days = new Date(now); in7days.setDate(now.getDate() + 7)
    const sessoesSemana = sessoes.filter(s => {
      const d = new Date(s.datetime)
      return d >= now && d <= in7days
    }).length
    const feedbackPend = sessoes.filter(s => s.status === 'Concluída' && s.feedbackPendente).length
    const satisfacaoMedia = mentorados.length
      ? (mentorados.reduce((acc, m) => acc + (m.satisfacao || 0), 0) / mentorados.length)
      : 0
    return {
      totalMentorados,
      sessoesSemana,
      feedbackPend,
      satisfacaoMedia: satisfacaoMedia.toFixed(1),
    }
  }, [mentorados, sessoes])

  function statusBadgeSessao(s) {
    const v = (s || '').toLowerCase()
    if (v.includes('agendada')) return 'text-bg-primary'
    if (v.includes('conclu'))   return 'text-bg-success'
    if (v.includes('cancel'))   return 'text-bg-secondary'
    return 'text-bg-light text-dark'
  }
  const proximasSessoes = useMemo(() => {
    const now = new Date()
    return [...sessoes]
      .filter(s => new Date(s.datetime) >= now)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
      .slice(0, 5)
  }, [sessoes])
  function agendarSessaoLocal({ mentee, tema, datetime, duracao }) {
    setSessoes(prev => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map(s => s.id)) + 1 : 1,
        mentee, tema, datetime, status: 'Agendada', feedbackPendente: false, duracao
      }
    ])
  }
  function marcarConcluida(id) {
    setSessoes(prev => prev.map(s => s.id === id ? { ...s, status: 'Concluída', feedbackPendente: true } : s))
  }
  function registrarFeedback(id, nota, comentario) {
    setSessoes(prev => prev.map(s => s.id === id ? ({ ...s, feedbackPendente: false, notaFeedback: nota, comentarioFeedback: comentario }) : s))
  }

  // ---------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------
  if (!group) {
    return (
      <div className="container py-4">
        <h1 className="h4">Painel do Mentor</h1>
        <div className="alert alert-warning">Nenhum grupo disponível.</div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      {/* Seletor de grupo + status de permissão */}
      <div className="row align-items-center mb-3">
        <div className="col-12 col-md d-flex align-items-center gap-3 flex-wrap">
          <h1 className="h4 mb-0">Painel do Mentor</h1>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <label className="form-label mb-0 small text-secondary">Grupo</label>
            <select
              className="form-select form-select-sm"
              style={{ minWidth: 220 }}
              value={currGroup[0]?.id || ""} 
              onChange={(e) => handleGroup(e.target.value)} // carrega detalhes do grupo
            >
              <option value="" disabled>-- selecione --</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} {/* g.mentorOwner.id === currentMentorId ? '• (meu)' : '' */}
                </option>
              ))}
            </select>
          </div>
          <span className={`badge ${isOwner ? 'text-bg-success' : 'text-bg-secondary'}`}>
            {isOwner
              ? `Você é o mentor deste grupo`
              : `Somente leitura • Mentor responsável: ${group.mentorOwner.nome}`}
          </span>
        </div>
        <div className="col-12 col-md-auto d-flex gap-2 justify-content-md-end mt-2 mt-md-0 flex-wrap">
          {/* Offcanvas feedback: pode sempre dar feedback de sessão */}
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasFeedback"
            aria-controls="offcanvasFeedback"
          >
            <i className="bi bi-chat-square-quote me-1" aria-hidden="true"></i>
            Feedback rápido
          </button>
          {/* Modal agenda sessão: independente do grupo */}
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalAgendarSessao"
          >
            <i className="bi bi-calendar-plus me-1" aria-hidden="true"></i>
            Agendar sessão
          </button>
        </div>
      </div>

      {/* Abas: Visão Geral | Grupo (doações) */}
      <ul className="nav nav-tabs mb-3" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="tab-geral-tab" data-bs-toggle="tab" data-bs-target="#tab-geral" type="button" role="tab" aria-controls="tab-geral" aria-selected="true">
            Visão Geral
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="tab-grupo-tab" data-bs-toggle="tab" data-bs-target="#tab-grupo" type="button" role="tab" aria-controls="tab-grupo" aria-selected="false">
            Grupo (doações)
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* ===================== VISÃO GERAL (tema consistente) ===================== */}
        <div className="tab-pane fade show active" id="tab-geral" role="tabpanel" aria-labelledby="tab-geral-tab">
          {/* KPIs do mentor */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Mentorados</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fs-4 fw-semibold">{currGroup[0]?.members ?? "-"}</div>
                    <i className="bi bi-people fs-3 text-primary" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Sessões (próx. 7 dias)</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fs-4 fw-semibold">{"-"}</div>
                    <i className="bi bi-calendar-week fs-3 text-primary" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Feedbacks pendentes</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fs-4 fw-semibold">{"-"}</div>
                    <i className="bi bi-clipboard-check fs-3 text-primary" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Satisfação média</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fs-4 fw-semibold">{"-"}</div>
                    <i className="bi bi-emoji-smile fs-3 text-primary" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sessões + Sidebar */}
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h2 className="h6 mb-0">Minhas sessões</h2>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>Mentorado</th>
                          <th>Tema</th>
                          <th>Data</th>
                          <th>Status</th>
                          <th className="text-end">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...sessoes].sort((a,b) => new Date(b.datetime) - new Date(a.datetime)).map(s => (
                          <tr key={s.id}>
                            <td className="fw-semibold">{s.mentee}</td>
                            <td>{s.tema}</td>
                            <td>{new Date(s.datetime).toLocaleString()}</td>
                            <td><span className={`badge ${statusBadgeSessao(s.status)}`}>{s.status}</span></td>
                            <td className="text-end">
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  title="Marcar como concluída"
                                  onClick={() => marcarConcluida(s.id)}
                                  disabled={s.status === 'Concluída'}
                                >
                                  <i className="bi bi-check2-circle" aria-hidden="true"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  title="Dar feedback"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#offcanvasFeedback"
                                  aria-controls="offcanvasFeedback"
                                  onClick={() => {
                                    const el = document.getElementById('offcanvasFeedback')
                                    el?.setAttribute('data-session-id', String(s.id))
                                  }}
                                >
                                  <i className="bi bi-chat-left-quote" aria-hidden="true"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {sessoes.length === 0 && (
                          <tr><td colSpan="5" className="text-center text-secondary py-4">Nenhuma sessão registrada.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              {/* Meus mentorados */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h2 className="h6 mb-3">Meus mentorados</h2>
                  <ul className="list-group list-group-flush">
                    {mentorados.map(m => (
                      <li key={m.id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <div className="fw-semibold">{m.nome}</div>
                          <span className="small text-secondary">{m.objetivo}</span>
                        </div>
                        <div className="progress mt-2" role="progressbar" aria-valuenow={m.progresso} aria-valuemin="0" aria-valuemax="100">
                          <div className="progress-bar" style={{ width: `${m.progresso}%` }}>{m.progresso}%</div>
                        </div>
                        <div className="small text-secondary mt-1">Última atividade: {new Date(m.ultimaAtividade).toLocaleDateString('pt-BR')}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Próximas sessões */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h2 className="h6 mb-3">Próximas sessões</h2>
                  <ul className="list-unstyled mb-0">
                    {proximasSessoes.map(s => (
                      <li key={s.id} className="mb-2">
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="fw-semibold">{s.mentee}</div>
                            <div className="small text-secondary">{s.tema}</div>
                          </div>
                          <div className="text-end small">{new Date(s.datetime).toLocaleString()}</div>
                        </div>
                      </li>
                    ))}
                    {proximasSessoes.length === 0 && (
                      <li className="text-secondary small">Sem sessões futuras.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Recursos */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="h6 mb-3">Recursos sugeridos</h2>
                  <ul className="list-group list-group-flush">
                    {[
                      { titulo: 'Boas práticas de campanhas de doação', tipo: 'Artigo' },
                      { titulo: 'Guia de metas SMART',                   tipo: 'Checklist' },
                      { titulo: 'Feedbacks que funcionam',               tipo: 'Vídeo' },
                    ].map((r, i) => (
                      <li key={i} className="list-group-item d-flex align-items-center justify-content-between">
                        <span className="fw-semibold">{r.titulo}</span>
                        <span className="badge text-bg-primary">{r.tipo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ===================== GRUPO (tudo focado em doações kg/R$) ===================== */}
        <div className="tab-pane fade" id="tab-grupo" role="tabpanel" aria-labelledby="tab-grupo-tab">
          {/* KPIs / Metas do grupo */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Participantes ativos</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="fs-4 fw-semibold">{currGroup[0]?.members}</div>
                    <i className="bi bi-people fs-3 text-primary" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">Meta (kg) • Atingido</div>
                  <div className="fw-semibold">{currGroup[0]?.food_goal} kg • {currGroup[0]?.current_food_collection} kg</div>
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
                  <div className="fw-semibold">R$ {currGroup[0]?.monetary_target.toLocaleString()} • R$ {currGroup[0]?.current_money_collection.toLocaleString()}</div>
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
                    <div className="fs-4 fw-semibold">{"-"}</div>
                    <i className="bi bi-gift fs-3 text-primary" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de ações do grupo — desabilitar se não for dono */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button
              className="btn btn-outline-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalMetas"
              disabled={!isOwner}
              title={isOwner ? 'Definir metas do grupo' : 'Somente leitura (você não é o mentor deste grupo)'}
            >
              <i className="bi bi-bullseye me-1" aria-hidden="true"></i>
              Definir metas
            </button>
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalDoacao"
              disabled={!isOwner}
              title={isOwner ? 'Registrar doação' : 'Somente leitura (você não é o mentor deste grupo)'}
            >
              <i className="bi bi-gift-fill me-1" aria-hidden="true"></i>
              Registrar doação
            </button>
            {!isOwner && (
              <span className="align-self-center small text-secondary">
                Visualizando <strong>{group.nome}</strong> em modo leitura.
              </span>
            )}
          </div>

          {/* Abinhas internas: Participantes | Doações */}
          <ul className="nav nav-pills mb-3" role="tablist">
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
            <li className="ms-auto">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalAddParticipante"
                  disabled={!isOwner}
                  title={isOwner ? 'Adicionar participante' : 'Somente leitura (você não é o mentor deste grupo)'}
                >
                  <i className="bi bi-person-plus me-1" aria-hidden="true"></i>
                  Adicionar participante
                </button>
              </div>
            </li>
          </ul>

          <div className="tab-content">
            {/* PARTICIPANTES */}
            <div className="tab-pane fade show active" id="tab-participantes" role="tabpanel" aria-labelledby="tab-participantes-tab">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h3 className="h6 mb-0">Participantes de {currGroup[0]?.name}</h3>
                    <div className="input-group" style={{ maxWidth: 320 }}>
                      <span className="input-group-text"><i className="bi bi-search" aria-hidden="true"></i></span>
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Buscar por nome ou e-mail..."
                        value={qPart}
                        onChange={e => setQPart(e.target.value)}
                      />
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
                        {members.map(p => {
                          const kg = somaPorParticipante(p.id, 'kg')
                          const brl = somaPorParticipante(p.id, 'brl')
                          return (
                            <tr key={p.id} className={p.status == 1 ? 'table-light' : ''}>
                              <td className="fw-semibold">{p.name}</td>
                              <td>{p.email}</td>
                              <td>{new Date(p.created_at).toLocaleDateString('pt-BR')}</td>
                              <td className="text-center">
                                <span className={`badge ${p.status == 1 ? 'text-bg-success' : 'text-bg-secondary'}`}>
                                  {p.status == 1 ? 'Ativo' : 'Inativo'}
                                </span>
                              </td>
                              <td className="text-center">{p.current_food_collection}</td>
                              <td className="text-center">R$ {p.current_money_collection}</td>
                              <td className="text-end">
                                <div className="btn-group">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    title={isOwner ? 'Registrar doação' : 'Somente leitura'}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalDoacao"
                                    onClick={() => {
                                      if (!isOwner) return
                                      const sel = document.querySelector('#modalDoacao select[name="participanteId"]')
                                      if (sel) sel.value = String(p.id)
                                    }}
                                    disabled={!isOwner}
                                  >
                                    <i className="bi bi-gift" aria-hidden="true"></i>
                                  </button>

                                  {p.ativo ? (
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      title={isOwner ? 'Remover (inativar)' : 'Somente leitura'}
                                      onClick={() => removerParticipante(p.id)}
                                      disabled={!isOwner}
                                    >
                                      <i className="bi bi-person-dash" aria-hidden="true"></i>
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-outline-secondary"
                                      title={isOwner ? 'Reativar' : 'Somente leitura'}
                                      onClick={() => reativarParticipante(p.id)}
                                      disabled={!isOwner}
                                    >
                                      <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                        {participantesFiltrados.length === 0 && (
                          <tr><td colSpan="7" className="text-center text-secondary py-4">Nenhum participante encontrado para “{qPart}”.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>

            {/* DOAÇÕES */}
            <div className="tab-pane fade" id="tab-doacoes" role="tabpanel" aria-labelledby="tab-doacoes-tab">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h3 className="h6 mb-0">Doações de {group.nome}</h3>
                    <div className="input-group" style={{ maxWidth: 320 }}>
                      <span className="input-group-text"><i className="bi bi-search" aria-hidden="true"></i></span>
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Buscar por nome, tipo ou data..."
                        value={qDoacao}
                        onChange={e => setQDoacao(e.target.value)}
                      />
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
                        {[...doacoesFiltradas].sort((a,b) => new Date(b.data) - new Date(a.data)).map(d => {
                          const p = (group.participantes || []).find(x => x.id === d.participanteId)
                          return (
                            <tr key={d.id}>
                              <td>{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                              <td>{p?.nome || '—'}</td>
                              <td>{d.tipo === 'kg' ? 'Alimento (kg)' : 'Dinheiro (R$)'}</td>
                              <td className="text-end">
                                {d.tipo === 'kg' ? `${Number(d.quantidade).toFixed(1)} kg` : `R$ ${Number(d.quantidade).toLocaleString()}`}
                              </td>
                            </tr>
                          )
                        })}
                        {doacoesFiltradas.length === 0 && (
                          <tr><td colSpan="4" className="text-center text-secondary py-4">Nenhuma doação registrada para “{qDoacao}”.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===================== MODAIS / OFFCANVAS ===================== */}
      {/* Modal: Agendar sessão */}
      <div className="modal fade" id="modalAgendarSessao" tabIndex="-1" aria-labelledby="modalAgendarSessaoLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const mentee = form.mentee.value
              const tema = form.tema.value
              const data = form.data.value
              const hora = form.hora.value
              const duracao = form.duracao.value
              const datetime = `${data}T${hora}`
              agendarSessaoLocal({ mentee, tema, datetime, duracao })
              form.reset()
            }}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalAgendarSessaoLabel">Agendar sessão</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Mentorado</label>
                  <select name="mentee" className="form-select" defaultValue="" required>
                    <option value="" disabled>Selecione...</option>
                    {mentorados.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tema</label>
                  <input name="tema" type="text" className="form-control" placeholder="Assunto da sessão" required />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">Data</label>
                    <input name="data" type="date" className="form-control" required />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Hora</label>
                    <input name="hora" type="time" className="form-control" required />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label">Duração (min)</label>
                  <input name="duracao" type="number" min="15" step="15" className="form-control" placeholder="60" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Agendar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Offcanvas: Feedback rápido */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasFeedback" aria-labelledby="offcanvasFeedbackLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasFeedbackLabel" className="offcanvas-title">Feedback rápido</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar"></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={(e) => {
            e.preventDefault()
            const el = document.getElementById('offcanvasFeedback')
            const idStr = el?.getAttribute('data-session-id')
            const sessId = idStr ? parseInt(idStr, 10) : null
            if (sessId) {
              const form = e.currentTarget
              const nota = Number(form.nota.value)
              const comentario = form.comentario.value
              registrarFeedback(sessId, nota, comentario)
              form.reset()
            }
          }}>
            <div className="mb-3">
              <label className="form-label">Nota (1 a 5)</label>
              <select name="nota" className="form-select" defaultValue="5" required>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Comentário</label>
              <textarea name="comentario" className="form-control" rows="3" placeholder="O que foi bem? O que melhorar?"></textarea>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" data-bs-dismiss="offcanvas">
                <i className="bi bi-send me-1" aria-hidden="true"></i>
                Enviar feedback
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: Definir/editar metas (somente dono) */}
      <div className="modal fade" id="modalMetas" tabIndex="-1" aria-labelledby="modalMetasLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => {
              e.preventDefault()
              if (!isOwner) return
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
                  <input name="kg" type="number" min="0" step="0.1" defaultValue={group.metas.kg} className="form-control" required disabled={!isOwner} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Meta em R$</label>
                  <input name="brl" type="number" min="0" step="1" defaultValue={group.metas.brl} className="form-control" required disabled={!isOwner} />
                </div>
                {!isOwner && (
                  <div className="alert alert-secondary small mb-0">
                    Você não é o mentor responsável por este grupo — edição bloqueada.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Fechar</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={!isOwner}>Salvar metas</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal: Adicionar participante (somente dono) */}
      <div className="modal fade" id="modalAddParticipante" tabIndex="-1" aria-labelledby="modalAddParticipanteLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => {
              e.preventDefault()
              if (!isOwner) return
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
                  <input name="nome" type="text" className="form-control" placeholder="Nome completo" required disabled={!isOwner} />
                </div>
                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input name="email" type="email" className="form-control" placeholder="pessoa@empresa.com" required disabled={!isOwner} />
                </div>
                {!isOwner && (
                  <div className="alert alert-secondary small mb-0">
                    Você não é o mentor responsável por este grupo — adição bloqueada.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Fechar</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={!isOwner}>Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal: Registrar doação (somente dono) */}
      <div className="modal fade" id="modalDoacao" tabIndex="-1" aria-labelledby="modalDoacaoLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => {
              e.preventDefault()
              if (!isOwner) return
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
                  <select name="participanteId" className="form-select" defaultValue="" required disabled={!isOwner}>
                    <option value="" disabled>Selecione...</option>
                    {(group.participantes || []).map(p => (
                      <option key={p.id} value={p.id} disabled={!p.ativo}>
                        {p.nome} {p.ativo ? '' : '(inativo)'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label">Tipo</label>
                    <select name="tipo" className="form-select" defaultValue="kg" disabled={!isOwner}>
                      <option value="kg">Alimento (kg)</option>
                      <option value="brl">Dinheiro (R$)</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">Quantidade</label>
                    <input name="quantidade" type="number" min="0.1" step="0.1" className="form-control" placeholder="Ex.: 10" required disabled={!isOwner} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label">Data</label>
                  <input name="data" type="date" className="form-control" defaultValue={new Date().toISOString().slice(0,10)} disabled={!isOwner} />
                </div>
                {!isOwner && (
                  <div className="alert alert-secondary small mb-0">
                    Você não é o mentor responsável por este grupo — registro de doação bloqueado.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Fechar</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={!isOwner}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}
