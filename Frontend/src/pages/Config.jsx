import { useEffect, useState } from "react";

function Config() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Simulação de fetch — substitua pela sua API real
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
            { width: "150px", targets: 4 }
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
            <th class="dt-center">ID</th>
            <th class="">Nome</th>
            <th class="">Email</th>
            <th class="dt-left">Data de Cadastro</th>
            <th class="dt-center">Ação</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td className="dt-center">{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td className="dt-left">{user.dataCadastro}</td>
              <td className="dt-center">
                <button>Editar</button>
                <button>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Config;
