const API_BASE_URL = "http://localhost:3000/api";

const form = document.querySelector("form");
const dataInicioInput = document.getElementById("dataInicio");
const dataFimInput = document.getElementById("dataFim");

let graficoVendas = null;
let graficoCategoria = null;

document.addEventListener("DOMContentLoaded", async () => {
  await carregarCategorias();
  await carregarDados();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await carregarDados();
});

function formatarDataParaInput(data) {
  return data.toISOString().split("T")[0];
}

function formatarDataExibicao(dataString) {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

async function carregarCategorias() {
  try {
    const response = await fetch(`${API_BASE_URL}/getCategories`);
    const categorias = await response.json();

    const filtroDiv = document.querySelector(".row.g-3.mb-4");
    const colCategoria = document.createElement("div");
    colCategoria.className = "col-md-4";
    colCategoria.innerHTML = `
      <label for="categoria" class="form-label">Categoria (Opcional)</label>
      <select id="categoria" class="form-control">
        <option value="">Todas as categorias</option>
        ${categorias
          .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
          .join("")}
      </select>
    `;

    const colBotao = filtroDiv.querySelector(".col-md-4.d-flex");
    filtroDiv.insertBefore(colCategoria, colBotao);

    document
      .getElementById("categoria")
      .addEventListener("change", async () => {
        await carregarDados();
      });
  } catch (error) {}
}

async function carregarDados() {
  const dataInicio = dataInicioInput.value;
  const dataFim = dataFimInput.value;
  const categoriaId = document.getElementById("categoria")?.value || "";

  try {
    const vendasGerais = await carregarVendasGerais(dataInicio, dataFim);
    atualizarGraficoVendas(vendasGerais);

    if (categoriaId) {
      const vendasCategoria = await carregarVendasPorCategoria(
        dataInicio,
        dataFim,
        categoriaId
      );
      atualizarGraficoCategoria(vendasCategoria);
    } else {
      if (graficoCategoria) {
        graficoCategoria.destroy();
        graficoCategoria = null;
      }
      const canvasCategoria = document.getElementById("graficoCategoria");
      if (canvasCategoria) {
        canvasCategoria.parentElement.remove();
      }
    }
  } catch (error) {
    alert("Erro ao carregar dados.");
  }
}

async function carregarVendasGerais(dataInicio, dataFim) {
  let url = `${API_BASE_URL}/getSales`;
  const params = [];

  if (dataInicio) params.push(`dataStart=${dataInicio}`);
  if (dataFim) params.push(`dataEnd=${dataFim}`);

  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error();
  }

  return await response.json();
}

async function carregarVendasPorCategoria(dataInicio, dataFim, categoriaId) {
  let url = `${API_BASE_URL}/getSalesByCategory`;
  const params = [];

  if (dataInicio) params.push(`dataStart=${dataInicio}`);
  if (dataFim) params.push(`dataEnd=${dataFim}`);
  params.push(`categoryId=${categoriaId}`);

  url += `?${params.join("&")}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error();
  }

  return await response.json();
}

function agruparVendasPorData(vendas) {
  const agrupado = {};

  vendas.forEach((venda) => {
    const data = venda.createdAt.split("T")[0];
    agrupado[data] = (agrupado[data] || 0) + 1;
  });

  return Object.keys(agrupado)
    .sort()
    .reduce((acc, key) => {
      acc[key] = agrupado[key];
      return acc;
    }, {});
}

function atualizarGraficoVendas(vendas) {
  const dadosAgrupados = agruparVendasPorData(vendas);
  const labels = Object.keys(dadosAgrupados).map(formatarDataExibicao);
  const dados = Object.values(dadosAgrupados);

  const data = {
    labels,
    datasets: [
      {
        label: "Vendas",
        data: dados,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const config = {
    type: "line",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
        title: { display: true, text: "Todas as Vendas ao Longo do Tempo" },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          title: { display: true, text: "Quantidade de Vendas" },
        },
        x: { title: { display: true, text: "Período" } },
      },
    },
  };

  if (graficoVendas) graficoVendas.destroy();
  graficoVendas = new Chart(document.getElementById("graficoVendas"), config);
}

function atualizarGraficoCategoria(vendas) {
  const categoriaNome =
    document.getElementById("categoria").selectedOptions[0].text;

  if (graficoCategoria) {
    graficoCategoria.destroy();
    graficoCategoria = null;
  }

  let canvasCategoria = document.getElementById("graficoCategoria");
  if (canvasCategoria) {
    canvasCategoria.parentElement.remove();
  }

  const mainContainer = document.querySelector("main.container");
  if (!mainContainer) return;

  const cardCategoria = document.createElement("div");
  cardCategoria.className = "card shadow p-4 mt-4";
  cardCategoria.innerHTML = '<canvas id="graficoCategoria"></canvas>';
  mainContainer.appendChild(cardCategoria);
  canvasCategoria = document.getElementById("graficoCategoria");

  if (!vendas || vendas.length === 0) {
    const data = {
      labels: [],
      datasets: [
        {
          label: `Vendas - ${categoriaNome}`,
          data: [],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    };

    const config = {
      type: "line",
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
          title: {
            display: true,
            text: `Vendas da Categoria: ${categoriaNome} (Sem dados)`,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: { display: true, text: "Quantidade de Vendas" },
          },
          x: { title: { display: true, text: "Período" } },
        },
      },
    };

    graficoCategoria = new Chart(canvasCategoria, config);
    return;
  }

  const dadosAgrupados = agruparVendasPorData(vendas);
  const labels = Object.keys(dadosAgrupados).map(formatarDataExibicao);
  const dados = Object.values(dadosAgrupados);

  const data = {
    labels,
    datasets: [
      {
        label: `Vendas - ${categoriaNome}`,
        data: dados,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const config = {
    type: "line",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
        title: { display: true, text: `Vendas da Categoria: ${categoriaNome}` },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          title: { display: true, text: "Quantidade de Vendas" },
        },
        x: { title: { display: true, text: "Período" } },
      },
    },
  };

  graficoCategoria = new Chart(canvasCategoria, config);
}
