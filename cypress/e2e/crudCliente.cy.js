describe('Fluxo CRUD Completo de Cliente', () => {
  let dadosCliente;
  let userId;

  before(() => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    
    dadosCliente = {
      nome: `Cliente Teste ${randomNum}`,
      genero: 'Feminino',
      dataNascimento: '1995-05-10',
      cpf: `${String(timestamp).slice(-8)}${String(randomNum).padStart(3, '0').slice(0, 3)}`.slice(0, 11),
      email: `cliente.teste.${timestamp}@teste.com`,
      senha: 'Teste@123',
      novaSenha: 'NovaSenha@456',
      telefone: {
        tipo: 'Celular',
        ddd: '11',
        numero: `9${String(randomNum).padStart(8, '0')}`
      },
      endereco: {
        nome: 'Casa Principal',
        tipoEndereco: 'Cobrança e Entrega',
        tipoResidencia: 'Casa',
        tipoLogradouro: 'Rua',
        logradouro: 'das Flores',
        numero: '123',
        bairro: 'Centro',
        cep: '01001000',
        cidade: 'São Paulo',
        estado: 'SP',
        pais: 'Brasil'
      },
      enderecoNovo: {
        nome: 'Casa Secundária',
        tipoEndereco: 'Cobrança',
        tipoResidencia: 'Apartamento',
        tipoLogradouro: 'Avenida',
        logradouro: 'Paulista',
        numero: '456',
        bairro: 'Bela Vista',
        cep: '01310100',
        cidade: 'São Paulo',
        estado: 'SP',
        pais: 'Brasil'
      },
      cartao: {
        numero: '4111111111111111',
        nome: `Cliente Teste ${randomNum}`,
        bandeira: 'Visa',
        cvv: '123'
      }
    };
  });

  it('1. Deve criar um novo cliente com sucesso', () => {
    cy.visit('http://127.0.0.1:5501/clientes/criarCliente.html');

    cy.get('#genero').select(dadosCliente.genero);
    cy.get('#nome').type(dadosCliente.nome);
    cy.get('#dataNascimento').type(dadosCliente.dataNascimento);
    cy.get('#cpf').type(dadosCliente.cpf);
    cy.get('#email').type(dadosCliente.email);
    cy.get('#senha').type(dadosCliente.senha);
    cy.get('#confirmarSenha').type(dadosCliente.senha);

    cy.get('#tipoTelefone').select(dadosCliente.telefone.tipo);
    cy.get('#ddd').type(dadosCliente.telefone.ddd);
    cy.get('#numeroTelefone').type(dadosCliente.telefone.numero);

    cy.get('#btnAddEndereco').click();
    cy.get('.nomeEndereco').type(dadosCliente.endereco.nome);
    cy.get('.tipoEndereco').select(dadosCliente.endereco.tipoEndereco);
    cy.get('.tipoResidencia').select(dadosCliente.endereco.tipoResidencia);
    cy.get('.tipoLogradouro').select(dadosCliente.endereco.tipoLogradouro);
    cy.get('.logradouro').type(dadosCliente.endereco.logradouro);
    cy.get('.numero').type(dadosCliente.endereco.numero);
    cy.get('.bairro').type(dadosCliente.endereco.bairro);
    cy.get('.cep').type(dadosCliente.endereco.cep);
    cy.get('.cidade').type(dadosCliente.endereco.cidade);
    cy.get('.estado').type(dadosCliente.endereco.estado);
    cy.get('.pais').type(dadosCliente.endereco.pais);

    cy.get('#btnAddCartao').click();
    cy.get('.numeroCartao').type(dadosCliente.cartao.numero);
    cy.get('.nomeCartao').type(dadosCliente.cartao.nome);
    cy.get('.bandeira').select(dadosCliente.cartao.bandeira);
    cy.get('.cvv').type(dadosCliente.cartao.cvv);

    cy.intercept('POST', '**/api/createUser').as('createUser');
    cy.intercept('POST', '**/api/createTelefone').as('createTelefone');
    cy.intercept('POST', '**/api/createEndereco').as('createEndereco');
    cy.intercept('POST', '**/api/createCartao').as('createCartao');

    cy.get('#formCliente').submit();

    cy.wait('@createUser').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 201]);
      userId = interception.response.body.userId || interception.response.body.id;
    });
    
    cy.wait('@createTelefone').its('response.statusCode').should('eq', 200);
    cy.wait('@createEndereco').its('response.statusCode').should('eq', 200);
    cy.wait('@createCartao').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (msg) => {
      expect(msg).to.contains('Cliente cadastrado com sucesso');
    });
  });

  it('2. Deve visualizar o cliente na listagem', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);

    cy.get('.form-control').type(dadosCliente.nome);
    
    cy.wait(500); 

    cy.get('#tabelaClientes').should('contain', dadosCliente.nome);
    
    cy.get('#tabelaClientes').within(() => {
      cy.contains('tr', dadosCliente.nome).within(() => {
        cy.get('.btn-warning').should('contain', 'Editar');
        cy.get('.btn-secondary').should('contain', 'Alterar Senha');
        cy.get('.btn-primary').should('contain', 'Endereços');
        cy.get('.btn-info').should('contain', 'Cartões');
        cy.get('.btn-dark').should('contain', 'Transações');
        cy.get('.btn-danger').should('contain', 'Excluir');
      });
    });
  });

  it('3. Deve editar os dados do cliente', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);
    
    cy.contains('tr', dadosCliente.nome).find('.btn-warning').click();

    cy.url().should('include', 'editarCliente.html');
    cy.wait(1000);

    const nomeEditado = `${dadosCliente.nome} Editado`;
    cy.get('#nome').clear().type(nomeEditado);
    cy.get('#genero').select('Outro');

    cy.intercept('PUT', '**/api/updateUser').as('updateUser');

    cy.get('button[type="submit"]').click();

    cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Cliente atualizado com sucesso');
    });

    dadosCliente.nome = nomeEditado;
  });

  it('4. Deve alterar a senha do cliente', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);
    
    cy.contains('tr', dadosCliente.nome).find('.btn-secondary').click();

    cy.url().should('include', 'editarSenha.html');

    cy.get('#senhaAtual').type(dadosCliente.senha);
    cy.get('#novaSenha').type(dadosCliente.novaSenha);
    cy.get('#confirmarSenha').type(dadosCliente.novaSenha);

    cy.intercept('PUT', '**/api/updateSenha').as('updateSenha');

    cy.get('form').submit();

    cy.wait('@updateSenha').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Senha atualizada com sucesso');
    });
  });

  it('5. Deve visualizar endereços do cliente', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);
    
    cy.contains('tr', dadosCliente.nome).find('.btn-primary').click();

    cy.url().should('include', 'listarEnderecos.html');
    cy.wait(1000);

    cy.get('#enderecosBody').should('contain', dadosCliente.endereco.nome);
  });

  it('6. Deve criar um novo endereço', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);
    cy.contains('tr', dadosCliente.nome).find('.btn-primary').click();
    cy.wait(1000);

    cy.get('a[href*="criarEndereco.html"]').click();

    cy.url().should('include', 'criarEndereco.html');

    cy.get('input[name="nome"]').type(dadosCliente.enderecoNovo.nome);
    cy.get('select[name="tipoEndereco"]').select(dadosCliente.enderecoNovo.tipoEndereco);
    cy.get('select[name="tipoResidencia"]').select(dadosCliente.enderecoNovo.tipoResidencia);
    cy.get('select[name="tipoLogradouro"]').select(dadosCliente.enderecoNovo.tipoLogradouro);
    cy.get('input[name="logradouro"]').type(dadosCliente.enderecoNovo.logradouro);
    cy.get('input[name="numero"]').type(dadosCliente.enderecoNovo.numero);
    cy.get('input[name="bairro"]').type(dadosCliente.enderecoNovo.bairro);
    cy.get('input[name="cep"]').type(dadosCliente.enderecoNovo.cep);
    cy.get('input[name="cidade"]').type(dadosCliente.enderecoNovo.cidade);
    cy.get('input[name="estado"]').type(dadosCliente.enderecoNovo.estado);
    cy.get('input[name="pais"]').type(dadosCliente.enderecoNovo.pais);

    cy.intercept('POST', '**/api/createEndereco').as('createEndereco');

    cy.get('form').submit();

    cy.wait('@createEndereco').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Endereço criado com sucesso');
    });
  });

  it('7. Deve editar um endereço existente', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);
    cy.contains('tr', dadosCliente.nome).find('.btn-primary').click();
    cy.wait(1000);

    cy.get('#enderecosBody').contains('tr', dadosCliente.endereco.nome).find('.btn-warning').click();

    cy.url().should('include', 'editarEndereco.html');
    cy.wait(1000);

    const nomeEnderecoEditado = `${dadosCliente.endereco.nome} Editado`;
    cy.get('input[name="nome"]').clear().type(nomeEnderecoEditado);
    cy.get('input[name="numero"]').clear().type('999');

    cy.intercept('PUT', '**/api/updateEndereco').as('updateEndereco');

    cy.get('form').submit();

    cy.wait('@updateEndereco').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Endereço atualizado com sucesso');
    });
  });

  it('8. Deve inativar o cliente', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);

    cy.intercept('PUT', '**/api/updateStatusUser').as('updateStatus');

    cy.contains('tr', dadosCliente.nome).within(() => {
      cy.get('.toggle-status').should('be.checked').click();
    });

    cy.wait('@updateStatus').its('response.statusCode').should('eq', 200);

    cy.contains('tr', dadosCliente.nome).within(() => {
      cy.get('.toggle-status').should('not.be.checked');
    });
  });

  it('9. Deve ativar o cliente novamente', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);

    cy.intercept('PUT', '**/api/updateStatusUser').as('updateStatus');

    cy.contains('tr', dadosCliente.nome).within(() => {
      cy.get('.toggle-status').should('not.be.checked').click();
    });

    cy.wait('@updateStatus').its('response.statusCode').should('eq', 200);

    cy.contains('tr', dadosCliente.nome).within(() => {
      cy.get('.toggle-status').should('be.checked');
    });
  });

  it('10. Deve visualizar cartões do cliente', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);
    
    cy.contains('tr', dadosCliente.nome).find('.btn-info').click();

    cy.url().should('include', 'listarCartoes.html');
    cy.wait(1000);

    cy.get('#cartoesBody').should('contain', '**** **** **** 1111');
  });

  it('11. Deve atualizar o cartão preferencial', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);
    cy.contains('tr', dadosCliente.nome).find('.btn-info').click();
    cy.wait(1000);

    cy.intercept('PUT', '**/api/updateCartaoPreferencial').as('updatePreferencial');

    cy.get('#cartoesBody input[name="preferencial"]').first().then($radio => {
      if (!$radio.is(':checked')) {
        cy.wrap($radio).click();
        cy.wait('@updatePreferencial').its('response.statusCode').should('eq', 200);
      }
    });

    cy.get('#cartoesBody input[name="preferencial"]').first().should('be.checked');
  });

  it('12. Deve criar um novo cartão', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);
    cy.contains('tr', dadosCliente.nome).find('.btn-info').click();
    cy.wait(1000);

    cy.get('a.btn-success').click();

    cy.url().should('include', 'criarCartao.html');

    const novoCartao = {
      numero: '5555555555554444',
      nome: dadosCliente.nome,
      bandeira: 'Mastercard',
      cvv: '456'
    };

    cy.get('input[name="numero"]').type(novoCartao.numero);
    cy.get('input[name="nome"]').type(novoCartao.nome);
    cy.get('select[name="bandeira"]').select(novoCartao.bandeira);
    cy.get('input[name="cvv"]').type(novoCartao.cvv);

    cy.intercept('POST', '**/api/createCartao').as('createCartao');

    cy.get('form').submit();

    cy.wait('@createCartao').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (msg) => {
      expect(msg).to.include('Cartão salvo com sucesso');
    });

    cy.url().should('include', 'listarCartoes.html');
    cy.wait(1000);
    cy.get('#cartoesBody').should('contain', '**** **** **** 4444');
  });

  it('13. Deve excluir o cliente criado no teste', () => {
    cy.visit('http://127.0.0.1:5501/clientes/listarClientes.html');
    
    cy.wait(1000);
    
    cy.get('.form-control').type(dadosCliente.nome);
    cy.wait(500);

    cy.intercept('DELETE', '**/api/deleteUser*').as('deleteUser');

    cy.contains('tr', dadosCliente.nome).find('.btn-danger').click();

    cy.on('window:confirm', () => true);

    cy.wait('@deleteUser').its('response.statusCode').should('eq', 200);

    cy.get('#tabelaClientes').should('not.contain', dadosCliente.nome);
  });

  after(() => {
    cy.log('Teste CRUD completo finalizado com sucesso!');
    cy.log('Cliente criado foi excluído do banco de dados.');
  });
});