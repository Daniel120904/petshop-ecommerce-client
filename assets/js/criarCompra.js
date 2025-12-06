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
  const couponInput = document.getElementById("coupon-input");
  const applyCouponBtn = document.getElementById("apply-coupon");

  let subtotal = 0;
  let totalCompra = 0;
  let cupomPromocional = null; // Armazena o cupom promocional (apenas 1)
  let cuponsDetroca = []; // Array de cupons de troca
  let descontoTotal = 0;

  if (
    !listaProdutos ||
    !subtotalSpan ||
    !freteSpan ||
    !totalSpan ||
    !selectEndereco ||
    !listaCartoes ||
    !btnFinalizar ||
    !couponInput ||
    !applyCouponBtn
  ) {
    console.error("Erro: elementos do DOM não encontrados");
    return;
  }

  try {
    const resCarrinho = await fetch("http://localhost:3000/api/getCartItems");
    const itensCarrinho = await resCarrinho.json();
    if (!Array.isArray(itensCarrinho) || itensCarrinho.length === 0) {
      listaProdutos.innerHTML =
        '<li class="list-group-item text-muted">Carrinho vazio.</li>';
      return;
    }

    listaProdutos.innerHTML = "";
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
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYuGcK-7NWhZmMhqL6ml3qHbyFliz7nkzkKA&s" alt="${
            item.name
          }" class="me-2 rounded" style="width:50px;height:50px;object-fit:cover;">
          <span>${item.name} (${item.quantity} unid.)</span>
        </div>
        <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
      `;
      listaProdutos.appendChild(li);
      subtotal += item.price * item.quantity;
    });

    subtotalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
    freteSpan.textContent = `R$ ${frete.toFixed(2)}`;
    totalCompra = subtotal + frete;
    totalSpan.textContent = `R$ ${totalCompra.toFixed(2)}`;

    const resEnderecos = await fetch(
      `http://localhost:3000/api/getEnderecos?userId=${userId}`
    );
    const enderecos = await resEnderecos.json();
    selectEndereco.innerHTML =
      '<option value="">Selecione um endereço salvo</option>';
    if (enderecos.length > 0) {
      enderecos.forEach((end) => {
        const opt = document.createElement("option");
        opt.value = end.id;
        opt.textContent = end.nome;
        selectEndereco.appendChild(opt);
      });
    } else {
      const opt = document.createElement("option");
      opt.disabled = true;
      opt.textContent = "Nenhum endereço cadastrado";
      selectEndereco.appendChild(opt);
    }

    const resCartoes = await fetch(
      `http://localhost:3000/api/getCartoes?userId=${userId}`
    );
    const cartoes = await resCartoes.json();
    listaCartoes.innerHTML = "";

    if (cartoes.length === 0) {
      listaCartoes.innerHTML =
        '<p class="text-muted">Nenhum cartão cadastrado.</p>';
    } else {
      cartoes.forEach((cartao) => {
        const div = document.createElement("div");
        div.classList.add("mb-3", "border", "p-2", "rounded");
        div.innerHTML = `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="cartao-${
              cartao.id
            }" value="${cartao.id}">
            <label class="form-check-label" for="cartao-${cartao.id}">
              ${cartao.bandeira || "Cartão"} final ${cartao.numero.slice(-4)}
            </label>
          </div>
          <input 
            type="number" 
            class="form-control mt-2 cart-valor" 
            step="0.01"
            placeholder="Valor para este cartão (R$)" 
            disabled
            data-card-id="${cartao.id}"
          >
        `;
        listaCartoes.appendChild(div);
      });
    }

    // Container para mostrar cupons aplicados
    const couponContainer = document.createElement("div");
    couponContainer.id = "cupons-aplicados";
    couponContainer.className = "mt-3";
    applyCouponBtn.parentElement.appendChild(couponContainer);

    const calcularDesconto = () => {
      let desconto = 0;

      // Aplica desconto do cupom promocional (porcentagem)
      if (cupomPromocional) {
        const descontoPromocional =
          (subtotal * cupomPromocional.discountPercentage) / 100;
        desconto += descontoPromocional;
        console.log(
          `Cupom promocional: ${
            cupomPromocional.discountPercentage
          }% = R$ ${descontoPromocional.toFixed(2)}`
        );
      }

      // Aplica descontos dos cupons de troca (valores fixos)
      cuponsDetroca.forEach((cupom) => {
        desconto += cupom.discountValue;
        console.log(
          `Cupom de troca ${cupom.code}: R$ ${cupom.discountValue.toFixed(2)}`
        );
      });

      console.log(`Desconto total calculado: R$ ${desconto.toFixed(2)}`);
      return desconto;
    };

    const atualizarTotal = () => {
      descontoTotal = calcularDesconto();

      // Calcula total garantindo >= 0
      totalCompra = Math.max(0, subtotal + frete - descontoTotal);

      // Busca sempre o elemento atual do DOM (não usar a referência cacheada)
      const totalElement = document.getElementById("total");

      // Atualiza o texto do total (se existir)
      if (totalElement) {
        totalElement.textContent = `R$ ${totalCompra.toFixed(2)}`;
      }

      // Ajusta aparência e nota de desconto sem variar o innerHTML do pai
      const totalParent = totalElement ? totalElement.parentElement : null;
      if (totalParent) {
        // Remove/Adiciona classe de destaque
        if (descontoTotal > 0) {
          totalParent.classList.add("text-success");
          // cria (ou atualiza) nota de desconto
          let note = totalParent.querySelector(".discount-note");
          if (!note) {
            note = document.createElement("small");
            note.className = "text-muted discount-note ms-2";
            totalParent.appendChild(note);
          }
          note.textContent = `(desconto: R$ ${descontoTotal.toFixed(2)})`;
        } else {
          totalParent.classList.remove("text-success");
          const note = totalParent.querySelector(".discount-note");
          if (note) note.remove();
        }
      }
      redistribuirValores();
    };

    const renderizarCupons = () => {
      const container = document.getElementById("cupons-aplicados");
      if (!container) return;
      container.innerHTML = "";

      if (cupomPromocional) {
        const div = document.createElement("div");
        div.className =
          "alert alert-success d-flex justify-content-between align-items-center mt-2";
        // usamos um botão que chama a função global (mantive seu approach)
        div.innerHTML = `
      <span><strong>Cupom Promocional:</strong> ${cupomPromocional.code} (-${cupomPromocional.discountPercentage}%)</span>
      <button class="btn btn-sm btn-danger btn-remove-prom">Remover</button>
    `;
        // listener mais seguro que onclick inline
        div.querySelector(".btn-remove-prom").addEventListener("click", () => {
          window.removerCupomPromocional();
        });
        container.appendChild(div);
      }

      cuponsDetroca.forEach((cupom, index) => {
        const div = document.createElement("div");
        div.className =
          "alert alert-info d-flex justify-content-between align-items-center mt-2";
        div.innerHTML = `
      <span><strong>Cupom de Troca:</strong> ${
        cupom.code
      } (-R$ ${cupom.discountValue.toFixed(2)})</span>
      <button class="btn btn-sm btn-danger btn-remove-exch">Remover</button>
    `;
        div.querySelector(".btn-remove-exch").addEventListener("click", () => {
          window.removerCupomTroca(index);
        });
        container.appendChild(div);
      });
    };

    // Funções globais para remover cupons
    window.removerCupomPromocional = () => {
      cupomPromocional = null;
      renderizarCupons();
      atualizarTotal();
    };

    window.removerCupomTroca = (index) => {
      cuponsDetroca.splice(index, 1);
      renderizarCupons();
      atualizarTotal();
    };

    applyCouponBtn.addEventListener("click", async () => {
      const code = couponInput.value.trim();
      if (!code) return alert("Digite um código de cupom!");

      try {
        const res = await fetch(
          `http://localhost:3000/api/getCoupon?coupon=${code}`
        );

        if (!res.ok) {
          alert("Cupom inválido ou expirado.");
          return;
        }

        const data = await res.json();

        // Verifica se é cupom promocional (porcentagem)
        if (data.discountPercentage !== null && data.discountValue === null) {
          if (cupomPromocional) {
            alert(
              "Você já aplicou um cupom promocional! Remova o atual para adicionar outro."
            );
            return;
          }
          cupomPromocional = data;
        }
        // Verifica se é cupom de troca (valor fixo)
        else if (
          data.discountValue !== null &&
          data.discountPercentage === null
        ) {
          // Verifica se o cupom já foi aplicado
          if (cuponsDetroca.some((c) => c.code === data.code)) {
            alert("Este cupom de troca já foi aplicado!");
            return;
          }
          cuponsDetroca.push(data);
        } else {
          alert("Cupom inválido: formato desconhecido.");
          return;
        }

        couponInput.value = "";
        renderizarCupons();
        atualizarTotal();
      } catch (err) {
        console.error("Erro ao aplicar cupom:", err);
        alert("Erro ao processar cupom. Tente novamente.");
      }
    });

    const redistribuirValores = () => {
      const checkboxesSelecionados = Array.from(
        listaCartoes.querySelectorAll("input[type=checkbox]:checked")
      );

      if (checkboxesSelecionados.length === 0) return;

      const valorPorCartao = totalCompra / checkboxesSelecionados.length;

      checkboxesSelecionados.forEach((cb, index) => {
        const input =
          cb.parentElement.parentElement.querySelector(".cart-valor");

        if (index === checkboxesSelecionados.length - 1) {
          const somaDosOutros =
            valorPorCartao * (checkboxesSelecionados.length - 1);
          input.value = (totalCompra - somaDosOutros).toFixed(2);
        } else {
          input.value = valorPorCartao.toFixed(2);
        }
      });

      atualizarResumo();
    };

    const atualizarResumo = () => {
      const checkboxesSelecionados = Array.from(
        listaCartoes.querySelectorAll("input[type=checkbox]:checked")
      );

      let somaTotal = 0;
      checkboxesSelecionados.forEach((cb) => {
        const input =
          cb.parentElement.parentElement.querySelector(".cart-valor");
        const valor = parseFloat(input.value) || 0;
        somaTotal += valor;
      });

      const diferenca = totalCompra - somaTotal;

      if (Math.abs(diferenca) > 0.01 && checkboxesSelecionados.length > 0) {
        btnFinalizar.classList.remove("btn-success");
        btnFinalizar.classList.add("btn-warning");
        btnFinalizar.textContent = `Ajustar valores (falta R$ ${Math.abs(
          diferenca
        ).toFixed(2)})`;
      } else if (checkboxesSelecionados.length > 0) {
        btnFinalizar.classList.remove("btn-warning");
        btnFinalizar.classList.add("btn-success");
        btnFinalizar.textContent = "Finalizar Compra";
      }
    };

    listaCartoes.addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        const input =
          e.target.parentElement.parentElement.querySelector(".cart-valor");

        if (e.target.checked) {
          input.disabled = false;
          redistribuirValores();
        } else {
          input.disabled = true;
          input.value = "";
          redistribuirValores();
        }
      }
    });

    listaCartoes.addEventListener("input", (e) => {
      if (e.target.classList.contains("cart-valor")) {
        atualizarResumo();
      }
    });

    const btnRedistribuir = document.createElement("button");
    btnRedistribuir.className = "btn btn-outline-primary btn-sm mt-2 w-100";
    btnRedistribuir.textContent = "↻ Distribuir Igualmente";
    btnRedistribuir.addEventListener("click", () => {
      const numSelecionados = listaCartoes.querySelectorAll(
        "input[type=checkbox]:checked"
      ).length;
      if (numSelecionados === 0) {
        alert("Selecione pelo menos um cartão primeiro!");
        return;
      }
      redistribuirValores();
    });

    listaCartoes.insertAdjacentElement("afterend", btnRedistribuir);

    btnFinalizar.addEventListener("click", async () => {
      const enderecoId = parseInt(selectEndereco.value);
      if (!enderecoId) return alert("Selecione um endereço!");

      const selectedCheckboxes = Array.from(
        listaCartoes.querySelectorAll("input[type=checkbox]:checked")
      );

      if (selectedCheckboxes.length === 0) {
        return alert("Selecione pelo menos um cartão!");
      }

      const payments = [];
      let soma = 0;
      let erros = [];

      // Verifica se há cupons de troca aplicados
      const temCupomTroca = cuponsDetroca.length > 0;

      for (let cb of selectedCheckboxes) {
        const valorInput =
          cb.parentElement.parentElement.querySelector(".cart-valor");
        let valor = parseFloat(valorInput.value);

        if (isNaN(valor) || valor <= 0) {
          erros.push(
            "Todos os cartões selecionados devem ter um valor válido."
          );
          break;
        }

        // Ignora a barreira de R$ 10,00 se houver cupom de troca
        if (!temCupomTroca && valor < 10) {
          const bandeira = cb.parentElement.querySelector("label").textContent;
          erros.push(
            `${bandeira}: valor mínimo é R$ 10,00 (atual: R$ ${valor.toFixed(
              2
            )})`
          );
        }

        soma += valor;
        payments.push({ cardId: parseInt(cb.value), amount: valor });
      }

      if (erros.length > 0) {
        return alert("Erro nos valores:\n\n" + erros.join("\n"));
      }

      if (Math.abs(soma - totalCompra) > 0.01) {
        return alert(
          `A soma dos valores (R$ ${soma.toFixed(
            2
          )}) deve ser igual ao total (R$ ${totalCompra.toFixed(
            2
          )}).\n\nDiferença: R$ ${Math.abs(soma - totalCompra).toFixed(2)}`
        );
      }

      const body = {
        addressId: enderecoId,
        payments,
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
    console.error(err);
    listaProdutos.innerHTML =
      '<li class="list-group-item text-danger">Erro ao carregar carrinho.</li>';
  }
});
