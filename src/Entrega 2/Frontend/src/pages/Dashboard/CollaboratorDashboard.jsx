import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { registerDonation, getLastDonation, analyzeExtract } from "../../services/donationService";
import { getMentorSession } from '../../services/sessionService';
import { getDashboard } from '../../services/sessionService';
import { totalUserDonation } from "../../services/userService";
import { fetchMembers } from "../../services/groupService";
import { DataTableWrapper } from "../../hooks/DataTableWrapper";

export default function CollaboratorDashboard() {
  const [showDoacaoModal, setShowDoacaoModal] = useState(false);
  const [activeSection, setActiveSection] = useState("doacoes");
  const [sessionData, setSessionData] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [resultadoAnalise, setResultadoAnalise] = useState(null);
  const [lastDonation, setLastDonation] = useState([]);
  const [usrDonation, setUsrDonation] = useState([]);
  const [members, setMembers] = useState([]);
  const currFoodColl = usrDonation?.user?.[0].current_food_collection;
  const currMoneyColl = usrDonation?.user?.[0].current_money_collection;
  const columns = ['Nome', 'E-mail', 'Entrada', 'Status', 'Doado (kg)', 'Doado (R$)'];
  const [formData, setFormData] = useState({
    participanteId: null,
    tipo: 0,
    quantidade: null,
    data: new Date().toISOString().slice(0, 10),
    file: {}
  });
  console.log(sessionData);

  useEffect(() => {
    const idGroup = sessionData?.groupId;
    if (idGroup) {
      fetchMembers(idGroup).then(m => setMembers(m));
    }
  }, [sessionData]);

  useEffect(() => {
    const userId = sessionData?.id;
    if (userId) {
      totalUserDonation(userId).then(don => setUsrDonation(don));
    }
  }, [sessionData]);
  console.log(usrDonation?.user?.[0].current_food_collection);

  useEffect(() => {
    const userId = sessionData?.id;
    if (userId) {
      getLastDonation(userId).then(don => setLastDonation(don));
    }
  }, [sessionData]);
  console.log(lastDonation.donations);

  useEffect(() => {
    const session = getMentorSession();
    setSessionData(session);
  }, []);

  const renderRow = (p) => [
    p.name,
    p.email,
    p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : '-',
    p.status === 1 ? '<span class="badge bg-success">Ativo</span>' : '<span class="badge bg-secondary">Inativo</span>',
    `${p.current_food_collection ?? 0} kg`,
    `R$ ${(p.current_money_collection ?? 0).toFixed(2)}`,
  ];

  async function loadProfileData() {
    try {
      console.log(sessionData);
      const session = getMentorSession();
      setSessionData(session);
      const { data } = await getDashboard('colaborador', sessionData?.token);
      setProfileData(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleDoacao = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();

      // Inclui flag de legitimidade no envio
      const payload = {
        ...formData,
        score: resultadoAnalise?.score ?? null,
        idGroup: sessionData?.groupId,
        participanteId: sessionData?.id
      };

      await registerDonation(payload);
      window.location.reload();
      alert('Doação registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar doação:', error);
      alert("Erro ao registrar doação. Tente novamente.");
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

  return (
    <div className="dashboard-container" style={{ maxWidth: '107em' }}>
      <div className="d-flex ">
        {/* Sidebar */}
        <div className="sidebar shadow-sm border-end">
          <div className="p-3 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <div className="avatar-circle">
                <i className="bi bi-person-fill"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-semibold">Colaborador</h6>
                <h7 className="text-muted">{sessionData?.name}</h7>
                <br />
                <small className="text-success" style={{ fontSize: '14px', opacity: '0.5' }}>Online</small>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {[
              { id: "doacoes", icon: "gift", label: "Minhas Doações" },
              { id: "grupo", icon: "bi bi-people", label: "Meu Grupo" },
              { id: "perfil", icon: "person", label: "Meu Perfil" },
            ].map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <i className={`bi bi-${item.icon} me-2`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        

        {/* Área Principal */}
        <div className="main-content p-4 bg-light">
          {/* Seção de Doações */}
          {activeSection === "doacoes" && (
            <>
              <div className="section-header d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 mb-0">Minhas Doações</h1>
                <Button
                  variant="primary"
                  onClick={() => setShowDoacaoModal(true)}
                  className="btn-custom"
                >
                  <i className="bi bi-gift-fill me-2"></i>
                  Nova Doação
                </Button>
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
                        <span className="fw-bold">Tipo:</span> {(lastDonation?.donations?.[0].type === 1 ? 'Dinheiro' : 'Alimento') || '-'}
                      </p>
                      <p className="mb-1">
                        <span className="fw-bold">Quantidade: </span>
                        {lastDonation?.donations?.[0].quantity || ''}
                        {lastDonation?.donations?.[0].type === 1 ? ' (R$)' : ' (kg)'}
                      </p>
                      <p className="mb-0">
                        <span className="fw-bold">Data:</span> {lastDonation?.donations?.[0].inserted_at ? new Date(lastDonation?.donations?.[0].inserted_at).toLocaleDateString('pt-BR') : '-'}
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
                      <h3 className="mb-0 fw-bold text-success">{currFoodColl} (kg)</h3>
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
                      <h3 className="mb-0 fw-bold text-success">R$ {currMoneyColl}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Seção de Perfil */}
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
        {activeSection === 'grupo' && (
          <>
          
            <div className="mt-4 tab-pane fade show" style={{width: '-webkit-fill-available'}}>
              <div className="section-header d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 mb-0">Doações do Grupo</h1>
                <Button
                  variant="primary"
                  onClick={() => setShowDoacaoModal(true)}
                  className="btn-custom"
                >
                  <i className="bi bi-gift-fill me-2"></i>
                  Nova Doação
                </Button>
              </div>
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex mt-3 mb-4 fw-bold align-items-center justify-content-between flex-wrap gap-2 ">
                    <h5 className="fw-bold mb-0">Participantes do grupo <span style={{ color: "#1eb31e" }}>{sessionData?.groupName}</span></h5>
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

        {/* Modal de Nova Doação */}
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
      </div>
    </div>
  );
}
