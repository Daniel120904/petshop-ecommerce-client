document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId) {
    alert("Usuário não especificado.");
    window.location.href = "listarClientes.html";
    return;
  }

  const novoEnderecoBtn = document.querySelector(
    'a[href*="listarEnderecos.html"]'
  );
  if (novoEnderecoBtn) {
    novoEnderecoBtn.href = `listarEnderecos.html?userId=${userId}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nome: form.querySelector("input[name=nome]").value,
      tipoEndereco: form.querySelector("select[name=tipoEndereco]").value,
      tipoResidencia: form.querySelector("select[name=tipoResidencia]").value,
      tipoLogradouro: form.querySelector("select[name=tipoLogradouro]").value,
      logradouro: form.querySelector("input[name=logradouro]").value,
      numero: form.querySelector("input[name=numero]").value,
      bairro: form.querySelector("input[name=bairro]").value,
      cep: form.querySelector("input[name=cep]").value,
      cidade: form.querySelector("input[name=cidade]").value,
      estado: form.querySelector("input[name=estado]").value,
      pais: form.querySelector("input[name=pais]").value,
      observacoes: form.querySelector("textarea[name=observacoes]").value,
      userId: Number(userId),
    };

    try {
      const res = await fetch("http://localhost:3000/api/createEndereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Endereço criado com sucesso!");
        window.location.href = `listarEnderecos.html?userId=${userId}`;
      } else {
        const erro = await res.text();
        alert("Erro ao criar endereço: " + erro);
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível conectar à API.");
    }
  });
});
