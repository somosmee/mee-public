import { PaymentMethods } from '../../fixtures/utils/enums'

context('Create order', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.fixture('users/user.json').then((user) => cy.signup(user.email))
    cy.fixture('products/products.json').then((products) => cy.createProducts(products))
    cy.fixture('orders/order.json').as('order')
    cy.visit('/sales')
  })

  it('opens create order dialog', () => {
    cy.get('#create-order').click({ force: true })
    cy.get('#dialog-appbar').contains('Crie seu pedido')
  })

  it('seeks items', () => {
    cy.get('#create-order').click({ force: true })
    cy.get('@order').then((order) => {
      for (const item of order.items) {
        cy.searchItem(item.name)
        cy.get('#search').clear()
      }
    })
  })

  it('selects an item from search result', () => {
    cy.get('#create-order').click({ force: true })
    cy.get('@order').then((order) => {
      for (const item of order.items) {
        cy.searchItem(item.name).click()
      }
    })
  })

  it('creates a simple order', () => {
    cy.get('#create-order').click({ force: true })

    cy.get('@order').then((order) => {
      cy.createOrder(order)
      cy.checkOrder(order)
    })
  })

  it('creates an order for a customer', () => {
    cy.get('#create-order').click({ force: true })
    cy.get('@order').then((order) => cy.createOrder(order))

    cy.getOrderHeader('#customer').should('have.css', 'color', 'rgba(0, 0, 0, 0.54)')
    cy.getOrderHeader('#customer').click()

    cy.get('@order').then((order) => {
      cy.get('#dialog-appbar').contains('Qual o telefone do cliente?')
      cy.get('#add-customer').click()
      cy.createCustomer(order.customer)

      cy.get('#dialog-appbar').contains('Confirme os dados')
      cy.contains(`${order.customer.firstName} ${order.customer.lastName}`)
      cy.contains(order.customer.mobile)

      cy.get('#save').click()

      cy.checkOrder(order, { customer: true })
    })
  })

  it('creates an order for delivery', () => {
    cy.get('#create-order').click({ force: true })
    cy.get('@order').then((order) => cy.createOrder(order))

    cy.getOrderHeader('#delivery').should('have.css', 'color', 'rgba(0, 0, 0, 0.54)')
    cy.getOrderHeader('#delivery').click()

    cy.get('@order').then((order) => {
      cy.get('#dialog-appbar').contains('Qual o telefone do cliente?')
      cy.get('#add-customer').click()
      cy.createCustomer(order.customer)

      cy.get('#dialog-appbar').contains('Qual o endereço de entrega?')
      cy.get('#add-address').click()
      cy.upsertAddress(order.customer.address)

      cy.get('#dialog-appbar').contains('Como você prefere pagar?')
      cy.contains(PaymentMethods[order.payment.method].label).click()

      cy.get('#dialog-appbar').contains('Taxa de entrega')
      cy.get('form').within(() => {
        cy.focused().type(`${order.delivery.fee},00`)
        cy.root().submit()
      })

      cy.get('#dialog-appbar').contains('Confirme os dados')
      cy.contains(`${order.customer.firstName} ${order.customer.lastName}`)
      cy.contains(order.customer.mobile)

      cy.contains(`${order.customer.address.street}, ${order.customer.address.number}`)
      cy.contains(
        `${order.customer.address.complement}, ${order.customer.address.district} - ${order.customer.address.city}, ${order.customer.address.state} - CEP ${order.customer.address.postalCode}`
      )

      cy.contains(PaymentMethods[order.payment.method].label)
      cy.contains('À vista')

      cy.contains(`R$ ${order.delivery.fee},00`)
      cy.contains('Taxa de entrega')

      cy.get('#save').click()

      cy.get('#snackbar-content', { timeout: 10000 }).should(
        'have.css',
        'background-color',
        'rgb(67, 160, 71)'
      )
      cy.get('#snackbar-message').contains('Pedido atualizado')

      cy.checkOrder(order, { delivery: true, item: true })
    })
  })
})
