document.addEventListener("DOMContentLoaded", async () => {
  const userId = 20;
  const FRETE_FIXO = 20;
  const container = document.querySelector(".col-md-10");

  if (!container) {
    console.error("Elemento .col-md-10 não encontrado no DOM");
    return;
  }

  const statusMap = {
    processamento: { text: "EM PROCESSAMENTO", class: "bg-warning" },
    aprovada: { text: "APROVADA", class: "bg-info" },
    reprovada: { text: "REPROVADA", class: "bg-danger" },
    transito: { text: "EM TRÂNSITO", class: "bg-secondary" },
    emTroca: { text: "EM TROCA", class: "bg-warning" },
    trocaAutorizada: { text: "TROCA AUTORIZADA", class: "bg-success" },
    entregue: { text: "ENTREGUE", class: "bg-success" }
  };

  async function solicitarTroca(vendaId) {
    if (!confirm("Deseja realmente solicitar a troca desta compra?")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/updateStatusSale", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: vendaId,
          status: "emTroca"
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao solicitar troca");
      }

      alert("Solicitação de troca realizada com sucesso!");
      location.reload();
    } catch (err) {
      console.error("Erro ao solicitar troca:", err);
      alert("Erro ao solicitar troca. Tente novamente.");
    }
  }

  try {
    const response = await fetch(`http://localhost:3000/api/getSalesUser?userId=${userId}`);
    const vendas = await response.json();

    if (!Array.isArray(vendas) || vendas.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">Você ainda não possui compras realizadas.</p>`;
      return;
    }

    container.innerHTML = "";

    vendas.forEach((venda) => {
      const dataFormatada = new Date(venda.createdAt).toLocaleDateString("pt-BR");

      let itensHTML = "";
      venda.items.forEach((item) => {
        const nomeProduto = item.product?.name || `Produto ${item.productId}`;
        const totalItem = item.quantity * item.price;
        itensHTML += `
          <li class="list-group-item d-flex justify-content-between">
            <span>${nomeProduto} (${item.quantity} unid.)</span>
            <span>R$ ${totalItem.toFixed(2)}</span>
          </li>
        `;
      });

      let pagamentosTexto = "";
      if (venda.payments && venda.payments.length > 0) {
        pagamentosTexto = venda.payments
          .map((p) => {
            const finalNum = p.card?.numero
              ? p.card.numero.slice(-4)
              : p.cardId;
            const bandeira = p.card?.bandeira || "Cartão";
            return `${bandeira} final ${finalNum} (R$ ${p.amount.toFixed(2)})`;
          })
          .join(" + ");
      } else {
        pagamentosTexto = "Não informado";
      }

      const frete = FRETE_FIXO;

      const statusInfo = statusMap[venda.status] || { text: venda.status.toUpperCase(), class: "bg-secondary" };

      let botaoTrocaHTML = "";
      if (venda.status === "entregue") {
        botaoTrocaHTML = `
          <button class="btn btn-warning btn-sm" onclick="solicitarTroca(${venda.id})">
            Solicitar Troca
          </button>
        `;
      }

      const card = document.createElement("div");
      card.classList.add("card", "mb-4", "shadow");

      card.innerHTML = `
        <div class="card-header bg-primary text-white d-flex justify-content-between">
          <span>Data: ${dataFormatada}</span>
          <span>Código: #${venda.id}</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">Itens</h5>
          <ul class="list-group mb-3">
            ${itensHTML}
          </ul>

          <p><strong>Frete:</strong> R$ ${frete.toFixed(2)}</p>
          <p><strong>Total:</strong> R$ ${(venda.totalValue + FRETE_FIXO).toFixed(2)}</p>
          <p><strong>Pagamento:</strong> ${pagamentosTexto}</p>
          <p>
            <strong>Status:</strong>
            <span class="badge ${statusInfo.class}">${statusInfo.text}</span>
          </p>
        </div>
        ${botaoTrocaHTML ? `<div class="card-footer d-flex justify-content-end">${botaoTrocaHTML}</div>` : ''}
      `;

      container.appendChild(card);
    });

    window.solicitarTroca = solicitarTroca;

  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    container.innerHTML = `<p class="text-center text-danger">Erro ao carregar histórico de compras.</p>`;
  }
});