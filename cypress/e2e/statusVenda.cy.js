describe("Fluxo Admin - Gerenciamento de Vendas", () => {
  const vendaMockProcessamento = {
    id: 999,
    userId: 20,
    status: "processamento",
    createdAt: "2025-11-04T10:00:00.000Z",
    user: {
      nome: "João Silva",
    },
  };

  const vendaMockAprovada = {
    id: 999,
    userId: 20,
    status: "aprovada",
    createdAt: "2025-11-04T10:00:00.000Z",
    user: {
      nome: "João Silva",
    },
  };

  const vendaMockTransito = {
    id: 999,
    userId: 20,
    status: "transito",
    createdAt: "2025-11-04T10:00:00.000Z",
    user: {
      nome: "João Silva",
    },
  };

  const vendaMockEntregue = {
    id: 999,
    userId: 20,
    status: "entregue",
    createdAt: "2025-11-04T10:00:00.000Z",
    user: {
      nome: "João Silva",
    },
  };

  const vendaMockEmTroca = {
    id: 888,
    userId: 20,
    status: "emTroca",
    createdAt: "2025-11-04T10:00:00.000Z",
    user: {
      nome: "Maria Santos",
    },
  };

  const vendaMockTrocaAutorizada = {
    id: 888,
    userId: 20,
    status: "trocaAutorizada",
    createdAt: "2025-11-04T10:00:00.000Z",
    user: {
      nome: "Maria Santos",
    },
  };

  const vendaMockReprovada = {
    id: 777,
    userId: 20,
    status: "reprovada",
    createdAt: "2025-11-04T10:00:00.000Z",
    user: {
      nome: "Carlos Souza",
    },
  };

  it("Deve gerenciar o fluxo completo de uma venda: processamento → aprovada → trânsito → entregue", () => {
    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockProcessamento],
    }).as("getSales1");

    cy.intercept("PUT", "**/api/updateStatusSale", {
      statusCode: 200,
      body: { success: true },
    }).as("updateStatus");

    cy.visit("http://127.0.0.1:5501/vendas/listarVendas.html");
    cy.wait("@getSales1");

    cy.log("Etapa 1: Aprovando pagamento");

    cy.contains("EM PROCESSAMENTO").should("be.visible");
    cy.contains("button", "Aprovar Pagamento").should("be.visible");

    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
      cy.stub(win, "alert").as("alertStub");
    });

    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockAprovada],
    }).as("getSales2");

    cy.contains("button", "Aprovar Pagamento").click();

    cy.wait("@updateStatus").its("request.body").should("deep.equal", {
      id: 999,
      status: "aprovada",
    });

    cy.get("@alertStub").should(
      "have.been.calledWith",
      "Status atualizado com sucesso!"
    );
    cy.wait("@getSales2");

    cy.log("Etapa 2: Enviando para transporte");

    cy.contains("APROVADA").should("be.visible");
    cy.contains("button", "Enviar para Transporte").should("be.visible");

    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockTransito],
    }).as("getSales3");

    cy.contains("button", "Enviar para Transporte").click();

    cy.wait("@updateStatus").its("request.body").should("deep.equal", {
      id: 999,
      status: "transito",
    });

    cy.get("@alertStub").should(
      "have.been.calledWith",
      "Status atualizado com sucesso!"
    );
    cy.wait("@getSales3");

    cy.log("Etapa 3: Confirmando entrega");

    cy.contains("EM TRÂNSITO").should("be.visible");
    cy.contains("button", "Confirmar Entrega").should("be.visible");

    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockEntregue],
    }).as("getSales4");

    cy.contains("button", "Confirmar Entrega").click();

    cy.wait("@updateStatus").its("request.body").should("deep.equal", {
      id: 999,
      status: "entregue",
    });

    cy.get("@alertStub").should(
      "have.been.calledWith",
      "Status atualizado com sucesso!"
    );
    cy.wait("@getSales4");

    cy.log("Etapa 4: Verificando status final");

    cy.contains("ENTREGUE").should("be.visible");
    cy.contains("Sem ações disponíveis").should("be.visible");

    cy.log("✅ Fluxo completo concluído!");
  });

  it("Deve reprovar um pagamento em processamento", () => {
    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockProcessamento],
    }).as("getSales1");

    cy.intercept("PUT", "**/api/updateStatusSale", {
      statusCode: 200,
      body: { success: true },
    }).as("updateStatus");

    cy.visit("http://127.0.0.1:5501/vendas/listarVendas.html");
    cy.wait("@getSales1");

    cy.contains("EM PROCESSAMENTO").should("be.visible");
    cy.contains("button", "Reprovar Pagamento").should("be.visible");

    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
      cy.stub(win, "alert").as("alertStub");
    });

    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockReprovada],
    }).as("getSales2");

    cy.contains("button", "Reprovar Pagamento").click();

    cy.wait("@updateStatus").its("request.body").should("deep.equal", {
      id: 999,
      status: "reprovada",
    });

    cy.get("@alertStub").should(
      "have.been.calledWith",
      "Status atualizado com sucesso!"
    );
    cy.wait("@getSales2");

    cy.contains("REPROVADA").should("be.visible");
    cy.contains("Sem ações disponíveis").should("be.visible");
  });

  it("Deve autorizar uma troca em status emTroca", () => {
    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockEmTroca],
    }).as("getSales1");

    cy.intercept("PUT", "**/api/updateStatusSale", {
      statusCode: 200,
      body: { success: true },
    }).as("updateStatus");

    cy.visit("http://127.0.0.1:5501/vendas/listarVendas.html");
    cy.wait("@getSales1");

    cy.log("Autorizando troca para venda #888");

    cy.contains("EM TROCA").should("be.visible");
    cy.contains("button", "Autorizar Troca").should("be.visible");

    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
      cy.stub(win, "alert").as("alertStub");
    });

    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockTrocaAutorizada],
    }).as("getSales2");

    cy.contains("button", "Autorizar Troca").click();

    cy.wait("@updateStatus").its("request.body").should("deep.equal", {
      id: 888,
      status: "trocaAutorizada",
    });

    cy.get("@alertStub").should(
      "have.been.calledWith",
      "Status atualizado com sucesso!"
    );
    cy.wait("@getSales2");

    cy.contains("TROCA AUTORIZADA").should("be.visible");
    cy.contains("Sem ações disponíveis").should("be.visible");

    cy.log("✅ Troca autorizada com sucesso!");
  });

  it("Deve cancelar ação quando admin não confirmar", () => {
    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockProcessamento],
    }).as("getSales");

    cy.intercept("PUT", "**/api/updateStatusSale").as("updateStatus");

    cy.visit("http://127.0.0.1:5501/vendas/listarVendas.html");
    cy.wait("@getSales");

    cy.contains("EM PROCESSAMENTO").should("be.visible");

    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(false);
    });

    cy.contains("button", "Aprovar Pagamento").click();

    cy.get("@updateStatus.all").should("have.length", 0);

    cy.contains("EM PROCESSAMENTO").should("be.visible");
  });

  it("Deve filtrar vendas por período de datas", () => {
    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [vendaMockProcessamento, vendaMockEntregue],
    }).as("getSales1");

    cy.visit("http://127.0.0.1:5501/vendas/listarVendas.html");
    cy.wait("@getSales1");

    const dataInicio = "2025-10-01";
    const dataFim = "2025-10-31";

    cy.get("#dataInicio").type(dataInicio);
    cy.get("#dataFim").type(dataFim);

    cy.intercept(
      "GET",
      "**/api/getSales?dataStart=2025-10-01&dataEnd=2025-10-31",
      {
        statusCode: 200,
        body: [vendaMockProcessamento],
      }
    ).as("getSalesFiltrado");

    cy.contains("button", "Filtrar").click();

    cy.wait("@getSalesFiltrado").then((interception) => {
      const url = new URL(interception.request.url);
      expect(url.searchParams.get("dataStart")).to.equal(dataInicio);
      expect(url.searchParams.get("dataEnd")).to.equal(dataFim);
    });

    cy.get("tbody tr").should("have.length", 1);
    cy.contains("João Silva").should("be.visible");
  });

  it("Deve exibir mensagem quando não houver vendas", () => {
    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [],
    }).as("getSalesVazio");

    cy.visit("http://127.0.0.1:5501/vendas/listarVendas.html");
    cy.wait("@getSalesVazio");

    cy.contains("Nenhuma venda encontrada").should("be.visible");
  });

  it("Deve exibir mensagem de erro quando a API falhar", () => {
    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("getSalesErro");

    cy.visit("http://127.0.0.1:5501/vendas/listarVendas.html");
    cy.wait("@getSalesErro");

    cy.contains("Erro ao carregar vendas. Tente novamente.").should(
      "be.visible"
    );
  });

  it("Deve exibir múltiplas vendas com diferentes status", () => {
    cy.intercept("GET", "**/api/getSales*", {
      statusCode: 200,
      body: [
        vendaMockProcessamento,
        vendaMockAprovada,
        vendaMockTransito,
        vendaMockEntregue,
        vendaMockEmTroca,
        vendaMockReprovada,
      ],
    }).as("getSales");

    cy.visit("http://127.0.0.1:5501/vendas/listarVendas.html");
    cy.wait("@getSales");

    cy.get("tbody tr").should("have.length", 6);

    cy.contains("EM PROCESSAMENTO").should("be.visible");
    cy.contains("APROVADA").should("be.visible");
    cy.contains("EM TRÂNSITO").should("be.visible");
    cy.contains("ENTREGUE").should("be.visible");
    cy.contains("EM TROCA").should("be.visible");
    cy.contains("REPROVADA").should("be.visible");

    cy.contains("Aprovar Pagamento").should("be.visible");
    cy.contains("Reprovar Pagamento").should("be.visible");

    cy.contains("Enviar para Transporte").should("be.visible");

    cy.contains("Confirmar Entrega").should("be.visible");

    cy.contains("Autorizar Troca").should("be.visible");

    cy.contains("Sem ações disponíveis").should("be.visible");
  });
});
