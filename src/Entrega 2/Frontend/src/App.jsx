import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Home from "./pages/Home/Home.jsx";
import Footer from "./components/Footer.jsx";
import "./responsive.css";

import Login from "./pages/Login/Login.jsx";
import Cadastro from "./pages/Login/Cadastro.jsx";
import ForgotPassword from "./pages/Login/ForgotPassword.jsx";
import ResetPassword from "./pages/Login/ResetPassword.jsx";
import Config from "./pages/Config.jsx";
import AboutUs from "./pages/About/AboutUs";

import AdminTeamsDashboard from "./pages/Dashboard/AdminTeamsDashboard.jsx";
import CollaboratorDashboard from "./pages/Dashboard/CollaboratorDashboard.jsx";
import MentorDashboard from "./pages/Dashboard/MentorDashboard.jsx";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/config" element={<Config />} />

        {/*  Página Sobre Nós */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/admin/dashboard" element={<AdminTeamsDashboard />} />

        {/* Páginas de recuperação */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin */}
        <Route path="/admin/painel" element={<AdminTeamsDashboard />} />

        {/* Colaborador */}
        <Route path="/colaborador/painel" element={<CollaboratorDashboard />} />

        {/* Mentor */}
        <Route path="/mentor/painel" element={<MentorDashboard />} />
      </Routes>
      <Footer/>
    </>
  );
}
