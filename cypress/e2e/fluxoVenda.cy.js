describe("Fluxo completo de compra - PetShop", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/getProducts", {
      statusCode: 200,
      body: [
        { id: 1, name: "Ração Premium", price: 99.9 },
        { id: 2, name: "Brinquedo Bola", price: 25.5 },
      ],
    }).as("getProducts");

    cy.intercept("PUT", "**/api/updateCartItens", {
      statusCode: 200,
      body: { success: true },
    }).as("updateCartItens");
  });

  it("Deve adicionar um produto ao carrinho com sucesso", () => {
    cy.visit("http://127.0.0.1:5501/produtos/listarProdutos.html");
    cy.wait("@getProducts");

    cy.get(".card").should("have.length", 2);

    cy.on("window:alert", (msg) => {
      expect(msg).to.include("Produto adicionado ao carrinho");
    });

    cy.get(".adicionar-carrinho").first().click();
    cy.wait("@updateCartItens").its("response.statusCode").should("eq", 200);
  });

  it("Deve carregar o carrinho e permitir alterar quantidades", () => {
    cy.intercept("GET", "**/api/getCartItems", {
      statusCode: 200,
      body: [{ productId: 1, name: "Ração Premium", price: 99.9, quantity: 1 }],
    }).as("getCartItems");

    cy.visit("http://127.0.0.1:5501/produtos/listarProdutosCarrinho.html");
    cy.wait("@getCartItems");
    cy.get(".cart-item").should("contain", "Ração Premium");

    cy.get(".btn-more").click();
    cy.wait("@updateCartItens");
  });

  it("Deve cadastrar um novo endereço durante a compra", () => {
    cy.intercept("POST", "**/api/createEndereco", {
      statusCode: 200,
      body: { success: true, id: 15 },
    }).as("createEndereco");

    cy.visit("http://127.0.0.1:5501/clientes/criarEnderecoCarrinho.html");

    cy.get('input[name="nome"]').type("Casa Principal");
    cy.get('select[name="tipoEndereco"]').select("Cobrança e entrega");
    cy.get('select[name="tipoResidencia"]').select("Casa");
    cy.get('select[name="tipoLogradouro"]').select("Rua");
    cy.get('input[name="logradouro"]').type("das Flores");
    cy.get('input[name="numero"]').type("123");
    cy.get('input[name="bairro"]').type("Centro");
    cy.get('input[name="cep"]').type("12345-678");
    cy.get('input[name="cidade"]').type("São Paulo");
    cy.get('input[name="estado"]').type("SP");
    cy.get('input[name="pais"]').should("have.value", "Brasil");
    cy.get('textarea[name="observacoes"]').type("Próximo ao mercado");

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertStub");
    });

    cy.get("form").submit();
    cy.wait("@createEndereco").its("response.statusCode").should("eq", 200);

    cy.get("@alertStub").should(
      "have.been.calledWith",
      "Endereço criado com sucesso!"
    );
  });

  it("Deve cadastrar um novo cartão durante a compra", () => {
    cy.intercept("POST", "**/api/createCartao", {
      statusCode: 200,
      body: { success: true, id: 25 },
    }).as("createCartao");

    cy.visit("http://127.0.0.1:5501/clientes/criarCartaoCarrinho.html");

    cy.get('input[name="numero"]').type("1234 5678 9012 3456");
    cy.get('input[name="nome"]').type("JOSE DA SILVA");
    cy.get('select[name="bandeira"]').select("Visa");
    cy.get('input[name="cvv"]').type("123");

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertStub");
    });

    cy.get("form").submit();
    cy.wait("@createCartao").its("response.statusCode").should("eq", 200);

    cy.get("@alertStub").should(
      "have.been.calledWith",
      "Cartão salvo com sucesso!"
    );
  });

  it("Deve finalizar uma compra completa: cadastrar endereço, cartão, comprar e verificar histórico", () => {
    cy.intercept("GET", "**/api/getCartItems", {
      statusCode: 200,
      body: [{ name: "Ração Premium", price: 100, quantity: 1, image: "" }],
    }).as("getCartItems");

    cy.intercept("GET", "**/api/getEnderecos*", {
      statusCode: 200,
      body: [],
    }).as("getEnderecosVazio");

    cy.intercept("GET", "**/api/getCartoes*", {
      statusCode: 200,
      body: [],
    }).as("getCartoesVazio");

    cy.visit("http://127.0.0.1:5501/produtos/crirarCompra.html");
    cy.wait("@getCartItems");
    cy.wait("@getEnderecosVazio");
    cy.wait("@getCartoesVazio");

    cy.get("#select-endereco option").should(
      "contain",
      "Nenhum endereço cadastrado"
    );
    cy.get("#lista-cartoes").should("contain", "Nenhum cartão cadastrado");

    cy.intercept("POST", "**/api/createEndereco", {
      statusCode: 200,
      body: { success: true, id: 30 },
    }).as("createEndereco");

    cy.contains("a", "Cadastrar Novo Endereço").click();
    cy.url().should("include", "criarEnderecoCarrinho.html");

    cy.get('input[name="nome"]').type("Minha Casa");
    cy.get('select[name="tipoEndereco"]').select("Cobrança e entrega");
    cy.get('select[name="tipoResidencia"]').select("Casa");
    cy.get('select[name="tipoLogradouro"]').select("Rua");
    cy.get('input[name="logradouro"]').type("Principal");
    cy.get('input[name="numero"]').type("456");
    cy.get('input[name="bairro"]').type("Jardim");
    cy.get('input[name="cep"]').type("11111-222");
    cy.get('input[name="cidade"]').type("Rio");
    cy.get('input[name="estado"]').type("RJ");

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertEndereco");
      cy.stub(win.location, "href").as("locationHref");
    });

    cy.get("form").submit();
    cy.wait("@createEndereco");

    cy.intercept("POST", "**/api/createCartao", {
      statusCode: 200,
      body: { success: true, id: 40 },
    }).as("createCartao");

    cy.visit("http://127.0.0.1:5501/clientes/criarCartaoCarrinho.html");

    cy.get('input[name="numero"]').type("4111 1111 1111 1111");
    cy.get('input[name="nome"]').type("MARIA SANTOS");
    cy.get('select[name="bandeira"]').select("Visa");
    cy.get('input[name="cvv"]').type("456");

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertCartao");
    });

    cy.get("form").submit();
    cy.wait("@createCartao");

    cy.intercept("GET", "**/api/getEnderecos*", {
      statusCode: 200,
      body: [{ id: 30, nome: "Minha Casa" }],
    }).as("getEnderecosComDados");

    cy.intercept("GET", "**/api/getCartoes*", {
      statusCode: 200,
      body: [{ id: 40, bandeira: "Visa", numero: "4111111111111111" }],
    }).as("getCartoesComDados");

    cy.intercept("POST", "**/api/createSale", {
      statusCode: 200,
      body: { success: true, id: 150 },
    }).as("createSale");

    cy.visit("http://127.0.0.1:5501/produtos/crirarCompra.html");
    cy.wait("@getCartItems");
    cy.wait("@getEnderecosComDados");
    cy.wait("@getCartoesComDados");

    cy.get("#select-endereco").select("Minha Casa");

    cy.get("#cartao-40").check();
    cy.wait(1000);

    cy.get('input.cart-valor[data-card-id="40"]').should(
      "have.value",
      "120.00"
    );

    cy.get("#btn-finalizar").click();
    cy.wait("@createSale").its("response.statusCode").should("eq", 200);

    cy.intercept("GET", "**/api/getSalesUser*", {
      statusCode: 200,
      body: [
        {
          id: 150,
          userId: 20,
          totalValue: 100, // sem frete
          createdAt: new Date().toISOString(),
          status: "processamento",
          items: [
            {
              productId: 1,
              quantity: 1,
              price: 100,
              product: { name: "Ração Premium" },
            },
          ],
          payments: [
            {
              cardId: 40,
              amount: 120,
              card: { numero: "4111111111111111", bandeira: "Visa" },
            },
          ],
        },
      ],
    }).as("getSalesUser");

    cy.visit("http://127.0.0.1:5501/produtos/lisrarCompras.html");
    cy.wait("@getSalesUser");

    cy.contains("Código: #150").should("be.visible");
    cy.contains("Ração Premium (1 unid.)").should("be.visible");
    cy.contains("R$ 120.00").should("be.visible");
    cy.contains("Visa final 1111").should("be.visible");
    cy.contains("EM PROCESSAMENTO").should("be.visible");
  });

  it("Deve finalizar uma compra com 2 cartões e cupom PROMO10", () => {
    cy.intercept("GET", "**/api/getCartItems", {
      statusCode: 200,
      body: [
        { name: "Ração Premium", price: 100, quantity: 1, image: "" },
        { name: "Brinquedo Bola", price: 50, quantity: 1, image: "" },
      ],
    }).as("getCartItems");

    cy.intercept("GET", "**/api/getEnderecos*", {
      statusCode: 200,
      body: [{ id: 10, nome: "Rua dos Pets, 123" }],
    }).as("getEnderecos");

    cy.intercept("GET", "**/api/getCartoes*", {
      statusCode: 200,
      body: [
        { id: 1, bandeira: "Visa", numero: "1111222233334444" },
        { id: 2, bandeira: "Master", numero: "5555666677778888" },
      ],
    }).as("getCartoes");

    cy.intercept("GET", "**/api/getCoupon*", {
      statusCode: 200,
      body: { code: "PROMO10", discountPercentage: 10 },
    }).as("getCoupon");

    cy.intercept("POST", "**/api/createSale", {
      statusCode: 200,
      body: { success: true, id: 99 },
    }).as("createSale");

    cy.visit("http://127.0.0.1:5501/produtos/crirarCompra.html");
    cy.wait("@getCartItems");
    cy.wait("@getEnderecos");
    cy.wait("@getCartoes");

    cy.get("#coupon-input").type("PROMO10");
    cy.get("#apply-coupon").click();
    cy.wait("@getCoupon");
    cy.get("#apply-coupon").should("have.text", "Cupom aplicado!");

    cy.get("#select-endereco").select("Rua dos Pets, 123");

    cy.get("#cartao-1").check();
    cy.get("#cartao-2").check();

    cy.wait(1000);

    cy.get('input.cart-valor[data-card-id="1"]').should("not.have.value", "");
    cy.get('input.cart-valor[data-card-id="2"]').should("not.have.value", "");

    cy.get('input.cart-valor[data-card-id="1"]')
      .clear({ force: true })
      .type("77.50", { force: true });

    cy.get('input.cart-valor[data-card-id="2"]')
      .clear({ force: true })
      .type("77.50", { force: true });

    cy.wait(500);

    cy.get('input.cart-valor[data-card-id="1"]')
      .invoke("val")
      .should("eq", "77.50");

    cy.get('input.cart-valor[data-card-id="2"]')
      .invoke("val")
      .should("eq", "77.50");

    cy.get("#btn-finalizar").click();
    cy.wait("@createSale").its("response.statusCode").should("eq", 200);
  });

  it("Deve exibir alerta se tentar finalizar com um cartão abaixo de R$10", () => {
    cy.intercept("GET", "**/api/getCartItems", {
      statusCode: 200,
      body: [{ name: "Brinquedo Bola", price: 50, quantity: 1, image: "" }],
    }).as("getCartItems");

    cy.intercept("GET", "**/api/getEnderecos*", {
      statusCode: 200,
      body: [{ id: 10, nome: "Rua dos Pets, 123" }],
    }).as("getEnderecos");

    cy.intercept("GET", "**/api/getCartoes*", {
      statusCode: 200,
      body: [
        { id: 1, bandeira: "Visa", numero: "1111222233334444" },
        { id: 2, bandeira: "Master", numero: "5555666677778888" },
      ],
    }).as("getCartoes");

    cy.visit("http://127.0.0.1:5501/produtos/crirarCompra.html");
    cy.wait("@getCartItems");
    cy.wait("@getEnderecos");
    cy.wait("@getCartoes");

    cy.get("#select-endereco").select("Rua dos Pets, 123");

    cy.get("#cartao-1").check();
    cy.get("#cartao-2").check();

    cy.wait(1000);

    cy.get('input.cart-valor[data-card-id="1"]')
      .clear({ force: true })
      .type("65", { force: true });

    cy.get('input.cart-valor[data-card-id="2"]')
      .clear({ force: true })
      .type("5", { force: true });

    cy.wait(500);

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertStub");
    });

    cy.get("#btn-finalizar").click();

    cy.get("@alertStub").should("have.been.calledOnce");
    cy.get("@alertStub").should((stub) => {
      const message = stub.getCall(0).args[0];
      expect(message).to.include("valor mínimo é R$ 10,00");
    });
  });

  it("Deve exibir alerta se a soma dos valores não bater com o total", () => {
    cy.intercept("GET", "**/api/getCartItems", {
      statusCode: 200,
      body: [{ name: "Ração Premium", price: 100, quantity: 1, image: "" }],
    }).as("getCartItems");

    cy.intercept("GET", "**/api/getEnderecos*", {
      statusCode: 200,
      body: [{ id: 10, nome: "Rua dos Pets, 123" }],
    }).as("getEnderecos");

    cy.intercept("GET", "**/api/getCartoes*", {
      statusCode: 200,
      body: [
        { id: 1, bandeira: "Visa", numero: "1111222233334444" },
        { id: 2, bandeira: "Master", numero: "5555666677778888" },
      ],
    }).as("getCartoes");

    cy.visit("http://127.0.0.1:5501/produtos/crirarCompra.html");
    cy.wait("@getCartItems");
    cy.wait("@getEnderecos");
    cy.wait("@getCartoes");

    cy.get("#select-endereco").select("Rua dos Pets, 123");

    cy.get("#cartao-1").check();
    cy.get("#cartao-2").check();

    cy.wait(1000);

    cy.get('input.cart-valor[data-card-id="1"]')
      .clear({ force: true })
      .type("50", { force: true });

    cy.get('input.cart-valor[data-card-id="2"]')
      .clear({ force: true })
      .type("50", { force: true });

    cy.wait(500);

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertStub");
    });

    cy.get("#btn-finalizar").click();

    cy.get("@alertStub").should("have.been.calledOnce");
    cy.get("@alertStub").should((stub) => {
      const message = stub.getCall(0).args[0];
      expect(message).to.include("soma dos valores");
      expect(message).to.include("deve ser igual ao total");
    });
  });

  it("Deve usar a redistribuição automática corretamente", () => {
    cy.intercept("GET", "**/api/getCartItems", {
      statusCode: 200,
      body: [{ name: "Ração Premium", price: 100, quantity: 1, image: "" }],
    }).as("getCartItems");

    cy.intercept("GET", "**/api/getEnderecos*", {
      statusCode: 200,
      body: [{ id: 10, nome: "Rua dos Pets, 123" }],
    }).as("getEnderecos");

    cy.intercept("GET", "**/api/getCartoes*", {
      statusCode: 200,
      body: [
        { id: 1, bandeira: "Visa", numero: "1111222233334444" },
        { id: 2, bandeira: "Master", numero: "5555666677778888" },
        { id: 3, bandeira: "Elo", numero: "9999888877776666" },
      ],
    }).as("getCartoes");

    cy.visit("http://127.0.0.1:5501/produtos/crirarCompra.html");
    cy.wait("@getCartItems");
    cy.wait("@getEnderecos");
    cy.wait("@getCartoes");

    cy.get("#cartao-1").check();
    cy.get("#cartao-2").check();
    cy.get("#cartao-3").check();

    cy.wait(1000);

    cy.get('input.cart-valor[data-card-id="1"]')
      .invoke("val")
      .should("not.be.empty");
    cy.get('input.cart-valor[data-card-id="2"]')
      .invoke("val")
      .should("not.be.empty");
    cy.get('input.cart-valor[data-card-id="3"]')
      .invoke("val")
      .should("not.be.empty");

    cy.get("#cartao-3").uncheck();
    cy.wait(500);

    cy.get('input.cart-valor[data-card-id="3"]').should("have.value", "");

    cy.get('input.cart-valor[data-card-id="1"]')
      .invoke("val")
      .then((val) => {
        expect(parseFloat(val)).to.be.greaterThan(0);
      });

    cy.get('input.cart-valor[data-card-id="2"]')
      .invoke("val")
      .then((val) => {
        expect(parseFloat(val)).to.be.greaterThan(0);
      });
  });

  it("Deve solicitar troca de uma compra entregue com sucesso", () => {
    cy.intercept("GET", "**/api/getSalesUser*", {
      statusCode: 200,
      body: [
        {
          id: 6,
          userId: 20,
          totalValue: 100,
          createdAt: "2025-10-20T14:00:00.000Z",
          status: "entregue",
          items: [
            {
              productId: 2,
              quantity: 1,
              price: 100,
              product: { name: "Brinquedo Bola" },
            },
          ],
          payments: [
            {
              cardId: 51,
              amount: 100,
              card: { numero: "5555666677778888", bandeira: "Master" },
            },
          ],
        },
      ],
    }).as("getSalesUser");

    cy.intercept("PUT", "**/api/updateStatusSale", {
      statusCode: 200,
      body: { success: true },
    }).as("updateStatusSale");

    cy.visit("http://127.0.0.1:5501/produtos/lisrarCompras.html");
    cy.wait("@getSalesUser");

    cy.contains(/Código: #6/).should("be.visible");
    cy.contains(/entregue/i).should("be.visible");

    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
      cy.stub(win, "alert").as("alertStub");
    });

    cy.contains("button", /solicitar troca/i, { timeout: 10000 })
      .should("be.visible")
      .click();

    cy.wait("@updateStatusSale").then((interception) => {
      expect(interception.request.body.id).to.equal(6);
      expect(interception.request.body.status).to.equal("emTroca");
    });

    cy.get("@alertStub").should(
      "have.been.calledWith",
      "Solicitação de troca realizada com sucesso!"
    );
  });

  it("Deve cancelar solicitação de troca quando usuário não confirmar", () => {
    cy.intercept("GET", "**/api/getSalesUser*", {
      statusCode: 200,
      body: [
        {
          id: 201,
          userId: 20,
          totalValue: 100,
          createdAt: "2025-10-20T14:00:00.000Z",
          status: "entregue",
          items: [
            {
              productId: 2,
              quantity: 1,
              price: 100,
              product: { name: "Brinquedo Bola" },
            },
          ],
          payments: [
            {
              cardId: 51,
              amount: 120,
              card: { numero: "5555666677778888", bandeira: "Master" },
            },
          ],
        },
      ],
    }).as("getSalesUser");

    cy.intercept("PUT", "**/api/updateStatusSale").as("updateStatusSale");

    cy.visit("http://127.0.0.1:5501/produtos/lisrarCompras.html");
    cy.wait("@getSalesUser");

    cy.contains("Código: #201").should("be.visible");
    cy.contains("ENTREGUE").should("be.visible");

    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(false);
    });

    cy.contains("button", "Solicitar Troca").click();

    cy.get("@updateStatusSale.all").should("have.length", 0);

    cy.contains("ENTREGUE").should("be.visible");
  });
});
