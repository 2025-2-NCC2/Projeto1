import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Config() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Fetch simples para o backend
    fetch("https://auria-sepia.vercel.app/api/users/list") // dev: http://localhost:3000/api/users/list
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data.users);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
      });
  }, []);

  useEffect(() => {
    
if (usuarios.length > 0) {
      const table = $('#tabelaUsuarios').DataTable();
      if (table) {
        table.destroy();
      }

      $('#tabelaUsuarios').DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json"
        },
        columnDefs: [
          { width: "50px", targets: 0 },
          { width: "250px", targets: 1 },
          { width: "120px", targets: 4 }
        ]
      });
    }
  }, [usuarios]);

  
  const handleDelete = async (id, name) => {
      if (!window.confirm(`Deseja realmente excluir o usuário ${name}?`)) return;

      try {
        const response = await fetch(`https://auria-sepia.vercel.app/api/users/${id}`, { // dev: http://localhost:3000/api/users/${id}
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();
        if (response.ok) {
          alert(`Usuário ${name} excluído com sucesso!`);
          setUsuarios((prev) => prev.filter((u) => u.id !== id));
        } else {
          alert(data.error || "Erro ao excluir usuário");
        }
      } catch (err) {
        alert("Erro ao conectar com o servidor");
      }
    };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de usuários</h1>

      <table id="tabelaUsuarios" className="display">
        <thead>
          <tr>
            <th style={{borderLeft: "1px solid #ddd"}} className="dt-center">ID</th>
            <th className="">Nome</th>
            <th className="">Email</th>
            <th className="dt-left">Data de Cadastro</th>
            <th className="dt-center action">Ação</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td className="dt-center td-style">{user.id}</td>
              <td className="td-style">{user.name}</td>
              <td className="td-style">{user.email}</td>
              <td className="dt-left td-style">{user.created_at}</td>
              <td className="dt-center td-style action">
                <Link /* to={} */>
                  <img src="edit.png" className="update-img" alt="Editar" />
                </Link>
                <button style={{ background: "none", border: "none", padding: 0 }} onClick={() => handleDelete(user.id, user.name)}>
                  <img src="delete.png" className="delete-img" alt="Excluir" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Config;
