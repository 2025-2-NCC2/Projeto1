import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Outlet, Navigate } from 'react-router-dom'
import './App.css'

// Layout
import Layout from './components/Layout/Layout'

// Pages
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Admin from './pages/admin/Admin'
import Colab from './pages/colab/Colab'
import Groups from './pages/groups/Groups'
import Donations from './pages/donations/Donations'
import QRCodePage from './pages/qrcode/QRCode'
import AI from './pages/ai/AI'

// 1. Componente para agrupar as rotas que precisam de Layout e autenticação
function ProtectedLayout({ user, onLogout }) {
  if (!user) {
    // Se não há usuário, redireciona para a página de login
    return <Navigate to="/login" />
  }

  // Se o usuário existe, renderiza o Layout que, por sua vez, renderizará a página filha
  return (
    <Layout user={user} onLogout={onLogout} showSidebar={true}>
      <Outlet /> {/* O <Outlet> renderiza a rota filha (ex: Dashboard, Admin, etc.) */}
    </Layout>
  )
}


// Simple placeholder component for unimplemented pages
function PlaceholderPage({ title, icon }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">Esta página está em desenvolvimento.</p>
        <button 
          onClick={() => window.location.hash = '/dashboard'}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  )
}

// --- O Componente Principal com a Lógica do Roteador ---

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Este hook agora funciona aqui

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Routes>
      {/* Rotas públicas SEM Layout */}
      <Route element={<Layout user={user} onLogout={handleLogout} showSidebar={false} />}>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Route>

      {/* Rotas protegidas COM Layout */}
      <Route element={<ProtectedLayout user={user} onLogout={handleLogout} />}>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/admin" element={<Admin user={user} />} />
        <Route path="/colab" element={<Colab user={user} />} />
        <Route path="/groups" element={<Groups user={user} />} />
        <Route path="/donations" element={<Donations user={user} />} />
        <Route path="/qr-code" element={<QRCodePage user={user} />} />
        <Route path="/ai" element={<AI user={user} />} />
        <Route path="/names" element={<PlaceholderPage title="Nomes" icon="👥" />} />
        <Route path="/indicators" element={<PlaceholderPage title="3 Indicadores" icon="📊" />} />
        <Route path="/metrics" element={<PlaceholderPage title="Índices e Metas" icon="🎯" />} />
        <Route path="/list" element={<PlaceholderPage title="Listas" icon="📋" />} />
      </Route>

      {/* Rota não encontrada */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


// --- O Componente que é exportado (Apenas um invólucro) ---

export default function App() {
  return <AppContent />;
}