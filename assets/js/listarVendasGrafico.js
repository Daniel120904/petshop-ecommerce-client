const API_BASE_URL = "http://localhost:3000/api";

const form = document.querySelector("form");
const dataInicioInput = document.getElementById("dataInicio");
const dataFimInput = document.getElementById("dataFim");

let graficoVendas = null;
let graficoCategoria = null;
let categorias = [];

// Cores para cada categoria (até 10 categorias)
const CORES_CATEGORIAS = [
  { border: "rgb(255, 99, 132)", background: "rgba(255, 99, 132, 0.2)" },
  { border: "rgb(54, 162, 235)", background: "rgba(54, 162, 235, 0.2)" },
  { border: "rgb(255, 206, 86)", background: "rgba(255, 206, 86, 0.2)" },
  { border: "rgb(75, 192, 192)", background: "rgba(75, 192, 192, 0.2)" },
  { border: "rgb(153, 102, 255)", background: "rgba(153, 102, 255, 0.2)" },
  { border: "rgb(255, 159, 64)", background: "rgba(255, 159, 64, 0.2)" },
  { border: "rgb(199, 199, 199)", background: "rgba(199, 199, 199, 0.2)" },
  { border: "rgb(83, 102, 255)", background: "rgba(83, 102, 255, 0.2)" },
  { border: "rgb(255, 99, 255)", background: "rgba(255, 99, 255, 0.2)" },
  { border: "rgb(99, 255, 132)", background: "rgba(99, 255, 132, 0.2)" },
];

document.addEventListener("DOMContentLoaded", async () => {
  await carregarCategorias();
  await carregarDados();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await carregarDados();
});

function formatarDataExibicao(dataString) {
  const data = new Date(dataString);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

async function carregarCategorias() {
  try {
    const response = await fetch(`${API_BASE_URL}/getCategories`);
    categorias = await response.json();

    const filtroDiv = document.querySelector(".row.g-3.mb-4");
    const colCategoria = document.createElement("div");
    colCategoria.className = "col-md-12 mt-3";
    colCategoria.innerHTML = `
      <label class="form-label">Categorias (Selecione uma ou mais)</label>
      <div id="categorias-checkboxes" class="d-flex flex-wrap gap-3">
        ${categorias
          .map(
            (cat) => `
          <div class="form-check">
            <input 
              class="form-check-input categoria-checkbox" 
              type="checkbox" 
              value="${cat.id}" 
              id="cat-${cat.id}"
            >
            <label class="form-check-label" for="cat-${cat.id}">
              ${cat.name}
            </label>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // Insere após as datas, antes do botão
    const colBotao = filtroDiv.querySelector(".col-md-4.d-flex");
    filtroDiv.insertBefore(colCategoria, colBotao);

    // Adiciona listener para cada checkbox
    document.querySelectorAll(".categoria-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", async () => {
        await carregarDados();
      });
    });
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }
}

async function carregarDados() {
  const dataInicio = dataInicioInput.value;
  const dataFim = dataFimInput.value;
  const categoriasSelecionadas = obterCategoriasSelecionadas();

  try {
    // Carrega vendas gerais
    const vendasGerais = await carregarVendasGerais(dataInicio, dataFim);
    atualizarGraficoVendas(vendasGerais);

    // Carrega vendas por categorias se houver seleção
    if (categoriasSelecionadas.length > 0) {
      const vendasCategorias = await carregarVendasPorCategorias(
        dataInicio,
        dataFim,
        categoriasSelecionadas
      );
      atualizarGraficoCategoria(vendasCategorias, categoriasSelecionadas);
    } else {
      // Remove o gráfico de categoria se não há filtro
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
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar dados. Verifique o console.");
  }
}

function obterCategoriasSelecionadas() {
  const checkboxes = document.querySelectorAll(".categoria-checkbox:checked");
  return Array.from(checkboxes).map((cb) => parseInt(cb.value));
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
    throw new Error("Erro ao buscar vendas gerais");
  }

  return await response.json();
}

