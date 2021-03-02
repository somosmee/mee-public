context('Delete customer', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/user.json').then((user) => cy.signup(user.email))
    cy.fixture('customers/customers.json').then((customers) =>
      cy.createCustomers(customers.slice(0, 3))
    )
    cy.fixture('customers/customers.json').as('customers')
    cy.visit('/customers')
  })

  it('opens delete customer dialog', () => {
    cy.get('tbody > tr ', { timeout: 10000 })
      .first()
      .find('#delete')
      .click()

    cy.get('#alert-dialog-title').contains('Excluir cliente')
  })

  it('deletes a customer ', () => {
    cy.get('@customers').then((customers) => {
      cy.get('#customers', { timeout: 10000 })
        .contains('tr', customers[2].firstName)
        .find('#delete')
        .click()

      cy.get('#alert-dialog-primary').click()

      cy.get('#snackbar-content', { timeout: 10000 }).should(
        'have.css',
        'background-color',
        'rgb(67, 160, 71)'
      )
      cy.get('#snackbar-message').contains('Cliente apagado')

      cy.get('#customers > tbody > tr').within(() => {
        cy.contains(customers[2].firstName).should('not.exist')
        cy.contains(customers[2].mobile).should('not.exist')
        cy.contains(customers[2].lastName).should('not.exist')
      })
    })
  })
})
