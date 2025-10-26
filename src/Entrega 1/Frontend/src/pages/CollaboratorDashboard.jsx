import { useMemo, useState } from "react";
import ModalDoacao from '../components/modalDoacao';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function CollaboratorDashboard() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tarefas, setTarefas] = useState([
    {
      id: 1,
      titulo: "Separar cestas básicas para entrega",
      projeto: "Doações Alimentares",
      equipe: "Logística",
      prioridade: "Alta",
      vencimento: "2025-10-05",
      progresso: 60,
      status: "Em andamento",
    }
  ]);

  const [q, setQ] = useState("");
  const [atividadeError, setAtividadeError] = useState("");

  // Metas de doação
  const kgTarget = 500;
  const kgCurrent = 0;
  const moneyTarget = 2000;
  const moneyCurrent = 0;

  const kgPercent = (kgCurrent / kgTarget) * 100;
  const moneyPercent = (moneyCurrent / moneyTarget) * 100;

  const kgCurrentFmt = kgCurrent.toLocaleString("pt-BR");
  const kgTargetFmt = kgTarget.toLocaleString("pt-BR");
  const moneyCurrentFmt = moneyCurrent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const moneyTargetFmt = moneyTarget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const groups = [
    { id: 1, moneyColor: "#3b82f6", kgColor: "#22c55e" },
  ];

  const chartData = [
    { semana: "Semana 1", grupo1Money: 100, grupo1Kg: 50 },
    { semana: "Semana 2", grupo1Money: 150, grupo1Kg: 70 },
    { semana: "Semana 3", grupo1Money: 120, grupo1Kg: 60 },
    { semana: "Semana 4", grupo1Money: 180, grupo1Kg: 80 },
  ];

  const tarefasFiltradas = useMemo(() => {
    const termo = q.trim().toLowerCase();
    if (!termo) return tarefas;
    return tarefas.filter(
      (t) =>
        t.titulo.toLowerCase().includes(termo) ||
        t.projeto.toLowerCase().includes(termo) ||
        t.equipe.toLowerCase().includes(termo)
    );
  }, [q, tarefas]);

  const kpis = useMemo(() => {
    const minhasEquipes = new Set(tarefas.map((t) => t.equipe)).size;
    const abertas = tarefas.filter((t) => t.progresso < 100).length;
    const projetos = new Set(tarefas.map((t) => t.projeto)).size;
    const mensagens = 3;
    return { minhasEquipes, abertas, projetos, mensagens };
  }, [tarefas]);

  function adicionarTarefaLocal(tarefa) {
    setTarefas((prev) => [
      {
        id: prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1,
        ...tarefa,
      },
      ...prev,
    ]);
  }

  function handleRegistrarAtividade(e) {
    e.preventDefault();
    const form = e.target;
    const titulo = form.titulo?.value?.trim();
    const projeto = form.projeto?.value?.trim();

    if (!titulo || !projeto) {
      setAtividadeError("Por favor, preencha os campos obrigatórios: título e projeto.");
      return;
    }

    const descricao = form.descricao?.value || "";
    const equipe = form.equipe?.value || "Equipe";
    const prioridade = form.prioridade?.value || "Média";
    const vencimento = form.vencimento?.value || new Date().toISOString().slice(0, 10);

    adicionarTarefaLocal({
      titulo,
      projeto,
      equipe,
      prioridade,
      vencimento,
      progresso: 0,
      status: "Novo",
    });

    form.reset();
    setQ("");
    setAtividadeError("");

    try {
      const modalEl = document.getElementById("modalRegistrarAtividade");
      if (modalEl) {
        const bsModal = window.bootstrap?.Modal?.getInstance(modalEl) ?? new window.bootstrap.Modal(modalEl);
        bsModal.hide();
      }
    } catch (err) {
      console.warn("Não foi possível fechar o modal programaticamente", err);
    }
  }

  return (
    <div className="dashboard-container py-4">

      {/* KPIs */}
      <div className="row g-3 mb-4">
        {[
          { label: "Minhas equipes", value: kpis.minhasEquipes, icon: "people", color: "#0ea5e9" },
          { label: "Tarefas abertas", value: kpis.abertas, icon: "list-check", color: "#f97316" },
          { label: "Projetos", value: kpis.projetos, icon: "kanban", color: "#10b981" },
          { label: "Mensagens", value: kpis.mensagens, icon: "chat-dots", color: "#6366f1" },
        ].map((kpi, i) => (
          <div className="col-12 col-md-6 col-lg-3" key={i}>
            <div className="card kpi-card shadow-sm h-100">
              <div className="card-body">
                <div className="text-secondary small">{kpi.label}</div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fs-4 fw-semibold">{kpi.value}</div>
                  <div
                    className="kpi-icon d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: kpi.color }}
                  >
                    <i className={`bi bi-${kpi.icon} text-white fs-5`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Metas de doação */}
      <div className="card donation-card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h6 fw-bold text-success mb-3">Minhas metas de doação</h2>

          {/* Meta em kg */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-secondary small">
                Meta em kg: <strong>{kgTargetFmt}</strong>
              </span>
              <span className="fw-semibold text-dark">{kgCurrentFmt} kg</span>
            </div>
            <div className="progress custom-progress">
              <div
                className="progress-bar bg-success fw-semibold"
                style={{ width: `${kgPercent}%` }}
              >
                {kgPercent.toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Meta em R$ */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-secondary small">
                Meta em R$: <strong>{moneyTargetFmt}</strong>
              </span>
              <span className="fw-semibold text-dark">{moneyCurrentFmt}</span>
            </div>
            <div className="progress custom-progress">
              <div
                className="progress-bar bg-info fw-semibold"
                style={{ width: `${moneyPercent}%` }}
              >
                {moneyPercent.toFixed(0)}%
              </div>
            </div>
          </div>

          <button className="btn custom-btn-register w-100" onClick={() => setMostrarModal(true)}>
            <i className="bi bi-plus-lg me-1"></i> Registrar doação
          </button>
        </div>
      </div>
      <ModalDoacao mostrar={mostrarModal} fecharModal={() => setMostrarModal(false)} />

      {/* Gráficos */}
      {["Dinheiro (R$)", "Alimentos (Kg)"].map((tipo, idx) => (
        <div className="card chart-card shadow-sm mb-4" key={idx}>
          <div className="card-body">
            <h2 className="h6 mb-3 text-dark">Evolução das Doações em {tipo}</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="semana" stroke="#374151" />
                  <YAxis
                    label={{
                      value: tipo.includes("R$") ? "R$" : "Kg",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#374151" },
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  {groups.map((group) => (
                    <Line
                      key={`${tipo.includes("R$") ? "money" : "kg"}-${group.id}`}
                      type="monotone"
                      dataKey={`grupo${group.id}${tipo.includes("R$") ? "Money" : "Kg"}`}
                      stroke={tipo.includes("R$") ? group.moneyColor : group.kgColor}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name={`Grupo ${group.id} (${tipo.includes("R$") ? "R$" : "Kg"})`}
                    />
                    
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        .dashboard-container {
          background: linear-gradient(180deg, #f9fafb 0%, #eef2f7 100%);
          min-height: 100vh;
          padding: 2rem;
        }

        .btn-gradient {
          background: linear-gradient(90deg, #2563eb, #22c55e);
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.2rem;
          transition: 0.3s;
        }

        .btn-gradient:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }

        .kpi-card {
          border: none;
          border-radius: 16px;
          background-color: #ffffff;
          transition: all 0.25s ease;
        }

        .kpi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .kpi-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .donation-card, .chart-card {
          border-radius: 16px;
          border: none;
          background-color: #ffffff;
        }

        .custom-progress {
          height: 10px;
          border-radius: 10px;
          background-color: #f3f4f6;
        }

        .custom-btn-register {
          background-color: #22b77e;
          border: none;
          color: #fff;
          border-radius: 10px;
          padding: 10px 0;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(34, 183, 126, 0.3);
        }

        .custom-btn-register:hover {
          background-color: #1ea36f;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
