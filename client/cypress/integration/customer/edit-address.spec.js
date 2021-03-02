context('Edit customer address', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/user.json').then((user) => cy.signup(user.email))
    cy.fixture('customers/customerWithAddress.json').then((customer) =>
      cy.createCustomers([customer])
    )
    cy.fixture('addresses/address.json').as('address')
    cy.fixture('addresses/updated.json').as('updatedAddress')
    cy.visit('/customers')
  })

  it('opens edit customer dialog', () => {
    cy.get('tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('#dialog-appbar').contains('Edite um cliente')
  })

  it('opens manage addresses', () => {
    cy.get('tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('#manage-addresses').click()

    cy.get('#dialog-appbar').contains('Gerencie os endereços')
  })

  it('edits customer address', () => {
    cy.get('tbody > tr ', { timeout: 10000 })
      .first()
      .find('#edit')
      .click()

    cy.get('#manage-addresses').click()

    cy.get('#addresses > div > div ', { timeout: 10000 })
      .first()
      .find('#edit-address')
      .click()

    cy.get('@updatedAddress').then((updatedAddress) => {
      cy.get('form').within(() => {
        cy.get('#number')
          .clear()
          .type(updatedAddress.number)
        cy.get('#complement')
          .clear()
          .type(updatedAddress.complement)
        cy.root().submit()
      })
    })

    cy.get('#snackbar-content', { timeout: 10000 }).should(
      'have.css',
      'background-color',
      'rgb(67, 160, 71)'
    )
    cy.get('#snackbar-message').contains('Endereço atualizado')

    cy.get('@address').then((address) => {
      cy.get('@updatedAddress').then((updatedAddress) => {
        cy.get('#addresses > div > li ')
          .first()
          .within(() => {
            cy.contains(address.street)
            cy.contains(updatedAddress.number)
            cy.contains(updatedAddress.complement)
            cy.contains(address.district)
            cy.contains(address.city)
            cy.contains(address.state)
            cy.contains(address.postalCode)
          })
      })
    })
  })
})
