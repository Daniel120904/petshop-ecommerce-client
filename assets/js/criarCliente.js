document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCliente");
  const enderecosContainer = document.getElementById("enderecosContainer");
  const cartoesContainer = document.getElementById("cartoesContainer");
  const btnAddEndereco = document.getElementById("btnAddEndereco");
  const btnAddCartao = document.getElementById("btnAddCartao");

  btnAddEndereco.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("card", "p-3", "mb-3", "shadow-sm");
    div.innerHTML = `
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Nome do Endereço *</label>
          <input type="text" class="form-control nomeEndereco" required />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tipo de Endereço *</label>
          <select class="form-select tipoEndereco" required>
            <option value="">Selecione...</option>
            <option value="Cobrança">Cobrança</option>
            <option value="Entrega">Entrega</option>
            <option value="Cobrança e Entrega">Cobrança e Entrega</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Tipo de residência *</label>
          <select class="form-select tipoResidencia" required>
            <option value="">Selecione...</option>
            <option>Casa</option>
            <option>Apartamento</option>
            <option>Outro</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tipo Logradouro *</label>
          <select class="form-select tipoLogradouro" required>
            <option value="">Selecione...</option>
            <option>Rua</option>
            <option>Avenida</option>
            <option>Travessa</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8 mb-3">
          <label class="form-label">Logradouro *</label>
          <input type="text" class="form-control logradouro" required />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">Número *</label>
          <input type="text" class="form-control numero" required />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Bairro *</label>
          <input type="text" class="form-control bairro" required />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">CEP *</label>
          <input type="text" class="form-control cep" required />
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">Cidade *</label>
          <input type="text" class="form-control cidade" required />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">Estado *</label>
          <input type="text" class="form-control estado" required />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">País *</label>
          <input type="text" class="form-control pais" value="Brasil" required />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Observações</label>
        <textarea class="form-control observacoes" rows="3"></textarea>
      </div>

      <button type="button" class="btn btn-danger btn-sm mt-2 btnRemoveEndereco">Remover Endereço</button>
    `;
    enderecosContainer.appendChild(div);

    div.querySelector(".btnRemoveEndereco").addEventListener("click", () => {
      div.remove();
    });
  });

  btnAddCartao.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("card", "p-3", "mb-3", "shadow-sm");
    div.innerHTML = `
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Nº do Cartão *</label>
          <input type="text" class="form-control numeroCartao" required />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Nome impresso no Cartão *</label>
          <input type="text" class="form-control nomeCartao" required />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Bandeira *</label>
          <select class="form-select bandeira" required>
            <option value="">Selecione...</option>
            <option>Visa</option>
            <option>Mastercard</option>
          </select>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">CVV *</label>
          <input type="text" class="form-control cvv" maxlength="4" required />
        </div>
      </div>
      <button type="button" class="btn btn-danger btn-sm mt-2 btnRemoveCartao">Remover Cartão</button>
    `;
    cartoesContainer.appendChild(div);

    div.querySelector(".btnRemoveCartao").addEventListener("click", () => {
      div.remove();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    if (senha !== confirmarSenha) {
      alert("As senhas não conferem!");
      return;
    }

    const user = {
      nome: document.getElementById("nome").value,
      genero: document.getElementById("genero").value,
      dataNascimento: document.getElementById("dataNascimento").value,
      cpf: document.getElementById("cpf").value,
      email: document.getElementById("email").value,
      senha,
      confirmarSenha,
    };

    try {
      const resUser = await fetch("http://localhost:3000/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!resUser.ok) throw new Error(await resUser.text());
      const newUser = await resUser.json();
      const userId = newUser.id;

      const telefone = {
        tipo: document.getElementById("tipoTelefone").value,
        ddd: document.getElementById("ddd").value,
        numero: document.getElementById("numeroTelefone").value,
        userId,
      };

      await fetch("http://localhost:3000/api/createTelefone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telefone),
      });

      for (const card of enderecosContainer.querySelectorAll(".card")) {
        const endereco = {
          nome: card.querySelector(".nomeEndereco").value,
          tipoEndereco: card.querySelector(".tipoEndereco").value,
          tipoResidencia: card.querySelector(".tipoResidencia").value,
          tipoLogradouro: card.querySelector(".tipoLogradouro").value,
          logradouro: card.querySelector(".logradouro").value,
          numero: card.querySelector(".numero").value,
          bairro: card.querySelector(".bairro").value,
          cep: card.querySelector(".cep").value,
          cidade: card.querySelector(".cidade").value,
          estado: card.querySelector(".estado").value,
          pais: card.querySelector(".pais").value,
          observacoes: card.querySelector(".observacoes").value,
          userId,
        };

        await fetch("http://localhost:3000/api/createEndereco", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(endereco),
        });
      }

      for (const card of cartoesContainer.querySelectorAll(".card")) {
        const cartao = {
          numero: card.querySelector(".numeroCartao").value,
          nome: card.querySelector(".nomeCartao").value,
          bandeira: card.querySelector(".bandeira").value,
          cvv: card.querySelector(".cvv").value,
          userId,
        };

        await fetch("http://localhost:3000/api/createCartao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cartao),
        });
      }

      alert("Cliente cadastrado com sucesso!");
      form.reset();
      enderecosContainer.innerHTML = "";
      cartoesContainer.innerHTML = "";
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao salvar cliente: " + err.message);
    }
  });
});
