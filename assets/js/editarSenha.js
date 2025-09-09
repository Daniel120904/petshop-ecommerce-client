document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId) {
    alert("Usuário não especificado.");
    window.location.href = "listarClientes.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senhaAtual = document.getElementById("senhaAtual").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarNovaSenha = document.getElementById("confirmarSenha").value;

    if (novaSenha !== confirmarNovaSenha) {
      alert("As senhas não conferem!");
      return;
    }

    const data = {
      userId: Number(userId),
      senhaAtual,
      novaSenha,
      confirmarNovaSenha,
    };

    try {
      const res = await fetch("http://localhost:3000/api/updateSenha", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Senha atualizada com sucesso!");
        window.location.href = "listarClientes.html";
      } else {
        const erro = await res.text();
        alert("Erro ao atualizar senha: " + erro);
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível conectar à API.");
    }
  });
});
