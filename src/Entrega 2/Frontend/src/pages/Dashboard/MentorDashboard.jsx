
import { useEffect, useState, useMemo } from 'react';
import { fetchGroups, fetchMembers, updateGoal, fetchGroup } from '../../services/groupService';
import { registerDonation, analyzeExtract, fetchDonations, getLastDonation } from '../../services/donationService';
import { getMentorSession } from '../../services/sessionService';
import { deactivateParticipant } from '../../services/userService';
import { DataTableWrapper } from '../../hooks/DataTableWrapper';
import { Modal, Button } from 'react-bootstrap';
import { useLogout } from '../../hooks/resetSession';

export default function MentorDashboard() {
  const [showMetasModal, setShowMetasModal] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [members, setMembers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [sessionData, setSessionData] = useState();
  const [resultadoAnalise, setResultadoAnalise] = useState(null);
  const [group, setGroup] = useState([]);
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [activeSection, setActiveSection] = useState("visaoGeral"); // controla navegação lateral
  const [showDoacaoModal, setShowDoacaoModal] = useState(false);
  const [lastDonation, setLastDonation] = useState([]);

  const columns = ['Nome', 'E-mail', 'Entrada', 'Status', 'Doado (kg)', 'Doado (R$)', 'Ação'];
  const columnsDonation = ['Participante', 'Tipo', 'Data', 'Quantidade', 'Anexo', 'Validação Extrato'];

  const [formData, setFormData] = useState({
    participanteId: null,
    tipo: 0,
    quantidade: null,
    data: new Date().toISOString().slice(0, 10),
    file: {}
  });
  const logout = useLogout();

  const [newGoal, setNewGoal] = useState({ kg: "", brl: "" });

  const ativos = members.filter(user => user.status === 1);
  const totalAtivos = ativos.length;

  const currUserInfo = members.filter(idMem => idMem.id === sessionData?.id);
  /* console.log(currUserInfo); */

  useEffect(() => {
    const table = document.querySelector('.display');

    const handleClick = (e) => {
      if (e.target.closest('[data-id]')) {
        const id = e.target.closest('[data-id]').getAttribute('data-id');
        const type = e.target.closest('[data-type]')?.getAttribute('data-type');
        if (type == 0 && type) { handleDeactivate(id); } else if (type == 1) { handleDeactivate(id, 1) }
      }
    };

    table?.addEventListener('click', handleClick);

    return () => {
      table?.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    const session = getMentorSession();
    setSessionData(session);
  }, []);

  useEffect(() => {
    fetchDonations().then(data => setDonations(data.donations));
    fetchGroups().then(info => setGrupos(info.groups));
  }, []);
  console.log(group);

  useEffect(() => {
    const idGroup = sessionData?.groupId;
    if (idGroup) {
      fetchMembers(idGroup).then(m => setMembers(m));
      fetchGroup(idGroup).then(g => setGroup(g))
    }
  }, [sessionData]);


  useEffect(() => {
    const userId = sessionData?.id;
    if (userId) {
      getLastDonation(userId).then(don => setLastDonation(don));
    }
  }, [sessionData]);
  console.log(lastDonation.donations);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleNewGoal = async (e) => {
    e.preventDefault();
    if (newGoal.kg === "" && newGoal.brl === "") {
      alert("Informe pelo menos uma meta");
      return;
    }
    try {
      await updateGoal(
        sessionData?.groupId,
        newGoal.kg !== "" ? parseFloat(newGoal.kg) : null,
        newGoal.brl !== "" ? parseFloat(newGoal.brl) : null
      );
      window.location.reload();
      alert("Metas salvas com sucesso!");
    } catch (error) {
      alert("Erro ao salvar metas");
    }
  };

  const handleChange = async (e) => {
    const { name, type, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });

    // Se for um comprovante, analisar automaticamente
    if (name === "file" && files[0]) {
      setLoadingAnalise(true);
      setResultadoAnalise(null);

      const resultado = await analyzeExtract(files[0]);
      setResultadoAnalise(resultado);

      setLoadingAnalise(false);
    }
  };

  const handleDoacao = async (e) => {
    e.preventDefault();

    // Inclui flag de legitimidade no envio
    const payload = {
      ...formData,
      score: resultadoAnalise?.score ?? null,
      idGroup: sessionData?.groupId,
    };

    await registerDonation(payload);
    window.location.reload();
    alert('Doação registrada com sucesso!');
  };

  const handleDeactivate = async (memberId, active = 0) => {
    const c = confirm(`Tem certeza que deseja ${active == 1 ? 'reativar' : 'desativar'} este participante ?`);
    if (!c) return;
    try {
      if (active === 1) { await deactivateParticipant(memberId, active); } else { await deactivateParticipant(memberId, active); }
      window.location.reload();
      alert(`Participante ${active == 1 ? 'reativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      alert('Erro ao desativar participante.');
      console.error(error);
    }
  };

  const renderRow = (p) => [
    p.name,
    p.email,
    p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : '-',
    p.status === 1 ? '<span class="badge bg-success">Ativo</span>' : '<span class="badge bg-secondary">Inativo</span>',
    `${p.current_food_collection ?? 0} kg`,
    `R$ ${(p.current_money_collection ?? 0).toFixed(2)}`,
    `
      <div class="btn-group">
        ${p.status === 1
      ? `<button class="btn btn-sm btn-outline-danger" onclick="" data-id="${p.id}" data-type="0"><i class="bi bi-person-dash"></i></button>`
      : `<button class="btn btn-sm btn-outline-secondary" data-id="${p.id}" data-type="1"><i class="bi bi-arrow-counterclockwise"></i></button>`}
      </div>
    `
  ];

  const renderRowDonations = (p) => {
    /* console.log(members) */
    const member = members?.find(m => m.id == p.user_agent);
    return [
      member ? member.name : "Desconhecido",
      p.type === 1 ? 'Dinheiro' : 'Alimento',
      p.inserted_at ? new Date(p.inserted_at).toLocaleDateString('pt-BR') : '-',

      // convertemos o badge JSX para string HTML
      p.type === 1 ? `R$ ${(p.quantity ?? 0).toFixed(2)}` : `${p.quantity ?? 0} kg`,
      p.proof
        ? (() => {
          const fileName = p.proof.replace(/^uploads[\\/]/, ""); // remove o prefixo uploads\ ou uploads/
          return `<a href="http://localhost:3000/api/${p.proof}" target="_blank" rel="noopener noreferrer">${fileName}</a>`;
        })()
        : "—",
      p.score_fraud
    ];
  };

  const progressoKg = useMemo(() => {
    const metaKg = Number(group?.[0]?.food_goal) || 0;
    const atualKg = Number(group?.[0]?.current_food_collection) || 0;
    return metaKg > 0 ? Math.min(100, Math.round((atualKg / metaKg) * 100)) : 0;
  }, [group?.[0]]);

  const progressoBRL = useMemo(() => {
    const metaBRL = Number(group?.[0]?.monetary_target) || 0;
    const atualBRL = Number(group?.[0]?.current_money_collection) || 0;
    return metaBRL > 0 ? Math.min(100, Math.round((atualBRL / metaBRL) * 100)) : 0;
  }, [group?.[0]]);

  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <div className="sidebar shadow-sm border-end p-3 justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="avatar-circle"><i className="bi bi-person-fill"></i></div>
            <div>
              <h6 className="mb-1 fw-semibold">Mentor</h6>
              <h7 className="text-muted">{sessionData?.name}</h7>
              <br />
              <small className="text-success" style={{ fontSize: '14px', opacity: '0.5' }}>Online</small>
            </div>
          </div>
          <div>
            <nav className="sidebar-nav d-flex flex-column gap-2">
              <button className={`nav-link ${activeSection === "visaoGeral" ? "active" : ""}`} onClick={() => setActiveSection("visaoGeral")}>
                <i className="bi bi-speedometer2 me-2"></i>Visão Geral
              </button>
              <button className={`nav-link ${activeSection === "grupo" ? "active" : ""}`} onClick={() => setActiveSection("grupo")}>
                <i className="bi bi-people me-2"></i>Meu Grupo
              </button>
              <button className={`nav-link ${activeSection === "doacoes" ? "active" : ""}`} onClick={() => setActiveSection("doacoes")}>
                <i className="bi bi-gift me-2"></i>Minhas Doações
              </button>
              <button className={`nav-link ${activeSection === "perfil" ? "active" : ""}`} onClick={() => setActiveSection("perfil")}>
                <i className="bi bi-person me-2"></i>Perfil
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content p-4 flex-grow-1 bg-light">
        {activeSection === "visaoGeral" && (
          <>
            <div>
              <div className="section-header d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 mb-0">Minhas Doações</h1>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowMetasModal(true)}
                  >
                    <i className="bi bi-bullseye me-1"></i>
                    Definir metas
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowDoacaoModal(true)}
                    className="btn-custom"
                  >
                    <i className="bi bi-gift-fill me-2"></i>
                    Nova Doação
                  </Button>
                </div>
              </div>
              <div className="row g-3">
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-secondary small">Participantes ativos</div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="fs-4 fw-semibold">{totalAtivos}</div>
                          <i className="bi bi-people fs-3 text-primary" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div><div className="col-12 col-md-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-secondary small">Meta (kg) • Atingido</div>
                        <div className="fw-semibold">{group?.[0]?.food_goal} kg • {group?.[0]?.current_food_collection} kg</div>
                        <div className="progress mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressoKg}>
                          <div className="progress-bar bg-success" title={progressoKg + '%'} style={{ width: `${progressoKg}%` }}>{progressoKg}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-secondary small">Meta (R$) • Atingido</div>
                        <div className="fw-semibold">R$ {group?.[0]?.monetary_target} • R$ {group?.[0]?.current_money_collection?.toFixed(2)}</div>
                        <div className="progress mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressoBRL}>
                          <div className="progress-bar bg-info" title={progressoBRL + '%'} style={{ width: `${progressoBRL}%` }}>{progressoBRL}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <div className="text-secondary small">Doações registradas</div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="fs-4 fw-semibold">{donations.length}</div>
                          <i className="bi bi-gift fs-3 text-primary" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 tab-pane fade show active" id="tab-participantes" role="tabpanel" aria-labelledby="tab-participantes-tab">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex mt-3 mb-4 fw-bold align-items-center justify-content-between flex-wrap gap-2 ">
                    <h5 className="fw-bold mb-0">Participantes do grupo <span style={{ color: "#1eb31e" }}>{grupos?.name}</span></h5>
                  </div>

                  <div className="table-responsive overflow-x-hidden">
                    <DataTableWrapper
                      data={members}
                      columns={columns}
                      renderRow={renderRow}
                    />
                  </div>

                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "grupo" && (
          <>
            <div className="row g-3">
              <div className="section-header d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 mb-0">Minhas Doações</h1>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowMetasModal(true)}
                  >
                    <i className="bi bi-bullseye me-1"></i>
                    Definir metas
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowDoacaoModal(true)}
                    className="btn-custom"
                  >
                    <i className="bi bi-gift-fill me-2"></i>
                    Nova Doação
                  </Button>
                </div>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-secondary small">Participantes ativos</div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="fs-4 fw-semibold">{totalAtivos}</div>
                        <i className="bi bi-people fs-3 text-primary" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-secondary small">Meta (kg) • Atingido</div>
                      <div className="fw-semibold">{grupos?.food_goal} kg • {grupos?.current_food_collection} kg</div>
                      <div className="progress mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressoKg}>
                        <div className="progress-bar bg-success" title={progressoKg + '%'} style={{ width: `${progressoKg}%` }}>{progressoKg}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-secondary small">Meta (R$) • Atingido</div>
                      <div className="fw-semibold">R$ {grupos?.monetary_target} • R$ {grupos?.current_money_collection?.toFixed(2)}</div>
                      <div className="progress mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressoBRL}>
                        <div className="progress-bar bg-info" title={progressoBRL + '%'} style={{ width: `${progressoBRL}%` }}>{progressoBRL}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-secondary small">Doações registradas</div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="fs-4 fw-semibold">{donations.length}</div>
                        <i className="bi bi-gift fs-3 text-primary" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-4 tab-pane fade show active" id="tab-participantes" role="tabpanel" aria-labelledby="tab-participantes-tab">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex mt-3 mb-4 fw-bold align-items-center justify-content-between flex-wrap gap-2 ">
                      <h5 className="fw-bold mb-0">Doações do grupo <span style={{ color: "#1eb31e" }}>{grupos?.name}</span></h5>
                    </div>

                    <DataTableWrapper data={donations} columns={columnsDonation} renderRow={renderRowDonations} orderColunm={2} order={'desc'} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "doacoes" && (
          <>
            <div className="section-header d-flex justify-content-between align-items-center mb-4">
              <h1 className="h4 mb-0">Minhas Doações</h1>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowMetasModal(true)}
                >
                  <i className="bi bi-bullseye me-1"></i>
                  Definir metas
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowDoacaoModal(true)}
                  className="btn-custom"
                >
                  <i className="bi bi-gift-fill me-2"></i>
                  Nova Doação
                </Button>
              </div>
            </div>
            <div className="row g-4">
              {/* Card Última Doação */}
              <div className="col-12 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-muted">
                      <i className="bi bi-clock-history me-2"></i>
                      Última Doação
                    </h6>
                    <p className="mb-1">
                      <span className="fw-bold">Tipo:</span> {lastDonation.donations[0].type === 1 ? 'Dinheiro' : 'Alimento'}
                    </p>
                    <p className="mb-1">
                      <span className="fw-bold">Quantidade: </span>
                      {lastDonation?.donations[0].quantity}
                      {lastDonation?.donations[0].type === 1 ? ' (R$)' : ' (kg)'}
                    </p>
                    <p className="mb-0">
                      <span className="fw-bold">Data:</span> {lastDonation.donations[0].inserted_at ? new Date(lastDonation.donations[0].inserted_at).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Total Doado */}
              <div className="col-12 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-muted">
                      <i className="bi bi-box-seam me-2"></i>
                      Total em Alimentos
                    </h6>
                    <h3 className="mb-0 fw-bold text-success">{currUserInfo[0].current_food_collection || ''} (kg)</h3>
                  </div>
                </div>
              </div>

              {/* Card Total em Dinheiro */}
              <div className="col-12 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-muted">
                      <i className="bi bi-cash-coin me-2"></i>
                      Total em Dinheiro
                    </h6>
                    <h3 className="mb-0 fw-bold text-success">R$ {currUserInfo[0].current_money_collection || ''}</h3>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "perfil" && (
          <>
            <div className="section-header mb-4 ">
              <h1 className="h4 mb-0">Meu Perfil</h1>
            </div>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="avatar-circle me-3">
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <div className='mt-3'>
                    <h5 className="mb-1">Colaborador</h5>
                    <p className="mb-0 text-muted">{sessionData?.email}</p>
                  </div>
                </div>
                <hr />
                <div className="mb-4">
                  <h6 className="mb-2">Informações Pessoais</h6>
                  <p className="mb-1 mt-4">
                    <strong>Nome:</strong> {sessionData?.name}
                  </p>
                  <p className="mb-0">
                    <strong>Endereço:</strong> A ser preenchido
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de Doação */}
      <Modal
        size="lg"
        show={showDoacaoModal}
        onHide={() => setShowDoacaoModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nova Doação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleDoacao}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Participante</label>
              <select
                name="participanteId"
                className="form-select"
                value={formData.participanteId || ""}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                {(members || []).map((p) => (
                  <option key={p.id} value={p.id} disabled={!p.status}>
                    {p.name} {p.status === 1 ? "" : "(inativo)"}
                  </option>
                ))}
              </select>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Tipo</label>
                <select
                  name="tipo"
                  className="form-select"
                  value={formData.tipo || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="0">Alimento (kg)</option>
                  <option value="1">Dinheiro (R$)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Quantidade</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-box-seam"></i>
                  </span>
                  <input
                    name="quantidade"
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="form-control"
                    placeholder="Ex.: 10"
                    value={formData.quantidade || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label fw-semibold">Data</label>
              <input
                required
                name="data"
                type="date"
                className="form-control"
                value={formData.data}
                onChange={handleChange}
              />
            </div>

            <div className="mt-3">
              <label className="form-label fw-semibold">
                Comprovante (opcional)
              </label>
              <input
                type="file"
                name="file"
                className="form-control"
                onChange={handleChange}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <small className="text-muted">
                Formatos aceitos: JPG, PNG, PDF
              </small>
              <br />
              {loadingAnalise && (
                <small className="text-info">Analisando arquivo...</small>
              )}

              {resultadoAnalise && !loadingAnalise && (
                <>
                  <div className="mt-2">
                    {resultadoAnalise.erro ? (
                      <small className="text-danger">
                        Erro ao analisar o comprovante.
                      </small>
                    ) : (
                      <>
                        <small
                          className={
                            resultadoAnalise.legitimo
                              ? "text-success"
                              : "text-warning"
                          }
                        >
                          {resultadoAnalise.legitimo
                            ? `Comprovante parece legítimo (${(
                              resultadoAnalise.score * 100
                            ).toFixed(1)}%)`
                            : `Suspeito (${(
                              resultadoAnalise.score * 100
                            ).toFixed(1)}%)`}
                        </small>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>


            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowDoacaoModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Registrar Doação
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={showMetasModal} onHide={() => setShowMetasModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Definir metas do grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleNewGoal}>
            <div className="mb-3">
              <label className="form-label">Meta em kg</label>
              <input
                value={newGoal.kg}
                onChange={handleOnChange}
                name="kg"
                type="number"
                min="0"
                step="0.1"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Meta em R$</label>
              <input
                value={newGoal.brl}
                onChange={handleOnChange}
                name="brl"
                type="number"
                min="0"
                step="1"
                className="form-control"
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={() => setShowMetasModal(false)}>
                Fechar
              </Button>
              <Button type="submit" variant="primary">
                Salvar metas
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
