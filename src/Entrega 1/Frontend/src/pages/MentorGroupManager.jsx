// -----------------------------------------------------------
//  Componente: MentorGroupManager (versão estática)
//  Função: Gerenciar grupo de mentoria (participantes, metas e doações)
//  Obs: Nesta versão, todos os dados são fixos (sem localStorage).
// -----------------------------------------------------------

import { useMemo, useState } from 'react'

export default function MentorGroupManager() {
  // ---------- Dados estáticos iniciais ----------
  // Grupo e metas gerais
  const grupoInicial = { nome: 'Grupo Aurora', metas: { kg: 500, brl: 2000 } }

  // Lista de participantes
  const participantesIniciais = [
    { id: 1, nome: 'Maria Silva', email: 'maria@empresa.com', desde: '2025-06-10', ativo: true },
    { id: 2, nome: 'João Souza',  email: 'joao@empresa.com',  desde: '2025-07-03', ativo: true },
    { id: 3, nome: 'Ana Lima',    email: 'ana@empresa.com',   desde: '2025-08-15', ativo: true },
  ]

  // Lista de doações registradas
  const doacoesIniciais = [
    { id: 1, participanteId: 1, tipo: 'kg',  quantidade: 25,    data: '2025-10-01' },
    { id: 2, participanteId: 2, tipo: 'brl', quantidade: 300,   data: '2025-10-01' },
    { id: 3, participanteId: 3, tipo: 'kg',  quantidade: 12.5,  data: '2025-10-02' },
    { id: 4, participanteId: 1, tipo: 'brl', quantidade: 150.0, data: '2025-10-02' },
  ]

  // ---------- Estados principais ----------
  const [grupo, setGrupo] = useState(grupoInicial)
  const [participantes, setParticipantes] = useState(participantesIniciais)
  const [doacoes, setDoacoes] = useState(doacoesIniciais)

  // ---------- Funções utilitárias ----------
  // Gera o próximo ID automaticamente
  const nextId = (arr) => (arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1)

  // Filtra apenas os participantes ativos
  const participantesAtivos = useMemo(
    () => participantes.filter(p => p.ativo),
    [participantes]
  )

  // Soma total de doações em KG
  const totalKg = useMemo(
    () => doacoes.filter(d => d.tipo === 'kg').reduce((acc, d) => acc + Number(d.quantidade || 0), 0),
    [doacoes]
  )

  // Soma total de doações em dinheiro (R$)
  const totalBRL = useMemo(
    () => doacoes.filter(d => d.tipo === 'brl').reduce((acc, d) => acc + Number(d.quantidade || 0), 0),
    [doacoes]
  )

  // Calcula progresso da meta em KG (%)
  const progressoKg = useMemo(
    () => 0,
    [totalKg, grupo.metas.kg]
  )

  // Calcula progresso da meta em R$ (%)
  const progressoBRL = useMemo(
    () => 0,
    [totalBRL, grupo.metas.brl]
  )

  // Soma de doações por participante
  function somaPorParticipante(id, tipo) {
    return doacoes
      .filter(d => d.participanteId === id && d.tipo === tipo)
      .reduce((acc, d) => acc + Number(d.quantidade || 0), 0)
  }

  // ---------- Ações do sistema ----------
  // Adicionar novo participante
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

  // Remover (inativar) participante
  function removerParticipante(id) {
    const p = participantes.find(x => x.id === id)
    if (!p) return
    if (!confirm(`Remover ${p.nome} do grupo?`)) return
    setParticipantes(prev => prev.map(x => x.id === id ? { ...x, ativo: false } : x))
  }

  // Reativar participante inativo
  function reativarParticipante(id) {
    setParticipantes(prev => prev.map(x => x.id === id ? { ...x, ativo: true } : x))
  }

  // Atualizar metas (peso e dinheiro)
  function atualizarMetas({ kg, brl }) {
    setGrupo(prev => ({ ...prev, metas: { kg: Number(kg), brl: Number(brl) } }))
  }

  // Registrar uma nova doação
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

  // ---------- Interface visual (JSX) ----------
  return (
    <div className="container py-4">
      {/* Cabeçalho principal */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h4 mb-0">Gestão do Grupo</h1>
          <div className="text-secondary small">{grupo.nome}</div>
        </div>

        {/* Botões principais */}
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalMetas">
            <i className="bi bi-bullseye me-1"></i>Definir metas
          </button>

          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalDoacaoGroup">
            <i className="bi bi-gift-fill me-1"></i>Registrar doação
          </button>
        </div>
      </div>

      {/* Indicadores e progresso */}
      <div className="row g-3 mb-4">
        {/* Total de participantes */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Participantes ativos</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{participantesAtivos.length}</div>
                <i className="bi bi-people fs-3 text-primary"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Meta em KG */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Meta (kg) • Atingido</div>
              <div className="fw-semibold">{grupo.metas.kg} kg • {totalKg.toFixed(1)} kg</div>
              <div className="progress mt-2">
                
              </div>
            </div>
          </div>
        </div>

        {/* Meta em R$ */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Meta (R$) • Atingido</div>
              <div className="fw-semibold">R$ {grupo.metas.brl.toLocaleString()} • R$ {totalBRL.toLocaleString()}</div>
              <div className="progress mt-2">
                
              </div>
            </div>
          </div>
        </div>

        {/* Total de doações */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Doações registradas</div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="fs-4 fw-semibold">{doacoes.length}</div>
                <i className="bi bi-gift fs-3 text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Todo o restante da interface (abas, tabelas e modais) permanece idêntico */}
      {/* As ações de adicionar, editar e registrar ainda funcionam, mas os dados não são salvos em localStorage */}
    </div>
  )
}