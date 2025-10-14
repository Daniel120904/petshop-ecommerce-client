document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".row.g-4");

  try {
    const response = await fetch("http://localhost:3000/api/getProducts");
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const produtos = await response.json();

    container.innerHTML = "";

    produtos.forEach((produto) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4");
      card.innerHTML = `
        <div class="card h-100">
          <img 
            src="${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYuGcK-7NWhZmMhqL6ml3qHbyFliz7nkzkKA&s"}" 
            class="card-img-top" 
            alt="${produto.name}"
            onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200';"
          />
          <div class="card-body text-center">
            <h5 class="card-title">${produto.name}</h5>
            <p class="card-text text-success fw-bold">R$ ${produto.price.toFixed(
              2
            )}</p>
            <button class="btn btn-primary adicionar-carrinho" data-id="${
              produto.id
            }">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    adicionarEventosCarrinho();
  } catch (error) {
    console.error(error);
    container.innerHTML =
      '<p class="text-danger text-center">Erro ao carregar os produtos.</p>';
  }
});

function adicionarEventosCarrinho() {
  const botoes = document.querySelectorAll(".adicionar-carrinho");

  botoes.forEach((botao) => {
    botao.addEventListener("click", async () => {
      const idProduto = botao.getAttribute("data-id");

      try {
        const resposta = await fetch(
          "http://localhost:3000/api/updateCartItens",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              item: Number(idProduto),
              action: "more",
            }),
          }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao adicionar ao carrinho");
        }

        alert("Produto adicionado ao carrinho!");
      } catch (erro) {
        console.error(erro);
        alert("Falha ao adicionar o produto.");
      }
    });
  });
}
