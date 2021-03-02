context('Delete customer address', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/user.json').then((user) => cy.signup(user.email))
    cy.fixture('customers/customerWithAddress.json').then((customerWithAddress) =>
      cy.createCustomers([customerWithAddress])
    )
    cy.visit('/customers')
  })

  it('opens edit customer dialog', () => {
    cy.get('#customers > tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('#dialog-appbar').contains('Edite um cliente')
  })

  it('shows manage addresses', () => {
    cy.get('#customers > tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('#manage-addresses').click()

    cy.get('#dialog-appbar').contains('Gerencie os endereços')
  })

  it('shows edit address', () => {
    cy.get('#customers > tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('#manage-addresses').click()

    cy.get('#addresses > div > li ', { timeout: 10000 })
      .first()
      .get('#edit-address')
      .click()

    cy.get('#dialog-appbar').contains('Edite um endereço')
  })

  it('deletes customer address', () => {
    cy.get('#customers > tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('#manage-addresses').click()

    cy.get('#addresses > div > div ', { timeout: 10000 })
      .first()
      .get('#delete-address')
      .click()

    cy.get('#alert-dialog-title').contains('Excluir endereço?')

    cy.get('#alert-dialog-primary').click()

    cy.get('#snackbar-content', { timeout: 10000 }).should(
      'have.css',
      'background-color',
      'rgb(67, 160, 71)'
    )
    cy.get('#snackbar-message').contains('Endereço apagado')

    cy.get('#dialog-appbar').contains('Gerencie os endereços')

    cy.get('#addresses').should('not.exist')
  })
})
