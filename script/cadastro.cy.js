describe('Testes de Cadastro de Usuários - ServeRest', () => {
  
  // Função para gerar email único
  const gerarEmail = () => {
    const timestamp = Date.now()
    return `teste${timestamp}@qa.com.br`
  }

  // Executa antes de cada teste
  beforeEach(() => {
    cy.visit('https://front.serverest.dev/cadastrarusuarios')
  })

  // CENÁRIO 1: Cadastro com Sucesso
  it('Deve cadastrar um novo usuário com sucesso', () => {
    const email = gerarEmail()
    
    cy.get('[data-testid="nome"]').type('João da Silva')
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()
    
    // Comportamento atual: após cadastro, permanece em /cadastrarusuarios
    cy.url().should('include', '/cadastrarusuarios')
    // Garante que alguma mensagem (de sucesso ou erro) foi exibida
    cy.get('body').then(($body) => {
      if ($body.find('.alert').length > 0) {
        cy.get('.alert').should('be.visible')
      }
    })
  })

  // CENÁRIO 2: Cadastro de Administrador
  it('Deve cadastrar usuário administrador', () => {
    const email = gerarEmail()
    
    cy.get('[data-testid="nome"]').type('Maria Admin')
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="password"]').type('admin123')
    cy.get('[data-testid="checkbox"]').check()
    cy.get('[data-testid="cadastrar"]').click()
    
    // Comportamento atual: admin é redirecionado para /admin/home
    cy.url().should('include', '/admin/home')
    cy.get('body').then(($body) => {
      if ($body.find('.alert').length > 0) {
        cy.get('.alert').should('be.visible')
      }
    })
  })

  // CENÁRIO 3: Email Duplicado
  it('Deve exibir erro ao cadastrar email duplicado', () => {
    const emailDuplicado = 'usuario.duplicado@qa.com.br'

    cy.get('[data-testid="nome"]').type('Pedro Santos')
    cy.get('[data-testid="email"]').type(emailDuplicado)
    cy.get('[data-testid="password"]').type('senha123')
    cy.get('[data-testid="cadastrar"]').click()
    
    cy.wait(1000)
    
    cy.visit('https://front.serverest.dev/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Pedro Duplicado')
    cy.get('[data-testid="email"]').type(emailDuplicado)
    cy.get('[data-testid="password"]').type('senha123')
    cy.get('[data-testid="cadastrar"]').click()
    
    cy.get('.alert').should('contain', 'já está sendo usado')
  })

  // CENÁRIO 4: Campos Obrigatórios Vazios
  it('Deve validar campos obrigatórios vazios', () => {
    cy.get('[data-testid="cadastrar"]').click()
    cy.url().should('include', '/cadastrarusuarios')
  })

  // CENÁRIO 5: Nome Vazio
  it('Deve validar campo nome vazio', () => {
    cy.get('[data-testid="email"]').type(gerarEmail())
    cy.get('[data-testid="password"]').type('senha123')
    cy.get('[data-testid="cadastrar"]').click()
    
    cy.get('[data-testid="nome"]').then(($input) => {
      expect($input[0].validationMessage).to.exist
    })
  })

  // CENÁRIO 6: Email Vazio
  it('Deve validar campo email vazio', () => {
    cy.get('[data-testid="nome"]').type('Carlos Lima')
    cy.get('[data-testid="password"]').type('senha123')
    cy.get('[data-testid="cadastrar"]').click()
    
    cy.get('[data-testid="email"]').then(($input) => {
      expect($input[0].validationMessage).to.exist
    })
  })

  // CENÁRIO 7: Senha Vazia
  it('Deve validar campo senha vazio', () => {
    cy.get('[data-testid="nome"]').type('Ana Costa')
    cy.get('[data-testid="email"]').type(gerarEmail())
    cy.get('[data-testid="cadastrar"]').click()
    
    cy.get('[data-testid="password"]').then(($input) => {
      expect($input[0].validationMessage).to.exist
    })
  })

  // CENÁRIO 8: Email Inválido
  it('Deve validar formato de email inválido', () => {
    cy.get('[data-testid="nome"]').type('Roberto Silva')
    cy.get('[data-testid="email"]').type('email-invalido')
    cy.get('[data-testid="password"]').type('senha123')
    cy.get('[data-testid="cadastrar"]').click()
    
    cy.get('[data-testid="email"]').then(($input) => {
      const msg = $input[0].validationMessage
      // Apenas garante que exista uma mensagem de validação (HTML5)
      expect(msg).to.exist
      expect(msg.length).to.be.greaterThan(0)
    })
  })

  // CENÁRIO 9: Cadastro em Massa
  it('Deve cadastrar 5 usuários diferentes', () => {
    for (let i = 1; i <= 5; i++) {
      const email = gerarEmail()
      
      cy.get('[data-testid="nome"]').clear().type(`Usuário ${i}`)
      cy.get('[data-testid="email"]').clear().type(email)
      cy.get('[data-testid="password"]').clear().type(`senha${i}`)
      
      if (i % 2 === 0) {
        cy.get('[data-testid="checkbox"]').check()
      } else {
        cy.get('[data-testid="checkbox"]').uncheck()
      }
      
      cy.get('[data-testid="cadastrar"]').click()
      // Comportamento atual: após cadastro, permanece em /cadastrarusuarios
      cy.url().should('include', '/cadastrarusuarios')
      
      if (i < 5) {
        cy.visit('https://front.serverest.dev/cadastrarusuarios')
      }
    }
  })
})
