context('Signup with Google', () => {
  beforeEach(() => {
    cy.exec('cd ../api && yarn run mongo:reset')
    cy.clearLocalStorage()
    cy.visit('/googleSignin')
  })

  it.skip('navigates to /sales on successful signup with Google', () => {
    cy.server({ method: 'POST', status: 200 })

    cy.route('/graphql').as('signin')

    const socialLoginOptions = {
      username: Cypress.env('GOOGLE_USERNAME'),
      password: Cypress.env('GOOGLE_PASSWORD'),
      loginUrl: Cypress.env('GOOGLE_LOGIN_BUTTON_URL'),
      loginSelector: '#google-signin',
      headless: false,
      logs: false,
      isPopup: true,
      popupDelay: 2000
    }

    cy.task('GoogleSocialLogin', socialLoginOptions).then(({ cookies }) => {
      cy.clearCookies()

      const cookieName = Cypress.env('cookieName')
      const cookie = cookies.filter((cookie) => cookie.name === cookieName).pop()

      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure
        })

        Cypress.Cookies.defaults({ preserve: cookieName })
      }
    })

    cy.wait('@signin').should((xhr) => {
      expect(xhr.request.body.operationName).to.equal('signin')
      expect(xhr.status).to.equal(200)
    })

    cy.location('pathname').should('eq', '/sales')
  })
})
