context('Signin', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/user.json').as('user')
    cy.fixture('users/invalid.json').as('invalidUser')
  })

  it('requires email', () => {
    cy.visit('/')

    cy.get('form').within(() => {
      cy.root().submit()
    })

    cy.get('#email-helper-text').contains('E-mail em branco')
  })

  it('requires a valid email', () => {
    cy.visit('/')

    cy.get('@invalidUser').then((invalidUser) => {
      cy.get('form').within(() => {
        cy.get('#email').type(invalidUser.email)
        cy.root().submit()
      })
    })

    cy.get('#email-helper-text').contains('E-mail inválido')
  })

  it('requires email on /pin', () => {
    cy.visit('/pin')

    cy.get('#pin1').type('1234')

    cy.get('#snackbar-content').should('have.css', 'background-color', 'rgb(211, 47, 47)')
    cy.get('#snackbar-message').contains('Volte e preencha o e-mail')
  })

  it('clears the typed pin on backspace', () => {
    cy.visit('/pin')

    cy.get('#pin1').type('1234')
    cy.get('#pin4').type('{backspace}{backspace}{backspace}{backspace}')

    cy.focused().should('have.attr', 'id', 'pin1')
  })

  it('navigates to /pin on valid email', () => {
    cy.visit('/')

    cy.server()
      .route({
        method: 'POST',
        url: '/graphql',
        status: 200
      })
      .as('graphql')

    cy.get('@user').then((user) => {
      cy.get('form').within(() => {
        cy.get('#email').type(user.email)
        cy.root().submit()
      })
    })

    cy.wait('@graphql').should((xhr) => {
      expect(xhr.request.body.operationName).to.equal('sendPin')
      expect(xhr.status).to.equal(200)
    })

    cy.location('pathname').should('eq', '/pin')
  })
})
