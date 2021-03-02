context('List customer', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/user.json').then((user) => cy.signup(user.email))
    cy.fixture('customers/customers.json').then((customers) => cy.createCustomers(customers))
    cy.fixture('customers/customers.json').as('customers')
    cy.visit('/customers')
  })

  it('changes to next page ', () => {
    cy.get('#customers > tbody > tr').should('have.length', 10)

    cy.get('#next-page').click()
    cy.url().should('contain', '?page=1&offset=10')

    cy.get('#customers > tbody > tr').should('have.length', 1)
  })

  it('changes to next page ', () => {
    cy.get('#next-page').click()
    cy.url().should('contain', '?page=1&offset=10')

    cy.get('#customers > tbody > tr').should('have.length', 1)

    cy.get('#previous-page').click()
    cy.url().should('contain', '?page=0&offset=10')

    cy.get('#customers > tbody > tr').should('have.length', 10)
  })
})
