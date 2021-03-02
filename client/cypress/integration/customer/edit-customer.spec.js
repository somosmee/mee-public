context('Edit customer', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/user.json').then((user) => cy.signup(user.email))
    cy.fixture('customers/customer.json').then((customer) => cy.createCustomers([customer]))
    cy.fixture('customers/customer.json').as('customer')
    cy.fixture('customers/updated.json').as('updatedCustomer')
    cy.visit('/customers')
  })

  it('opens edit a customer dialog', () => {
    cy.get('tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('#dialog-appbar').contains('Edite um cliente')
  })

  it('edits a customer information', () => {
    cy.get('tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('@updatedCustomer').then((updatedCustomer) => {
      cy.get('form').within(() => {
        cy.get('#firstName')
          .clear()
          .type(updatedCustomer.firstName)
        cy.get('#lastName')
          .clear()
          .type(updatedCustomer.lastName)
        cy.get('#email')
          .clear()
          .type(updatedCustomer.email)
        cy.get('#birthday')
          .clear()
          .type(updatedCustomer.birthday)
        cy.root().submit()
      })
    })

    cy.get('#snackbar-content', { timeout: 10000 }).should(
      'have.css',
      'background-color',
      'rgb(67, 160, 71)'
    )
    cy.get('#snackbar-message').contains('Cliente atualizado')
  })

  it('edits a customer with full informations', () => {
    cy.get('tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('@updatedCustomer').then((updatedCustomer) => {
      cy.get('form').within(() => {
        cy.get('#firstName')
          .clear()
          .type(updatedCustomer.firstName)
        cy.get('#lastName')
          .clear()
          .type(updatedCustomer.lastName)
        cy.get('#email')
          .clear()
          .type(updatedCustomer.email)
        cy.get('#federalTaxNumber')
          .clear()
          .type(updatedCustomer.cpf)
        cy.get('#birthday')
          .clear()
          .type(updatedCustomer.birthday)
        cy.get('#receiveOffers').check()
        cy.root().submit()
      })
    })

    cy.get('#snackbar-content', { timeout: 10000 }).should(
      'have.css',
      'background-color',
      'rgb(67, 160, 71)'
    )
    cy.get('#snackbar-message').contains('Cliente atualizado')
  })
})
