document.addEventListener("DOMContentLoaded", async () => {
  const userId = 20; // mock temporário
  const container = document.querySelector(".col-md-10");

  if (!container) {
    console.error("Elemento .col-md-10 não encontrado no DOM");
    return;
  }

  try {
    // Buscar compras do usuário
    const response = await fetch(`http://localhost:3000/api/getSalesUser?userId=${userId}`);
    const vendas = await response.json();

    if (!Array.isArray(vendas) || vendas.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">Você ainda não possui compras realizadas.</p>`;
      return;
    }

    container.innerHTML = ""; // limpa conteúdo estático

    vendas.forEach((venda) => {
      // Converter data
      const dataFormatada = new Date(venda.createdAt).toLocaleDateString("pt-BR");

      // Somar os itens
      let itensHTML = "";
      venda.items.forEach((item) => {
        const totalItem = item.quantity * item.price;
        itensHTML += `
          <li class="list-group-item d-flex justify-content-between">
            <span>Produto ${item.productId} (${item.quantity} unid.)</span>
            <span>R$ ${totalItem.toFixed(2)}</span>
          </li>
        `;
      });

      // Pagamentos
      let pagamentosTexto = "";
      if (venda.payments && venda.payments.length > 0) {
        pagamentosTexto = venda.payments
          .map((p) => `Cartão ${p.cardId} (R$ ${p.amount.toFixed(2)})`)
          .join(" + ");
      } else {
        pagamentosTexto = "Não informado";
      }

      // Frete (se vier no backend depois, pode ajustar)
      const frete = venda.shippingValue || 0;

      // Status (mocado por enquanto ou usa um campo caso exista)
      const status = venda.status || "EM PROCESSAMENTO";
      const statusClass =
        status === "ENTREGUE"
          ? "bg-success"
          : status === "EM TRÂNSITO"
          ? "bg-info"
          : "bg-secondary";

      // Criar o card
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
          <p><strong>Total:</strong> R$ ${venda.totalValue.toFixed(2)}</p>
          <p><strong>Pagamento:</strong> ${pagamentosTexto}</p>
          <p>
            <strong>Status:</strong>
            <span class="badge ${statusClass}">${status}</span>
          </p>
        </div>
        <div class="card-footer d-flex justify-content-end">
          <button class="btn btn-warning btn-sm me-2">Solicitar Troca</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    container.innerHTML = `<p class="text-center text-danger">Erro ao carregar histórico de compras.</p>`;
  }
});
