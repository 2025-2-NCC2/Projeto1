import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import Home from "./pages/Home.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import LoginColab from "./pages/LoginColab.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Config from "./pages/Config.jsx"; // Nova página

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login-colab" element={<LoginColab />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/config" element={<Config />} /> {/* Rota Config */}
      </Routes>
    </Router>
  );
}

export default App;
