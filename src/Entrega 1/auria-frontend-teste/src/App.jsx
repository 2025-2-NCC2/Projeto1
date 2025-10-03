import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Config from './pages/Config.jsx'

// Admin (atenção ao case do arquivo!)
import AdminLogin from './pages/adminLogin.jsx'
import AdminTeamsDashboard from './pages/AdminTeamsDashboard.jsx'

// Colaborador
import CollaboratorLogin from './pages/CollaboratorLogin.jsx'
import CollaboratorDashboard from './pages/CollaboratorDashboard.jsx'

// Mentor
import MentorLogin from './pages/MentorLogin.jsx'
import MentorDashboard from './pages/MentorDashboard.jsx'
import MentorGroupManager from './pages/MentorGroupManager.jsx' // <-- importar

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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

        {/* (Opcional) 404 */}
        {/* <Route path="*" element={<div className="container py-5"><h1 className="h4">Página não encontrada</h1></div>} /> */}
      </Routes>
    </Router>
  )
}