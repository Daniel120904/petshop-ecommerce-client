const API_URL = "http://localhost:3000/api";

const dataInicioInput = document.getElementById("dataInicio");
const dataFimInput = document.getElementById("dataFim");
const formFiltro = document.querySelector("form");
const tbody = document.querySelector("tbody");

const statusBadges = {
  processamento: { class: "bg-warning", text: "EM PROCESSAMENTO" },
  aprovada: { class: "bg-info", text: "APROVADA" },
  reprovada: { class: "bg-danger", text: "REPROVADA" },
  transito: { class: "bg-secondary", text: "EM TRÂNSITO" },
  emTroca: { class: "bg-danger", text: "EM TROCA" },
  trocaAutorizada: { class: "bg-success", text: "TROCA AUTORIZADA" },
  entregue: { class: "bg-success", text: "ENTREGUE" },
};

function formatarData(dataISO) {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function gerarBotoesAcao(venda) {
  const { id, status } = venda;

  switch (status) {
    case "processamento":
      return `
        <button class="btn btn-success btn-sm" onclick="atualizarStatus(${id}, 'aprovada')">
          Aprovar Pagamento
        </button>
        <button class="btn btn-danger btn-sm" onclick="atualizarStatus(${id}, 'reprovada')">
          Reprovar Pagamento
        </button>
      `;

    case "aprovada":
      return `
        <button class="btn btn-primary btn-sm" onclick="atualizarStatus(${id}, 'transito')">
          Enviar para Transporte
        </button>
      `;

    case "transito":
      return `
        <button class="btn btn-dark btn-sm" onclick="atualizarStatus(${id}, 'entregue')">
          Confirmar Entrega
        </button>
      `;

    case "emTroca":
      return `
        <button class="btn btn-warning btn-sm" onclick="atualizarStatus(${id}, 'trocaAutorizada')">
          Autorizar Troca
        </button>
      `;

    case "entregue":
    case "trocaAutorizada":
    case "reprovada":
      return '<span class="text-muted">Sem ações disponíveis</span>';

    default:
      return '<span class="text-muted">Status desconhecido</span>';
  }
}

function renderizarTabela(vendas) {
  if (!vendas || vendas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">
          Nenhuma venda encontrada
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = vendas
    .map((venda) => {
      const badge = statusBadges[venda.status] || {
        class: "bg-secondary",
        text: venda.status.toUpperCase(),
      };

      return `
      <tr>
        <td>${venda.id}</td>
        <td>${venda.user.nome}</td>
        <td>${formatarData(venda.createdAt)}</td>
        <td>
          <span class="badge ${badge.class}">${badge.text}</span>
        </td>
        <td>${gerarBotoesAcao(venda)}</td>
      </tr>
    `;
    })
    .join("");
}

async function carregarVendas(filtros = {}) {
  try {
    const params = new URLSearchParams();
    if (filtros.dataStart) {
      params.append("dataStart", filtros.dataStart);
    }
    if (filtros.dataEnd) {
      params.append("dataEnd", filtros.dataEnd);
    }

    const url = `${API_URL}/getSales${
      params.toString() ? "?" + params.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar vendas");
    }

    const vendas = await response.json();
    renderizarTabela(vendas);
  } catch (error) {
    console.error("Erro:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">
          Erro ao carregar vendas. Tente novamente.
        </td>
      </tr>
    `;
  }
}

async function atualizarStatus(id, novoStatus) {
  if (!confirm(`Deseja realmente alterar o status desta venda?`)) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/updateStatusSale`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: novoStatus }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar status");
    }

    const filtros = obterFiltros();
    await carregarVendas(filtros);

    alert("Status atualizado com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar status. Tente novamente.");
  }
}

function obterFiltros() {
  const filtros = {};

  if (dataInicioInput.value) {
    filtros.dataStart = dataInicioInput.value;
  }

  if (dataFimInput.value) {
    filtros.dataEnd = dataFimInput.value;
  }

  return filtros;
}

formFiltro.addEventListener("submit", (e) => {
  e.preventDefault();
  const filtros = obterFiltros();
  carregarVendas(filtros);
});

document.addEventListener("DOMContentLoaded", () => {
  carregarVendas();
});

window.atualizarStatus = atualizarStatus;
