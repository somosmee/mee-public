context('Signin', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.fixture('users/user.json').then((user) => cy.signup(user.email))
    cy.clearLocalStorage()
    cy.fixture('users/user.json').as('user')
    cy.visit('/')
  })

  it('navigates to /sales on successful signin', () => {
    cy.server({ method: 'POST', status: 200 })

    cy.route('/graphql').as('sendPin')

    cy.get('@user').then((user) => {
      cy.get('form').within(() => {
        cy.get('#email').type(user.email)
        cy.root().submit()
      })
    })

    cy.wait('@sendPin').should((xhr) => {
      expect(xhr.request.body.operationName).to.equal('sendPin')
      expect(xhr.status).to.equal(200)
    })

    cy.location('pathname').should('eq', '/pin')

    cy.route('/graphql').as('signin')

    cy.get('@user').then((user) => {
      cy.task('findUser', { email: user.email }).then((user) => {
        cy.get('#pin1').type(user.pin)
      })
    })

    cy.wait('@signin').should((xhr) => {
      expect(xhr.request.body.operationName).to.equal('signin')
      expect(xhr.status).to.equal(200)
    })

    cy.location('pathname').should('eq', '/sales')
  })
})
