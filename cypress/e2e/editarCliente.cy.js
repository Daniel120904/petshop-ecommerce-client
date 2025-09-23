describe('Edição de Cliente', () => {
  it('Deve editar cliente com sucesso', () => {
    cy.intercept('GET', '**/api/getUser*', {
      statusCode: 200,
      body: {
        userId: 1,
        nome: 'João da Silva',
        genero: 'Masculino',
        dataNascimento: '1990-01-01T00:00:00.000Z',
        cpf: '123.456.789-00',
        email: 'joao@email.com'
      }
    }).as('getUser');

    cy.visit('http://localhost:8080/clientes/editarCliente.html?userId=1');

    cy.wait('@getUser');

    cy.get('#nome').clear().type('João da Silva Alterado');
    cy.get('#genero').select('Outro');
    cy.get('#dataNascimento').clear().type('1992-05-15');
    cy.get('#cpf').clear().type('987.654.321-00');
    cy.get('#email').clear().type('joao.alterado@email.com');

    cy.intercept('PUT', '**/api/updateUser', {
      statusCode: 200,
      body: { success: true }
    }).as('updateUser');

    cy.get('button[type="submit"]').click();

    cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Cliente atualizado com sucesso');
    });
  });
});
