// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { CREATE_CUSTOMER } from '../fixtures/queries/customer'
import { CREATE_PRODUCT } from '../fixtures/queries/product'
import { SEND_PIN, SIGNIN } from '../fixtures/queries/user'
import { PaymentMethods } from '../fixtures/utils/enums'

// https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window-fetch
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
//   const opts = Object.assign({}, options, {
//     onBeforeLoad(win, ...args) {
//       cy.spy(win, 'fetch')
//       if (options?.onBeforeLoad) return options.onBeforeLoad(window, ...args)
//     }
//   })
//   return originalFn(url, opts)
// })

Cypress.Commands.add('sendPin', (email) => {
  const options = {
    method: 'POST',
    url: 'http://localhost:4000/graphql',
    body: {
      query: SEND_PIN,
      variables: { input: { email } }
    }
  }

  cy.request(options)
    .its('body')
    .then((body) => {
      expect(body.errors).not.to.exist
      expect(body.data.sendPin).to.exist
      return body.data.sendPin
    })
})

Cypress.Commands.add('signup', (email) => {
  cy.sendPin(email).then(() => {
    cy.task('findUser', { email }).then(({ pin }) => {
      const options = {
        method: 'POST',
        url: 'http://localhost:4000/graphql',
        body: {
          query: SIGNIN,
          variables: { input: { email, pin } }
        }
      }

      cy.request(options)
        .its('body')
        .then((body) => {
          expect(body.errors).not.to.exist
          expect(body.data.signin).to.exist
          expect(body.data.signin.signup).to.be.true
          localStorage.setItem('token', JSON.stringify(body.data.signin.token))
          return body.data.signin
        })
    })
  })
})

Cypress.Commands.add('signin', (email) => {
  cy.sendPin(email).then(() => {
    cy.task('findUser', { email }).then(({ pin }) => {
      const options = {
        method: 'POST',
        url: 'http://localhost:4000/graphql',
        body: {
          query: SIGNIN,
          variables: { input: { email, pin } }
        }
      }

      cy.request(options)
        .its('body')
        .then((body) => {
          expect(body.errors).not.to.exist
          expect(body.data.signin).to.exist
          expect(body.data.signin.signup).to.be.false
          localStorage.setItem('token', JSON.stringify(body.data.signin.token))
          return body.data.signin
        })
    })
  })
})

Cypress.Commands.add('createProducts', (products) => {
  for (const product of products) {
    const options = {
      method: 'POST',
      url: 'http://localhost:4000/graphql',
      body: {
        query: CREATE_PRODUCT,
        variables: { input: product }
      },
      auth: {
        bearer: JSON.parse(localStorage.getItem('token'))
      }
    }

    cy.request(options)
      .its('body')
      .then((body) => {
        expect(body.errors).not.to.exist
        expect(body.data.createProduct).to.exist
        return body.data.createProduct
      })
  }
})

Cypress.Commands.add('createCustomers', (customers) => {
  for (const customer of customers) {
    const options = {
      method: 'POST',
      url: 'http://localhost:4000/graphql',
      body: {
        query: CREATE_CUSTOMER,
        variables: { input: customer }
      },
      auth: {
        bearer: JSON.parse(localStorage.getItem('token'))
      }
    }

    cy.request(options)
      .its('body')
      .then((body) => {
        expect(body.errors).not.to.exist
        expect(body.data.createCustomer).to.exist
        return body.data.createCustomer
      })
  }
})

Cypress.Commands.add('getOrderHeader', (selector) => {
  return selector
    ? cy
      .get('#orders > div > div > #header')
      .first()
      .find(selector)
    : cy.get('#orders > div > div > #header')
})

Cypress.Commands.add('getOrderContent', (selector, options) => {
  return selector
    ? cy
      .get('#orders > div > div > #content > div > div', options)
      .first()
      .find(selector)
    : cy.get('#orders > div > div > #content > div > div', options)
})

Cypress.Commands.add('searchItem', (name) => {
  const [firstName] = name.split(' ')

  cy.get('#search').type(firstName)
  return cy.get('#search-results').contains(name, { timeout: 5000, matchCase: true })
})

