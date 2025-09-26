import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header.jsx";
import Home from "./pages/Home.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Config from "./pages/Config.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* Rota Config */}
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/config" element={<Config />} /> {/* Rota Config */}
      </Routes>
    </Router>
  );
}

export default App;
