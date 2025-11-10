import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";

DataTable.use(DT);

export const DataTableWrapper = forwardRef(({ data = [], columns = [], renderRow, orderColunm=0, order='asc', columnsTarget=[3], columnsClass='text-center' }, ref) => {
  const tableRef = useRef();

  // Atualiza tabela quando os dados mudam
  useEffect(() => {
    if (!tableRef.current) return;
    const table = tableRef.current.dt();

    table.clear();
    table.rows.add(data.map((item, i) => renderRow(item, i)));
    table.draw(false);
  }, [data, renderRow]);

  // Expor função refresh()
  useImperativeHandle(ref, () => ({
    refresh: (newData) => {
      if (tableRef.current) {
        const table = tableRef.current.dt();
        table.clear();
        table.rows.add(newData.map((item, i) => renderRow(item, i)));
        table.draw(false);
      }
    },
  }));

  return (
    <DataTable
      ref={tableRef}
      data={data.map((item, i) => renderRow(item, i))}
      className="display table table-striped align-middle"
      options={{
        paging: true,
        searching: true,
        order: [[orderColunm, order]],
        info: false,
        lengthChange: false, // remove seletor de quantidade
        searchPlaceholder: "Buscar por nome ou e-mail...",
        destroy: true,
        dom:
          "tr" +
          "<'row mt-3 d-flex align-items-center justify-content-between'<'col-auto'p><'col-auto'f>", // ✅ paginação esquerda, busca direita
        initComplete: function () {
          const input = document.querySelector("div.dt-search input");
          
          if (!input) return;

          const parent = input.parentNode;
          if (!parent) return;

          // Cria o container do input estilizado
          const wrapper = document.createElement("div");
          wrapper.className = "input-group";
          wrapper.style.minWidth = "330px";
          wrapper.style.minHeight = "45px";

          // Ícone da lupa
          const span = document.createElement("span");
          span.className = "input-group-text";
          span.innerHTML = '<i class="bi bi-search" aria-hidden="true"></i>';

          // Configura o input existente
          input.classList.add("form-control");
          input.setAttribute("placeholder", "Buscar por nome ou e-mail...");

          wrapper.appendChild(span);
          wrapper.appendChild(input);

          // Substitui o conteúdo original
          parent.innerHTML = "";
          parent.appendChild(wrapper);
        },
        language: {
          search: "",
          paginate: {
            previous: "‹",
            next: "›",
          },
        },
        columnDefs: [
          {
            targets: "_all",
            render: (data) => (typeof data === "string" ? data : String(data)),
          },
          {
            targets: 0,
            width: '13%'
          },
          {
            targets: columnsTarget,
            className: columnsClass,
          },
        ],
      }}
    >
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
        </tr>
      </thead>
    </DataTable>
  );
});