Cypress.Commands.add('createOrder', (order) => {
  for (const item of order.items) {
    cy.searchItem(item.name).click()
  }

  cy.get('#create').click()

  cy.get('#snackbar-content', { timeout: 10000 }).should(
    'have.css',
    'background-color',
    'rgb(67, 160, 71)'
  )
  cy.get('#snackbar-message').contains('Pedido adicionado')
})

Cypress.Commands.add(
  'checkOrder',
  (order, { item = false, customer = false, delivery = false } = {}) => {
    if (customer) {
      cy.getOrderHeader('#customer').should('have.css', 'color', 'rgb(96, 40, 196)')
    }

    if (delivery) {
      cy.getOrderHeader('#customer').should('have.css', 'color', 'rgb(96, 40, 196)')
      cy.getOrderHeader('#delivery').should('have.css', 'color', 'rgb(96, 40, 196)')
    }

    cy.getOrderContent(null, { timeout: 10000 }).within(() => {
      cy.contains('ID')

      cy.contains('Status')
      cy.contains('Aberto')

      if (customer || delivery) {
        cy.contains('Cliente')
        cy.contains(
          `${order.customer.firstName} ${order.customer.lastName} - ${order.customer.mobile}`
        )
      }

      if (delivery) {
        cy.contains('Entrega')
        cy.contains('Para entrega (delivery)')

        cy.contains('Pagamentos')
        cy.get('div #payments')
          .find('svg')
          .should('have.attr', 'title', PaymentMethods[order.payment.method].label)

        cy.contains('Endereço')
        cy.contains(`${order.customer.address.street}, ${order.customer.address.number}`)

        cy.contains('Taxa de entrega')
        cy.contains(`R$ ${order.delivery.fee},00`)
      }

      const subtotal = order.items.reduce((subtotal, item) => subtotal + item.subtotal, 0)
      cy.contains(
        'h6',
        `R$ ${subtotal
          .toFixed(2)
          .toString()
          .replace('.', ',')}`
      )

      let total = subtotal
      if (delivery) total = total + order.delivery.fee

      cy.contains(
        'h5',
        `R$ ${total
          .toFixed(2)
          .toString()
          .replace('.', ',')}`
      )
    })

    if (item) {
      cy.get('#orders > div > div')
        .first()
        .get('#expand-more')
        .click()

      cy.get('#orders > div > div')
        .first()
        .get('#items > div')
        .within(() => {
          for (const item of order.items) {
            cy.contains(item.name)
            cy.contains(`1x R$ ${item.price.toString().replace('.', ',')}`)
          }
        })
    }
  }
)

Cypress.Commands.add('createCustomer', (customer) => {
  cy.get('form').within(() => {
    cy.get('#mobile').type(customer.mobile)
    cy.get('#firstName').type(customer.firstName)
    cy.get('#lastName').type(customer.lastName)
    customer.email && cy.get('#email').type(customer.email)
    customer.cpf && cy.get('#federalTaxNumber').type(customer.cpf)
    customer.birthday && cy.get('#birthday').type(customer.birthday)
    cy.get('#receiveOffers').check()
    cy.root().submit()
  })

  cy.get('#snackbar-content', { timeout: 10000 }).should(
    'have.css',
    'background-color',
    'rgb(67, 160, 71)'
  )
  cy.get('#snackbar-message').contains('Cliente adicionado')
})

Cypress.Commands.add('upsertAddress', (address, mode = 'create') => {
  let snackbarMessage

  if (mode === 'create') {
    cy.get('form').within(() => {
      cy.get('#postalCode').type(address.postalCode)
      cy.focused({ timeout: 3000 }).should('have.attr', 'id', 'number')
      'number' in address && cy.focused().type(address.number)
      'complement' in address && cy.get('#complement').type(address.complement)
      cy.root().submit()
    })

    snackbarMessage = 'Endereço adicionado'
  } else if (mode === 'edit') {
    cy.get('form').within(() => {
      'number' in address &&
        cy
          .get('#number')
          .clar()
          .type(address.number)
      'complement' in address &&
        cy
          .get('#complement')
          .clear()
          .type(address.complement)
      cy.root().submit()
    })

    snackbarMessage = 'Endereço atualizado'
  }

  cy.get('#snackbar-content', { timeout: 10000 }).should(
    'have.css',
    'background-color',
    'rgb(67, 160, 71)'
  )

  cy.get('#snackbar-message').contains(snackbarMessage)
})
