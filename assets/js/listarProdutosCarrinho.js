document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.querySelector(".list-group");

  try {
    const response = await fetch("http://localhost:3000/api/getCartItems");
    if (!response.ok) throw new Error("Erro ao buscar itens do carrinho");

    const itens = await response.json();

    lista.innerHTML = "";

    if (itens.length === 0) {
      lista.innerHTML =
        '<li class="list-group-item text-center">Seu carrinho está vazio.</li>';
      return;
    }

    itens.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add(
        "list-group-item",
        "d-flex",
        "align-items-center",
        "cart-item"
      );

      li.innerHTML = `
        <img 
          src="${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYuGcK-7NWhZmMhqL6ml3qHbyFliz7nkzkKA&s"}" 
          class="cart-img me-3" 
          alt="${item.name}"
          onerror="this.src='https://via.placeholder.com/100'"
        />
        <div class="text-start me-3">
          <h5 class="mb-1">${item.name}</h5>
          <p class="mb-0">Preço: R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="d-flex align-items-center me-3 ms-auto">
          <button class="btn btn-outline-secondary btn-sm btn-less" data-id="${
            item.productId
          }">-</button>
          <span class="mx-2 quantidade">${item.quantity}</span>
          <button class="btn btn-outline-secondary btn-sm btn-more" data-id="${
            item.productId
          }">+</button>
        </div>
      `;

      lista.appendChild(li);
    });

    lista.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const productId = parseInt(btn.dataset.id);
      const action = btn.classList.contains("btn-more") ? "more" : "less";

      try {
        await fetch("http://localhost:3000/api/updateCartItens", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: productId, action }),
        });

        const spanQtd = btn
          .closest(".d-flex")
          .querySelector(".quantidade");
        let novaQtd = parseInt(spanQtd.textContent);

        if (action === "more") novaQtd++;
        else if (action === "less" && novaQtd > 1) novaQtd--;
        else if (action === "less" && novaQtd === 1) {
          btn.closest("li").remove();
          return;
        }

        spanQtd.textContent = novaQtd;
      } catch (err) {
        console.error("Erro ao atualizar item:", err);
      }
    });
  } catch (error) {
    console.error(error);
    lista.innerHTML =
      '<li class="list-group-item text-center text-danger">Erro ao carregar o carrinho.</li>';
  }
});
