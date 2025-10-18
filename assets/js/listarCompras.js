document.addEventListener("DOMContentLoaded", async () => {
  const userId = 20; // mock temporário
<<<<<<< HEAD
=======
  const FRETE_FIXO = 20;
>>>>>>> 96b2ce444356e5f068e9cf8ad6b55cc6cc5cf5e4
  const container = document.querySelector(".col-md-10");

  if (!container) {
    console.error("Elemento .col-md-10 não encontrado no DOM");
    return;
  }

  try {
<<<<<<< HEAD
    // Buscar compras do usuário
=======
>>>>>>> 96b2ce444356e5f068e9cf8ad6b55cc6cc5cf5e4
    const response = await fetch(`http://localhost:3000/api/getSalesUser?userId=${userId}`);
    const vendas = await response.json();

    if (!Array.isArray(vendas) || vendas.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">Você ainda não possui compras realizadas.</p>`;
      return;
    }

    container.innerHTML = ""; // limpa conteúdo estático

    vendas.forEach((venda) => {
<<<<<<< HEAD
      // Converter data
      const dataFormatada = new Date(venda.createdAt).toLocaleDateString("pt-BR");

      // Somar os itens
      let itensHTML = "";
      venda.items.forEach((item) => {
        const totalItem = item.quantity * item.price;
        itensHTML += `
          <li class="list-group-item d-flex justify-content-between">
            <span>Produto ${item.productId} (${item.quantity} unid.)</span>
=======
      const dataFormatada = new Date(venda.createdAt).toLocaleDateString("pt-BR");

      // === Itens da Venda ===
      let itensHTML = "";
      venda.items.forEach((item) => {
        const nomeProduto = item.product?.name || `Produto ${item.productId}`;
        const totalItem = item.quantity * item.price;
        itensHTML += `
          <li class="list-group-item d-flex justify-content-between">
            <span>${nomeProduto} (${item.quantity} unid.)</span>
>>>>>>> 96b2ce444356e5f068e9cf8ad6b55cc6cc5cf5e4
            <span>R$ ${totalItem.toFixed(2)}</span>
          </li>
        `;
      });

<<<<<<< HEAD
      // Pagamentos
      let pagamentosTexto = "";
      if (venda.payments && venda.payments.length > 0) {
        pagamentosTexto = venda.payments
          .map((p) => `Cartão ${p.cardId} (R$ ${p.amount.toFixed(2)})`)
=======
      // === Pagamentos ===
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
>>>>>>> 96b2ce444356e5f068e9cf8ad6b55cc6cc5cf5e4
          .join(" + ");
      } else {
        pagamentosTexto = "Não informado";
      }

<<<<<<< HEAD
      // Frete (se vier no backend depois, pode ajustar)
      const frete = venda.shippingValue || 0;

      // Status (mocado por enquanto ou usa um campo caso exista)
=======
      // Frete fixo já incluso no totalValue
      const frete = FRETE_FIXO;

      // Status (caso ainda não exista no backend)
>>>>>>> 96b2ce444356e5f068e9cf8ad6b55cc6cc5cf5e4
      const status = venda.status || "EM PROCESSAMENTO";
      const statusClass =
        status === "ENTREGUE"
          ? "bg-success"
          : status === "EM TRÂNSITO"
          ? "bg-info"
          : "bg-secondary";

<<<<<<< HEAD
      // Criar o card
=======
      // === Card ===
>>>>>>> 96b2ce444356e5f068e9cf8ad6b55cc6cc5cf5e4
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
<<<<<<< HEAD
          <button class="btn btn-warning btn-sm me-2">Solicitar Troca</button>
=======
          <button class="btn btn-warning btn-sm me-2">
            Solicitar Troca
          </button>
>>>>>>> 96b2ce444356e5f068e9cf8ad6b55cc6cc5cf5e4
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    container.innerHTML = `<p class="text-center text-danger">Erro ao carregar histórico de compras.</p>`;
  }
});
