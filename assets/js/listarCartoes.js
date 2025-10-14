document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId) {
    alert("Usuário não especificado.");
    window.location.href = "listarClientes.html";
    return;
  }

  const novoCartaoBtn = document.querySelector("a.btn-success");
  novoCartaoBtn.href = `criarCartao.html?userId=${userId}`;

  const tabelaBody = document.getElementById("cartoesBody");

  try {
    const res = await fetch(`http://localhost:3000/api/getCartoes?userId=${userId}`);
    if (!res.ok) throw new Error("Erro ao buscar cartões");

    const cartoes = await res.json();

    tabelaBody.innerHTML = "";

    if (cartoes.length === 0) {
      tabelaBody.innerHTML = `
        <tr>
          <td colspan="2" class="text-center">Nenhum cartão encontrado</td>
        </tr>
      `;
    } else {
      cartoes.forEach(cartao => {
        const numeroMascarado = "**** **** **** " + cartao.numero.slice(-4);
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="text-start">${numeroMascarado}</td>
          <td class="text-end">
            <input 
              type="radio" 
              name="preferencial" 
              data-id="${cartao.id}" 
              ${cartao.preferencial ? "checked" : ""}>
          </td>
        `;
        tabelaBody.appendChild(tr);
      });

      document.querySelectorAll('input[name="preferencial"]').forEach(radio => {
        radio.addEventListener("change", async (e) => {
          const cartaoId = e.target.getAttribute("data-id");

          try {
            const updateRes = await fetch("http://localhost:3000/api/updateCartaoPreferencial", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                cartaoId: Number(cartaoId),
                preferencial: true
              })
            });

            if (!updateRes.ok) throw new Error("Erro ao atualizar preferencial");

            console.log("Cartão atualizado com sucesso!");
          } catch (err) {
            console.error("Erro ao atualizar cartão preferencial:", err);
            alert("Erro ao atualizar cartão preferencial.");
          }
        });
      });
    }
  } catch (err) {
    console.error(err);
    tabelaBody.innerHTML = `
      <tr>
        <td colspan="2" class="text-center text-danger">Erro ao carregar cartões</td>
      </tr>
    `;
  }
});
