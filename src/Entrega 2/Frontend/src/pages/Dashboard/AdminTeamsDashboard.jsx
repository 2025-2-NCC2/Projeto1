import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { fetchGroups, fetchTotalGroups } from "../../services/groupService";
import { DataTableWrapper } from "../../hooks/DataTableWrapper";
import { fetchDonations } from "../../services/donationService";
import { fetchUsersList, fetchMentor } from "../../services/userService";
import { getMentorSession } from "../../services/sessionService";

export default function AdminTeamsDashboard() {
  const [showModalRegistrarGrupo, setShowModalRegistrarGrupo] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: "",
    members: 1,
    monetary_target: "",
    food_goal: "",
  });
  const [showMetasModal, setShowMetasModal] = useState(false);
  const [showModalRegistrarMembro, setShowModalRegistrarMembro] =
    useState(false);
  const [activeSection, setActiveSection] = useState("visaoGeral");
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [resultadoAnalise, setResultadoAnalise] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDoacaoModal, setShowDoacaoModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [donations, setDonations] = useState([]);
  const columnsDonation = [
    "Nome do Grupo",
    "Participante",
    "Tipo",
    "Data",
    "Quantidade",
    "Anexo",
    "Validação Extrato",
  ];
  const columns = [
    "Nome do Grupo",
    "Mentor",
    "Entrada",
    "Status",
    "Total (kg)",
    "Total (R$)",
    "Ação",
  ];
  const [total, setTotal] = useState([]);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([{ nome: "", email: "" }]);
  const [sessionData, setSessionData] = useState();
  const [tipo, setTipo] = useState("");
  const [mentorList, setMentorList] = useState([]);
  const [email, setEmail] = useState("");

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [filteredDonations, setFilteredDonations] = useState([]);
  console.log(selectedGroupId);

  const [formData, setFormData] = useState({
    participanteId: null,
    tipo: null,
    quantidade: null,
    data: new Date().toISOString().slice(0, 10),
    file: {},
    // campos do modal de membro
    name: "",
    email: "",
    password: "",
    type: "",
    group_id: "",
    status: "1",
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  useEffect(() => {
    const session = getMentorSession();
    setSessionData(session);
  }, []);

  const handleRegistrarMembro = async (e) => {
    e.preventDefault();
    setRegistrationError("");

    // Validação básica
    if (!formData.name) {
      setRegistrationError("Nome é obrigatório.");
      alert("Preencha o nome do membro.");
      return;
    }

    if (!formData.email) {
      setRegistrationError("E-mail é obrigatório.");
      alert("Preencha o e-mail do membro.");
      return;
    }
    const email = formData.email.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      setRegistrationError("E-mail inválido.");
      alert("Digite um e-mail válido!");
      return;
    }

    if (!formData.type || !formData.group_id) {
      setRegistrationError("Tipo e Grupo são obrigatórios.");
      alert("Preencha tipo e grupo.");
      return;
    }

    setRegistrationLoading(true);

    try {
      const payload = {
        nome: formData.name.trim(),
        email,
        tipo: formData.type,
        groupId: parseInt(formData.group_id),
        invitedByUserId: sessionData?.id || null,
      };

      const res = await fetch("http://localhost:3000/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        const message = data.error || data.message || `Erro ${res.status}`;
        setRegistrationError(message);
        alert(message);
        return;
      }

      // sucesso
      alert("Membro registrado com sucesso!");
      setShowModalRegistrarMembro(false);

      // limpa campos relacionados a membro
      setFormData((prev) => ({
        ...prev,
        participanteId: null,
        tipo: null,
        quantidade: null,
        data: new Date().toISOString().slice(0, 10),
        file: {},
        name: "",
        email: "",
        password: "",
        type: "",
        group_id: "",
        status: "1",
      }));

      // atualiza lista de usuários/membros
      const usersData = await fetchUsersList();
      setUsers(usersData.users || []);
    } catch (err) {
      console.error("Erro ao registrar membro:", err);
      setRegistrationError(err.message || "Erro ao registrar membro.");
      alert(err.message || "Erro ao registrar membro. Veja console.");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleSelectGroup = (e) => {
    const groupId = parseInt(e.target.value);
    setSelectedGroupId(groupId);

    if (!groupId) {
      setFilteredDonations([]); // limpa quando não há seleção
      return;
    }

    const filtradas = donations.filter((don) => don.id_group === groupId);
    setFilteredDonations(filtradas);
  };

  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrarGrupo = async (e) => {
    e.preventDefault();
    // validação básica
    if (!groupForm.name || !groupForm.members) {
      alert("Preencha nome e número de membros do grupo.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupForm.name.trim(),
          members: parseInt(groupForm.members) || 0,
          monetary_target: parseFloat(groupForm.monetary_target) || 0,
          food_goal: parseFloat(groupForm.food_goal) || 0,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || `Erro ${res.status} ao criar grupo.`);
        return;
      }

      // sucesso: fechar modal e recarregar lista de grupos
      setShowModalRegistrarGrupo(false);
      setGroupForm({
        name: "",
        members: 1,
        monetary_target: "",
        food_goal: "",
      });
      const groupsData = await fetchGroups();
      setGroups(groupsData.groups || []);
      alert("Grupo criado com sucesso!");
    } catch (err) {
      console.error("Erro ao criar grupo:", err);
      alert("Erro ao criar grupo. Veja o console.");
    }
  };

  const renderRow = (p) => {
    const mentor = mentorList?.find((g) => g.group_id == p.id);
    console.log(mentor);
    return [
      p.name,
      mentor ? mentor.name : "-",
      p.created_at ? new Date(p.created_at).toLocaleDateString("pt-BR") : "-",
      p.status === 1
        ? '<span class="badge bg-success">Ativo</span>'
        : '<span class="badge bg-secondary">Inativo</span>',
      `${p.current_food_collection ?? 0} kg`,
      `R$ ${(p.current_money_collection ?? 0).toFixed(2)}`,
      `
      <div class="btn-group">
        ${
          p.status === 1
            ? `<button class="btn btn-sm btn-outline-danger" onclick="" data-id="${p.id}" data-type="0"><i class="bi bi-person-dash"></i></button>`
            : `<button class="btn btn-sm btn-outline-secondary" data-id="${p.id}" data-type="1"><i class="bi bi-arrow-counterclockwise"></i></button>`
        }
      </div>
    `,
    ];
  };
  const renderRowDonations = (p) => {
    /* console.log(members) */
    const member = users?.find((m) => m.id == p.user_agent);
    const group = groups?.find((d) => d.id == p.id_group);
    return [
      group ? group.name : "-",
      member ? member.name : "Desconhecido",
      p.type === 1 ? "Dinheiro" : "Alimento",
      p.inserted_at ? new Date(p.inserted_at).toLocaleDateString("pt-BR") : "-",

      // convertemos o badge JSX para string HTML
      p.type === 1
        ? `R$ ${(p.quantity ?? 0).toFixed(2)}`
        : `${p.quantity ?? 0} kg`,
      p.proof
        ? (() => {
            const fileName = p.proof.replace(/^uploads[\\/]/, ""); // remove o prefixo uploads\ ou uploads/
            return `<a href="http://localhost:3000/api/${p.proof}" target="_blank" rel="noopener noreferrer">${fileName}</a>`;
          })()
        : "—",
      p.score_fraud,
    ];
  };

  useEffect(() => {
    fetchDonations().then((data) => setDonations(data.donations));
    fetchTotalGroups().then((data) => setTotal(data.groups));
    fetchUsersList().then((data) => setUsers(data.users));
    fetchMentor().then((data) => setMentorList(data.mentor));
  }, []);
  console.log(mentorList);

  useEffect(() => {
    /* fetchDonations().then(data => setDonations(data.donations)); */
    fetchGroups().then((data) => setGroups(data.groups));
  }, []);
  /* console.log(groups); */
  const [newGoal, setNewGoal] = useState({ kg: "", brl: "" });

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

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoacao = async (e) => {
    e.preventDefault();
    /* console.log(formData); */
    await registerDonation(formData);
    alert("Doação registrada com sucesso!");
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  // ======= Função para enviar convite =======

  const handleConvidar = async (e) => {
    e.preventDefault();

    // ===== Validações =====
    if (!tipo || !email || !groupId || !invitedByUserId) {
      alert("Preencha todos os campos!");
      return;
    }

    // Validação simples de formato de e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      alert("Digite um e-mail válido!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/convidar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          tipo,
          groupId,
          invitedByUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Erro: ${data.error || "Falha ao enviar convite."}`);
        return;
      }

      alert(`Convite enviado para ${email} como ${tipo}!`);
      setEmail("");
      setTipo("");
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      alert("Erro ao enviar convite. Verifique o console.");
    }
  };

  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <div className="sidebar shadow-sm border-end p-3">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="avatar-circle">
            <i className="bi bi-person-fill"></i>
          </div>
          <div>
            <h6 className="mb-1 fw-semibold">Administrador</h6>
            <small className="text-muted">Online</small>
          </div>
        </div>
        <nav className="sidebar-nav d-flex flex-column gap-2">
          <button
            className={`nav-link ${
              activeSection === "visaoGeral" ? "active" : ""
            }`}
            onClick={() => setActiveSection("visaoGeral")}
          >
            <i className="bi bi-speedometer2 me-2"></i>Visão Geral
          </button>
          <button
            className={`nav-link ${
              activeSection === "equipes" ? "active" : ""
            }`}
            onClick={() => setActiveSection("equipes")}
          >
            <i className="bi bi-diagram-3 me-2"></i>Doações
          </button>
          <button
            className={`nav-link ${
              activeSection === "doacoes" ? "active" : ""
            }`}
            onClick={() => setActiveSection("doacoes")}
          >
            <i className="bi bi-gift me-2"></i>Doações
          </button>
          <button
            className={`nav-link ${activeSection === "perfil" ? "active" : ""}`}
            onClick={() => setActiveSection("perfil")}
          >
            <i className="bi bi-person me-2"></i>Meu Perfil
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content p-4 flex-grow-1 bg-light">
        {activeSection === "visaoGeral" && (
          <>
            <div className="section-header d-flex justify-content-between align-items-center mb-4">
              <h1 className="h4 mb-4">Dashboard de Equipes</h1>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowModalRegistrarGrupo(true)}
                >
                  <i className="bi bi-bullseye me-1"></i>
                  Registrar Grupo
                </Button>
              </div>
            </div>
            <div className="row g-3 mb-4">
              {[
                {
                  label: "Equipes",
                  valor: total?.total_groups,
                  icon: "bi-diagram-3",
                },
                {
                  label: "Membros",
                  valor: total?.total_members,
                  icon: "bi-people",
                },
                {
                  label: "Total de KG's doados",
                  valor: total?.total_food?.toFixed(2),
                  icon: "bi-kanban",
                },
                {
                  label: "Total de R$ arrecadado",
                  valor: total?.total_money?.toFixed(2),
                  icon: "bi-currency-dollar",
                },
              ].map((kpi, i) => (
                <div className="col-12 col-md-6 col-lg-3" key={i}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-secondary small">{kpi.label}</div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="fs-4 fw-semibold">{kpi.valor}</div>
                        <i className={`bi ${kpi.icon} fs-3 text-primary`}></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="mt-4 tab-pane fade show active"
                id="tab-participantes"
                role="tabpanel"
                aria-labelledby="tab-participantes-tab"
              >
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex mt-3 mb-4 fw-bold align-items-center justify-content-between flex-wrap gap-2 ">
                      <h5 className="fw-bold mb-0">Lista de Grupos</h5>
                    </div>

                    <div className="table-responsive overflow-x-hidden">
                      <DataTableWrapper
                        data={groups}
                        columns={columns}
                        renderRow={renderRow}
                        orderColunm={0}
                        order={"asc"}
                        columnsTarget={[1, 2, 3, 4, 5, 6]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "equipes" && (
          <>
            <div className="section-header d-flex justify-content-between align-items-center mb-4">
              <h4>Selecione um grupo</h4>
              <div className="d-flex gap">
                <select
                  className="form-select mb-3"
                  style={{ width: "15em" }}
                  onChange={handleSelectGroup}
                >
                  <option value="">-- Escolha --</option>
                  {groups?.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!selectedGroupId && (
              <DataTableWrapper
                data={[]}
                columns={columnsDonation}
                renderRow={renderRowDonations}
                orderColunm={3}
                order={"desc"}
                columnsTarget={[1, 2, 3, 4, 5, 6]}
              />
            )}

            {selectedGroupId && (
              <div>
                <div
                  className="mt-4 tab-pane fade show active"
                  id="tab-participantes"
                  role="tabpanel"
                  aria-labelledby="tab-participantes-tab"
                >
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex mt-3 mb-4 fw-bold align-items-center justify-content-between flex-wrap gap-2 ">
                        <h5 className="fw-bold mb-0">
                          Doações do grupo{" "}
                          <span style={{ color: "#1eb31e" }}></span>
                        </h5>
                      </div>

                      <DataTableWrapper
                        data={filteredDonations}
                        columns={columnsDonation}
                        renderRow={renderRowDonations}
                        orderColunm={3}
                        order={"desc"}
                        columnsTarget={[1, 2, 3, 4, 5, 6]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === "doacoes" && (
          <>
            <div className="d-flex justify-content-between mb-3">
              <h4>Registrar Doação</h4>
              <Button
                variant="primary"
                onClick={() => setShowModalRegistrarMembro(true)}
              > <i class="bi bi-person-plus-fill"> </i>
                Registrar Membro
              </Button>
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
                  <div className="mt-3">
                    <h5 className="mb-1">Administrador</h5>
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

      {/* Modal Registrar convidado */}
      {/* Modal Registrar Membro */}
      <Modal
        size="lg"
        show={showModalRegistrarMembro}
        onHide={() => setShowModalRegistrarMembro(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Novo Membro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleRegistrarMembro}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nome</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">E-mail</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Tipo</label>
              <select
                name="type"
                className="form-select"
                value={formData.type || ""}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="mentor">Mentor</option>
                <option value="collaborator">Colaborador</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Grupo</label>
              <select
                name="group_id"
                className="form-select"
                value={formData.group_id || ""}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowModalRegistrarMembro(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={registrationLoading}
              >
                {registrationLoading ? "Registrando..." : "Registrar Membro"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal Registrar Doação */}
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
              <Button
                variant="outline-secondary"
                onClick={() => setShowMetasModal(false)}
              >
                Fechar
              </Button>
              <Button type="submit" variant="primary">
                Salvar metas
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal Registrar Grupo */}
      <Modal
        size="lg"
        show={showModalRegistrarGrupo}
        onHide={() => setShowModalRegistrarGrupo(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Novo Grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleRegistrarGrupo}>
            <div className="mb-3">
              <label className="form-label">Nome do Grupo</label>
              <input
                name="name"
                className="form-control"
                value={groupForm.name}
                onChange={handleGroupChange}
                required
              />
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Membros</label>
                <input
                  name="members"
                  type="number"
                  min="1"
                  className="form-control"
                  value={groupForm.members}
                  onChange={handleGroupChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Meta (R$)</label>
                <input
                  name="monetary_target"
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={groupForm.monetary_target}
                  onChange={handleGroupChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Meta (kg)</label>
                <input
                  name="food_goal"
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={groupForm.food_goal}
                  onChange={handleGroupChange}
                />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowModalRegistrarGrupo(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Criar Grupo
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
