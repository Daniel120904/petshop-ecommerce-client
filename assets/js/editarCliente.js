document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("formCliente");
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId) {
    alert("Usuário não especificado.");
    window.location.href = "listarClientes.html";
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/getUser?userId=${userId}`
    );
    if (!res.ok) throw new Error("Usuário não encontrado");

    const user = await res.json();

    document.getElementById("nome").value = user.nome || "";
    document.getElementById("genero").value = user.genero || "";
    document.getElementById("dataNascimento").value = user.dataNascimento
      ? user.dataNascimento.split("T")[0]
      : "";
    document.getElementById("cpf").value = user.cpf || "";
    document.getElementById("email").value = user.email || "";
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar usuário.");
    window.location.href = "listarClientes.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      userId: Number(userId),
      nome: document.getElementById("nome").value,
      genero: document.getElementById("genero").value,
      dataNascimento: document.getElementById("dataNascimento").value,
      cpf: document.getElementById("cpf").value,
      email: document.getElementById("email").value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/updateUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Cliente atualizado com sucesso!");
        window.location.href = "listarClientes.html";
      } else {
        const erro = await res.text();
        alert("Erro ao atualizar cliente: " + erro);
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível conectar à API.");
    }
  });
});
