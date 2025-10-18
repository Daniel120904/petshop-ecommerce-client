describe('Fluxo de Cadastro de Cliente', () => {
  it('Deve preencher formulário e cadastrar cliente com sucesso', () => {
    cy.visit('http://127.0.0.1:5500/clientes/criarCliente.html'); 

    cy.get('#genero').select('Feminino');
    cy.get('#nome').type('Maria da Silva');
    cy.get('#dataNascimento').type('1995-05-10');
    cy.get('#cpf').type('12345678915');
    cy.get('#email').type('maria2@email.com');
    cy.get('#senha').type('Teste@123');
    cy.get('#confirmarSenha').type('Teste@123');

    cy.get('#tipoTelefone').select('Celular');
    cy.get('#ddd').type('11');
    cy.get('#numeroTelefone').type('987654321');

    cy.get('#btnAddEndereco').click();
    cy.get('.nomeEndereco').type('Casa Principal');
    cy.get('.tipoEndereco').select('Cobrança e Entrega');
    cy.get('.tipoResidencia').select('Casa');
    cy.get('.tipoLogradouro').select('Rua');
    cy.get('.logradouro').type('das Flores');
    cy.get('.numero').type('123');
    cy.get('.bairro').type('Centro');
    cy.get('.cep').type('01001000');
    cy.get('.cidade').type('São Paulo');
    cy.get('.estado').type('SP');
    cy.get('.pais').type('Brasil');

    cy.get('#btnAddCartao').click();
    cy.get('.numeroCartao').type('4111111111111111');
    cy.get('.nomeCartao').type('Maria da Silva');
    cy.get('.bandeira').select('Visa');
    cy.get('.cvv').type('123');

    cy.intercept('POST', 'http://localhost:3000/api/createUser').as('createUser');
    cy.intercept('POST', 'http://localhost:3000/api/createTelefone').as('createTelefone');
    cy.intercept('POST', 'http://localhost:3000/api/createEndereco').as('createEndereco');
    cy.intercept('POST', 'http://localhost:3000/api/createCartao').as('createCartao');

    cy.get('#formCliente').submit();

    cy.wait('@createUser').its('response.statusCode').should('be.oneOf', [200,201]);
    cy.wait('@createTelefone').its('response.statusCode').should('eq', 200);
    cy.wait('@createEndereco').its('response.statusCode').should('eq', 200);
    cy.wait('@createCartao').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (msg) => {
      expect(msg).to.contains('Cliente cadastrado com sucesso');
    });
  });
});
