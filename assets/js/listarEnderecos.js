document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId) {
    alert("Usuário não especificado.");
    window.location.href = "listarClientes.html";
    return;
  }

  const novoEnderecoBtn = document.querySelector(
    'a[href*="criarEndereco.html"]'
  );
  if (novoEnderecoBtn) {
    novoEnderecoBtn.href = `criarEndereco.html?userId=${userId}`;
  }

  const tabelaBody = document.getElementById("enderecosBody");

  try {
    const res = await fetch(
      `http://localhost:3000/api/getEnderecos?userId=${userId}`
    );
    if (!res.ok) throw new Error("Erro ao buscar endereços");

    const enderecos = await res.json();

    tabelaBody.innerHTML = "";

    if (enderecos.length === 0) {
      tabelaBody.innerHTML = `
              <tr>
                <td colspan="2" class="text-center">Nenhum endereço encontrado</td>
              </tr>
            `;
    } else {
      enderecos.forEach((endereco) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td class="text-start">${endereco.nome}</td>
                <td class="text-end">
                  <a href="editarEndereco.html?enderecoId=${endereco.id}" class="btn btn-warning btn-sm">Editar</a>
                </td>
              `;
        tabelaBody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error(err);
    tabelaBody.innerHTML = `
            <tr>
              <td colspan="2" class="text-center text-danger">Erro ao carregar endereços</td>
            </tr>
          `;
  }
});
