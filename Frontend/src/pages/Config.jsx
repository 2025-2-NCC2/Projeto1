import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Config() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Fetch simples para o backend
    fetch("http://localhost:3000/api/users/list")
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
      // Inicializa o DataTable após os dados serem renderizados
      $('#tabelaUsuarios').DataTable({
        destroy: true, // necessário para reinicializar se já existir
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
                <Link /* to={} */>
                  <img src="delete.png" className="delete-img" alt="Excluir" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Config;
