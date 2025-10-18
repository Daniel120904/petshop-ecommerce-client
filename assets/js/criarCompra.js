document.addEventListener("DOMContentLoaded", async () => {
  const userId = 20;
  const frete = 20;

  const listaProdutos = document.getElementById("lista-produtos");
  const subtotalSpan = document.getElementById("subtotal");
  const freteSpan = document.getElementById("frete");
  const totalSpan = document.getElementById("total");
  const selectEndereco = document.getElementById("select-endereco");
  const listaCartoes = document.getElementById("lista-cartoes");
  const btnFinalizar = document.getElementById("btn-finalizar");

  if (
    !listaProdutos ||
    !subtotalSpan ||
    !freteSpan ||
    !totalSpan ||
    !selectEndereco ||
    !listaCartoes ||
    !btnFinalizar
  ) {
    console.error("Erro: um ou mais elementos não foram encontrados no DOM.");
    return;
  }

  try {
    const responseCarrinho = await fetch(
      "http://localhost:3000/api/getCartItems"
    );
    const itensCarrinho = await responseCarrinho.json();

    if (!Array.isArray(itensCarrinho) || itensCarrinho.length === 0) {
      listaProdutos.innerHTML =
        '<li class="list-group-item text-muted">Carrinho vazio.</li>';
      return;
    }

    listaProdutos.innerHTML = "";
    let subtotal = 0;

    itensCarrinho.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      li.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYuGcK-7NWhZmMhqL6ml3qHbyFliz7nkzkKA&s"}"
               alt="${item.name}"
               class="me-2 rounded"
               style="width: 50px; height: 50px; object-fit: cover;">
          <span>${item.name}</span>
        </div>
        <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
      `;
      listaProdutos.appendChild(li);

      subtotal += item.price * item.quantity;
    });

    subtotalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
    freteSpan.textContent = `R$ ${frete.toFixed(2)}`;
    totalSpan.textContent = `R$ ${(subtotal + frete).toFixed(2)}`;

    const responseEnderecos = await fetch(
      `http://localhost:3000/api/getEnderecos?userId=${userId}`
    );
    const enderecos = await responseEnderecos.json();

    selectEndereco.innerHTML =
      '<option value="">Selecione um endereço salvo</option>';
    if (enderecos.length > 0) {
      enderecos.forEach((endereco) => {
        const opt = document.createElement("option");
        opt.value = endereco.id;
        opt.textContent = endereco.nome;
        selectEndereco.appendChild(opt);
      });
    } else {
      const opt = document.createElement("option");
      opt.disabled = true;
      opt.textContent = "Nenhum endereço cadastrado";
      selectEndereco.appendChild(opt);
    }

    const responseCartoes = await fetch(
      `http://localhost:3000/api/getCartoes?userId=${userId}`
    );
    const cartoes = await responseCartoes.json();

    listaCartoes.innerHTML = "";
    if (cartoes.length > 0) {
      cartoes.forEach((cartao) => {
        const div = document.createElement("div");
        div.classList.add("form-check", "mb-2");

        div.innerHTML = `
          <input class="form-check-input" type="checkbox" value="${
            cartao.id
          }" id="cartao-${cartao.id}">
          <label class="form-check-label" for="cartao-${cartao.id}">
            ${cartao.bandeira || "Cartão"} final ${cartao.numero.slice(-4)}
          </label>
        `;
        listaCartoes.appendChild(div);
      });
    } else {
      listaCartoes.innerHTML =
        '<p class="text-muted">Nenhum cartão cadastrado.</p>';
    }

    btnFinalizar.addEventListener("click", async () => {
      const enderecoId = parseInt(selectEndereco.value);
      if (!enderecoId) return alert("Selecione um endereço!");

      const selecionados = Array.from(
        document.querySelectorAll("#lista-cartoes input:checked")
      ).map((input) => parseInt(input.value));

      if (selecionados.length === 0)
        return alert("Selecione pelo menos um cartão!");

      const totalCompra = subtotal + frete;
      const valorPorCartao = totalCompra / selecionados.length;

      const body = {
        addressId: enderecoId,
        payments: selecionados.map((cardId) => ({
          cardId,
          amount: valorPorCartao,
        })),
      };

      try {
        const res = await fetch("http://localhost:3000/api/createSale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Erro ao criar venda");

        alert("Compra realizada com sucesso!");
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("Erro ao finalizar compra");
      }
    });
  } catch (err) {
    console.error("Erro ao carregar carrinho:", err);
    listaProdutos.innerHTML =
      '<li class="list-group-item text-danger">Erro ao carregar carrinho.</li>';
  }
});
