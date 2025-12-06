document.addEventListener("DOMContentLoaded", async () => {
  const tabelaBody = document.querySelector("#tabelaClientes");
  const inputBusca = document.querySelector(".form-control");
  const filtros = document.querySelectorAll(".filtro-opcao");
  const selectAll = document.querySelector("#selectAll");

  function montarQuery() {
    const valorBusca = inputBusca.value.trim();
    const filtrosMarcados = Array.from(filtros).filter((f) => f.checked);

    if (!valorBusca) return "";

    const query = {};

    if (filtrosMarcados.length === 0) {
      query.search = valorBusca;
    } else {
      filtrosMarcados.forEach((filtro) => {
        if (filtro.id === "filtroNome") query.nome = valorBusca;
        if (filtro.id === "filtroCpf") query.cpf = valorBusca;
        if (filtro.id === "filtroEmail") query.email = valorBusca;
        if (filtro.id === "filtroTelefone") query.telefone = valorBusca;
      });
    }

    return new URLSearchParams(query).toString();
  }

  async function carregarClientes() {
    try {
      const query = montarQuery();
      const url = query
        ? `http://localhost:3000/api/getUsersFiltres?${query}`
        : `http://localhost:3000/api/getUsers`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar usuários");

      const users = await response.json();
      tabelaBody.innerHTML = "";

      if (users.length === 0) {
        tabelaBody.innerHTML = `
          <tr>
            <td colspan="3" class="text-center text-muted">Nenhum cliente encontrado</td>
          </tr>`;
        return;
      }

      users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.nome}</td>
          <td class="text-center">
            <a href="editarCliente.html?userId=${
              user.id
            }" class="btn btn-warning btn-sm">Editar</a>
            <a href="editarSenha.html?userId=${
              user.id
            }" class="btn btn-secondary btn-sm">Alterar Senha</a>
            <a href="listarEnderecos.html?userId=${
              user.id
            }" class="btn btn-primary btn-sm">Endereços</a>
            <a href="listarCartoes.html?userId=${
              user.id
            }" class="btn btn-info btn-sm">Cartões</a>
            <a href="listarTransacoes.html?userId=${
              user.id
            }" class="btn btn-dark btn-sm">Transações</a>
            <button class="btn btn-danger btn-sm btnExcluir" data-id="${
              user.id
            }">Excluir</button>
          </td>
          <td class="text-center">
            <div class="form-check form-switch d-flex justify-content-center">
              <input
                class="form-check-input toggle-status"
                type="checkbox"
                ${user.status ? "checked" : ""}
                data-id="${user.id}"
              />
            </div>
          </td>
        `;
        tabelaBody.appendChild(tr);
      });

      document.querySelectorAll(".btnExcluir").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("Deseja excluir este cliente?")) return;
          const userId = btn.getAttribute("data-id");
          try {
            const resp = await fetch(
              `http://localhost:3000/api/deleteUser?userId=${userId}`,
              { method: "DELETE" }
            );
            if (resp.ok) btn.closest("tr").remove();
            else alert("Erro ao excluir usuário.");
          } catch (err) {
            console.error(err);
            alert("Erro ao excluir usuário.");
          }
        });
      });

      document.querySelectorAll(".toggle-status").forEach((chk) => {
        chk.addEventListener("change", async () => {
          const userId = chk.getAttribute("data-id");
          const status = chk.checked;

          try {
            const resp = await fetch(
              "http://localhost:3000/api/updateStatusUser",
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: Number(userId), status }),
              }
            );

            if (!resp.ok) {
              alert("Erro ao atualizar status.");
              chk.checked = !status;
            }
          } catch (err) {
            console.error(err);
            chk.checked = !status;
          }
        });
      });
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      tabelaBody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-danger">Erro ao carregar clientes</td>
        </tr>`;
    }
  }

  await carregarClientes();

  inputBusca.addEventListener("input", carregarClientes);

  filtros.forEach((filtro) =>
    filtro.addEventListener("change", carregarClientes)
  );

  selectAll.addEventListener("change", () => {
    filtros.forEach((filtro) => (filtro.checked = selectAll.checked));
    carregarClientes();
  });
});
