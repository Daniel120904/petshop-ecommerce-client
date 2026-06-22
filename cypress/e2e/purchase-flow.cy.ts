// cypress/e2e/purchase-flow.cy.ts

const API_URL = "http://localhost:3001/api";

const TEST_EMAIL    = "joao@gmail.com";
const TEST_PASSWORD = "123@Pass";

// ---------------------------------------------------------------------------
// Login com cy.session — persiste localStorage (tokens) entre testes
// ---------------------------------------------------------------------------

function loginSession() {
  cy.session(
    "user-session",
    () => {
      cy.intercept("POST", `${API_URL}/login`).as("login");

      cy.visit("http://localhost:3000/");

      cy.get("#login-email").type(TEST_EMAIL);
      cy.get("#login-password").type(TEST_PASSWORD);
      cy.get('button[type="submit"]').contains("Entrar").click();

      cy.wait("@login").its("response.statusCode").should("eq", 200);
      cy.url().should("include", "/user");
    },
    {
      // Valida que os tokens ainda existem no localStorage
      validate() {
        cy.window().its("localStorage").invoke("getItem", "accessToken").should("exist");
      },
    }
  );
}

// ---------------------------------------------------------------------------
// Intercepts reutilizáveis
// ---------------------------------------------------------------------------

function interceptProducts() {
  cy.intercept("GET", `${API_URL}/product*`).as("getProducts");
}

function interceptCart() {
  cy.intercept("GET", `${API_URL}/cart`).as("getCart");
  cy.intercept("POST", `${API_URL}/cart`).as("updateCart");
}

function interceptMe() {
  cy.intercept("GET", `${API_URL}/me`).as("getMe");
}

function interceptCreateSale() {
  cy.intercept("POST", `${API_URL}/sale`).as("createSale");
}

// ---------------------------------------------------------------------------
// Testes
// ---------------------------------------------------------------------------

describe("Fluxo de compra do usuário", () => {
  beforeEach(() => {
    loginSession();
  });

  // ── 1. Listagem de produtos ──────────────────────────────────────────────

  describe("1 · Listagem de produtos", () => {
    beforeEach(() => {
      interceptProducts();
      cy.visit("/user/products");
      cy.wait("@getProducts");
    });

    it("exibe ao menos um produto na grade", () => {
      cy.get("[class*='card']").should("have.length.greaterThan", 0);
    });

    it("adiciona o primeiro produto ao carrinho e exibe feedback de sucesso", () => {
      interceptCart();

      cy.contains("button", "Adicionar ao carrinho").first().click();

      cy.wait("@updateCart").its("response.statusCode").should("eq", 200);

      cy.contains("button", "Adicionado!").should("exist");
    });
  });

  // ── 2. Carrinho ──────────────────────────────────────────────────────────

  describe("2 · Carrinho", () => {
    beforeEach(() => {
      interceptCart();
      cy.visit("http://localhost:3000/user/cart");
      cy.wait("@getCart");
    });

    it("exibe o cabeçalho 'Seu Carrinho'", () => {
      cy.contains("h2", "Seu Carrinho").should("be.visible");
    });

    it("exibe ao menos um item no carrinho", () => {
      cy.get("[class*='list'] li").should("have.length.greaterThan", 0);
    });

    it("exibe o total do carrinho", () => {
      cy.contains("Total do carrinho").should("be.visible");
      cy.get("[class*='totalValue']").should("not.be.empty");
    });

    it("link 'Finalizar Compra' aponta para /user/orders/new", () => {
      cy.get("a").contains("Finalizar Compra")
        .should("have.attr", "href", "/user/orders/new");
    });
  });

  // ── 3. Checkout — pagamento com cartão ───────────────────────────────────

  describe("3 · Checkout — pagamento com cartão", () => {
    beforeEach(() => {
      interceptCart();
      interceptMe();
      interceptCreateSale();
      cy.visit("http://localhost:3000/user/orders/new");
      cy.wait(["@getCart", "@getMe"]);
    });

    it("exibe o resumo do carrinho com produtos", () => {
      cy.get("[class*='itemList'] li").should("have.length.greaterThan", 0);
    });

    it("exibe as linhas de subtotal, frete e total", () => {
      cy.contains("Subtotal").should("be.visible");
      cy.contains("Frete").should("be.visible");
      cy.contains("Total").should("be.visible");
    });

    it("seleciona o primeiro endereço disponível por padrão", () => {
      cy.get("input[name='address']").first().should("be.checked");
    });

    it("seleciona o primeiro cartão disponível por padrão", () => {
      cy.get("input[name='card']").first().should("be.checked");
    });

    it("completa a compra com cartão e redireciona para /user/orders", () => {
      cy.get("input[name='address']").first().check({ force: true });
      cy.get("input[name='card']").first().check({ force: true });

      cy.contains("button", "Confirmar Compra").click();

      cy.wait("@createSale").its("response.statusCode").should("eq", 200);

      cy.url().should("include", "/user/orders");
    });
  });

  // ── 4. Checkout — pagamento com Pix ─────────────────────────────────────

  describe("1 · Adiciona um produto", () => {
    beforeEach(() => {
      interceptProducts();
      cy.visit("/user/products");
      cy.wait("@getProducts");
    });

    it("exibe ao menos um produto na grade", () => {
      cy.get("[class*='card']").should("have.length.greaterThan", 0);
    });

    it("adiciona o primeiro produto ao carrinho e exibe feedback de sucesso", () => {
      interceptCart();

      cy.contains("button", "Adicionar ao carrinho").first().click();

      cy.wait("@updateCart").its("response.statusCode").should("eq", 200);

      cy.contains("button", "Adicionado!").should("exist");
    });
  });

  describe("4 · Checkout — pagamento com Pix", () => {
    beforeEach(() => {
      interceptCart();
      interceptMe();
      interceptCreateSale();
      cy.visit("http://localhost:3000/user/orders/new");
      cy.wait(["@getCart", "@getMe"]);
    });

    it("exibe mensagem informativa ao escolher Pix", () => {
      cy.contains("button", "Pix").click();
      cy.contains("QR Code").should("be.visible");
    });

    it("completa a compra com Pix e redireciona para /user/orders", () => {
      cy.get("input[name='address']").first().check({ force: true });
      cy.contains("button", "Pix").click();

      cy.contains("button", "Confirmar Compra").click();

      cy.wait("@createSale")
        .its("request.body")
        .should("deep.include", { paymentType: "pix" });

      cy.url().should("include", "/user/orders");
    });
  });
});