async function carregarVendasPorCategorias(dataInicio, dataFim, categoriasIds) {
  let url = `${API_BASE_URL}/getSalesByCategories`;
  const params = [];

  if (dataInicio) params.push(`dataStart=${dataInicio}`);
  if (dataFim) params.push(`dataEnd=${dataFim}`);

  // Formata o array de IDs como [1,2,3]
  params.push(`categoriesId=[${categoriasIds.join(",")}]`);

  url += `?${params.join("&")}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao buscar vendas por categorias");
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

// Agrupa vendas por categoria E por data
function agruparVendasPorCategoriaEData(vendas, categoriasIds) {
  const resultado = {};

  // Inicializa objeto para cada categoria
  categoriasIds.forEach((catId) => {
    resultado[catId] = {};
  });

  // Agrupa vendas por categoria
  vendas.forEach((venda) => {
    const dataVenda = venda.createdAt.split("T")[0];

    // Verifica cada item da venda
    venda.items.forEach((item) => {
      const categoriaNome = item.product.category.name;

      // Encontra o ID da categoria pelo nome
      const categoria = categorias.find((c) => c.name === categoriaNome);

      if (categoria && categoriasIds.includes(categoria.id)) {
        if (!resultado[categoria.id][dataVenda]) {
          resultado[categoria.id][dataVenda] = 0;
        }
        // Conta a venda uma vez por categoria (não por item)
        resultado[categoria.id][dataVenda] = 1;
      }
    });
  });

  // Recontagem correta: uma venda pode ter múltiplos items de categorias diferentes
  // Vamos recontar considerando vendas únicas
  const resultadoFinal = {};
  categoriasIds.forEach((catId) => {
    resultadoFinal[catId] = {};
  });

  vendas.forEach((venda) => {
    const dataVenda = venda.createdAt.split("T")[0];
    const categoriasNaVenda = new Set();

    // Identifica quais categorias estão presentes nesta venda
    venda.items.forEach((item) => {
      const categoriaNome = item.product.category.name;
      const categoria = categorias.find((c) => c.name === categoriaNome);

      if (categoria && categoriasIds.includes(categoria.id)) {
        categoriasNaVenda.add(categoria.id);
      }
    });

    // Incrementa contador para cada categoria presente
    categoriasNaVenda.forEach((catId) => {
      if (!resultadoFinal[catId][dataVenda]) {
        resultadoFinal[catId][dataVenda] = 0;
      }
      resultadoFinal[catId][dataVenda]++;
    });
  });

  // Ordena as datas dentro de cada categoria
  Object.keys(resultadoFinal).forEach((catId) => {
    const ordenado = Object.keys(resultadoFinal[catId])
      .sort()
      .reduce((acc, key) => {
        acc[key] = resultadoFinal[catId][key];
        return acc;
      }, {});
    resultadoFinal[catId] = ordenado;
  });

  return resultadoFinal;
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

function atualizarGraficoCategoria(vendas, categoriasIds) {
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
  cardCategoria.innerHTML = `
    <h5 class="text-center mb-3">Vendas por Categoria</h5>
    <canvas id="graficoCategoria"></canvas>
  `;
  mainContainer.appendChild(cardCategoria);
  canvasCategoria = document.getElementById("graficoCategoria");

  if (!vendas || vendas.length === 0) {
    const data = {
      labels: [],
      datasets: categoriasIds.map((catId, index) => {
        const categoria = categorias.find((c) => c.id === catId);
        const cor = CORES_CATEGORIAS[index % CORES_CATEGORIAS.length];

        return {
          label: categoria.name,
          data: [],
          borderColor: cor.border,
          backgroundColor: cor.background,
          tension: 0.3,
          fill: true,
        };
      }),
    };

    const config = {
      type: "line",
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
          title: { display: true, text: "Vendas por Categoria (Sem dados)" },
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

  // Agrupa vendas por categoria e data
  const dadosAgrupados = agruparVendasPorCategoriaEData(vendas, categoriasIds);

  // Coleta todas as datas únicas de todas as categorias
  const todasDatasSet = new Set();
  Object.values(dadosAgrupados).forEach((catData) => {
    Object.keys(catData).forEach((data) => todasDatasSet.add(data));
  });
  const todasDatas = Array.from(todasDatasSet).sort();
  const labels = todasDatas.map(formatarDataExibicao);

  // Cria datasets para cada categoria
  const datasets = categoriasIds.map((catId, index) => {
    const categoria = categorias.find((c) => c.id === catId);
    const cor = CORES_CATEGORIAS[index % CORES_CATEGORIAS.length];

    // Preenche dados para todas as datas (0 se não houver venda)
    const dados = todasDatas.map((data) => dadosAgrupados[catId][data] || 0);

    return {
      label: categoria.name,
      data: dados,
      borderColor: cor.border,
      backgroundColor: cor.background,
      tension: 0.3,
      fill: true,
    };
  });

  const data = {
    labels,
    datasets,
  };

  const config = {
    type: "line",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
        title: { display: true, text: "Vendas por Categoria" },
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
