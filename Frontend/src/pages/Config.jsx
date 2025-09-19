import { useState } from "react";

function Config() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDelete = async () => {
    // ----------------------
    // FUTURO: integração com backend
    // ----------------------
    /*
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // se usar JWT
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Usuário ${email} excluído com sucesso!`);
      } else {
        alert(data.error || "Erro ao excluir usuário");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor");
    }
    */

    // Por enquanto, só alerta
    alert(`Excluindo usuário: ${email}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Configurações</h1>
      <div style={{ maxWidth: "400px" }}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <button 
          onClick={handleDelete} 
          style={{ marginTop: "10px" }}
        >
          Excluir Usuário
        </button>
      </div>
    </div>
  );
}

export default Config;
