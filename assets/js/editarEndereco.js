document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form");

  const urlParams = new URLSearchParams(window.location.search);
  const enderecoId = urlParams.get("enderecoId");

  if (!enderecoId) {
    alert("Endereço não especificado.");
    window.location.href = "listarEnderecos.html";
    return;
  }

  let endereco;

  try {
    const res = await fetch(
      `http://localhost:3000/api/getEndereco?enderecoId=${enderecoId}`
    );
    if (!res.ok) throw new Error("Erro ao buscar endereço");

    endereco = await res.json();

    if (!endereco) {
      alert("Endereço não encontrado.");
      window.location.href = "listarEnderecos.html";
      return;
    }

    const novoEnderecoBtn = document.querySelector(
      'a[href*="listarEnderecos.html"]'
    );
    if (novoEnderecoBtn) {
      novoEnderecoBtn.href = `listarEnderecos.html?userId=${endereco.userId}`;
    }

    form.querySelector("input[name=nome]").value = endereco.nome;
    form.querySelector("select[name=tipoEndereco]").value =
      endereco.tipoEndereco;
    form.querySelector("select[name=tipoResidencia]").value =
      endereco.tipoResidencia;
    form.querySelector("select[name=tipoLogradouro]").value =
      endereco.tipoLogradouro;
    form.querySelector("input[name=logradouro]").value = endereco.logradouro;
    form.querySelector("input[name=numero]").value = endereco.numero;
    form.querySelector("input[name=bairro]").value = endereco.bairro;
    form.querySelector("input[name=cep]").value = endereco.cep;
    form.querySelector("input[name=cidade]").value = endereco.cidade;
    form.querySelector("input[name=estado]").value = endereco.estado;
    form.querySelector("input[name=pais]").value = endereco.pais;
    form.querySelector("textarea[name=observacoes]").value =
      endereco.observacoes || "";
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar endereço.");
    window.location.href = "listarEnderecos.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      enderecoId: Number(enderecoId),
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
    };

    try {
      const res = await fetch("http://localhost:3000/api/updateEndereco", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Endereço atualizado com sucesso!");
        window.location.href = `listarEnderecos.html?userId=${endereco.userId}`;
      } else {
        const erro = await res.text();
        alert("Erro ao atualizar endereço: " + erro);
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível conectar à API.");
    }
  });
});
