context('Signup', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/new.json').as('newUser')
    cy.visit('/')
  })

  it('navigates to /reports on successful signup', () => {
    cy.server({ method: 'POST', status: 200 })

    cy.route('/graphql').as('sendPin')

    cy.get('@newUser').then((newUser) => {
      cy.get('form').within(() => {
        cy.get('#email').type(newUser.email)
        cy.root().submit()
      })
    })

    cy.wait('@sendPin').should((xhr) => {
      expect(xhr.request.body.operationName).to.equal('sendPin')
      expect(xhr.status).to.equal(200)
    })

    cy.location('pathname').should('eq', '/pin')

    cy.route('/graphql').as('signin')

    cy.get('@newUser').then((newUser) => {
      cy.task('findUser', { email: newUser.email }).then((user) => {
        cy.get('#pin1').type(user.pin)
      })
    })

    cy.wait('@signin').should((xhr) => {
      expect(xhr.request.body.operationName).to.equal('signin')
      expect(xhr.status).to.equal(200)
    })

    cy.location('pathname').should('eq', '/reports')
  })
})
