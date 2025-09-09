document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId) {
    alert("Usuário não especificado.");
    window.location.href = "listarClientes.html";
    return;
  }

  const listarCartoes = document.querySelector(
      'a[href*="listarCartoes.html"]'
    );
    if (listarCartoes) {
      listarCartoes.href = `listarCartoes.html?userId=${userId}`;
    }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      numero: form
        .querySelector("input[name=numero]")
        .value.replace(/\s+/g, ""),
      nome: form.querySelector("input[name=nome]").value,
      bandeira: form.querySelector("select[name=bandeira]").value,
      cvv: form.querySelector("input[name=cvv]").value,
      userId: Number(userId),
    };

    try {
      const res = await fetch("http://localhost:3000/api/createCartao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Cartão salvo com sucesso!");
        window.location.href = `listarCartoes.html?userId=${userId}`;
      } else {
        const erro = await res.text();
        alert("Erro ao salvar cartão: " + erro);
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível conectar à API.");
    }
  });
});
