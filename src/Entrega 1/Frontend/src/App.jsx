import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import LoginSplit from "./pages/LoginSplit.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Config from "./pages/Config.jsx";

// Admin
import AdminLogin from "./pages/adminLogin.jsx";
import AdminTeamsDashboard from "./pages/AdminTeamsDashboard.jsx";

// Colaborador
import CollaboratorLogin from "./pages/CollaboratorLogin.jsx";
import CollaboratorDashboard from "./pages/CollaboratorDashboard.jsx";

// Mentor
import MentorLogin from "./pages/MentorLogin.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";
import MentorGroupManager from "./pages/MentorGroupManager.jsx";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/split" element={<LoginSplit />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/config" element={<Config />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/painel" element={<AdminTeamsDashboard />} />

        {/* Colaborador */}
        <Route path="/colaborador" element={<CollaboratorLogin />} />
        <Route path="/colaborador/painel" element={<CollaboratorDashboard />} />

        {/* Mentor */}
        <Route path="/mentor" element={<MentorLogin />} />
        <Route path="/mentor/painel" element={<MentorDashboard />} />
        <Route path="/mentor/grupo" element={<MentorGroupManager />} />

        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/mentor" element={<MentorLogin />} />
        <Route path="/login/colaborador" element={<CollaboratorLogin />} />
      </Routes>
    </>
  );
}
