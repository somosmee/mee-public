context('Create customer', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/user.json').then((user) => cy.signup(user.email))
    cy.fixture('customers/customer.json').as('customer')
    cy.fixture('customers/customerWithFullInformation.json').as('customerWithFullInformation')
    cy.visit('/customers')
  })

  it('opens create customer dialog', () => {
    cy.get('#create-customer').click({ force: true })
    cy.get('#dialog-appbar').contains('Adicione um cliente')
  })

  it('creates a customer', () => {
    cy.get('#create-customer').click({ force: true })

    cy.get('@customer').then((customer) => {
      cy.get('form').within(() => {
        cy.get('#mobile').type(customer.mobile)
        cy.get('#firstName').type(customer.firstName)
        cy.get('#lastName').type(customer.lastName)
        cy.root().submit()
      })
    })

    cy.get('#snackbar-content', { timeout: 10000 }).should(
      'have.css',
      'background-color',
      'rgb(67, 160, 71)'
    )
    cy.get('#snackbar-message').contains('Cliente adicionado')
  })

  it('creates a customer with complete info', () => {
    cy.get('#create-customer').click({ force: true })

    cy.get('@customerWithFullInformation').then((customerWithFullInformation) => {
      cy.get('form').within(() => {
        cy.get('#mobile').type(customerWithFullInformation.mobile)
        cy.get('#firstName').type(customerWithFullInformation.firstName)
        cy.get('#lastName').type(customerWithFullInformation.lastName)
        cy.get('#email').type(customerWithFullInformation.email)
        cy.get('#federalTaxNumber').type(customerWithFullInformation.cpf)
        cy.get('#birthday').type(customerWithFullInformation.birthday)
        cy.get('#receiveOffers').check()
        cy.root().submit()
      })
    })

    cy.get('#snackbar-content', { timeout: 10000 }).should(
      'have.css',
      'background-color',
      'rgb(67, 160, 71)'
    )
    cy.get('#snackbar-message').contains('Cliente adicionado')
  })
})
