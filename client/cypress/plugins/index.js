/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { GoogleSocialLogin } = require('cypress-social-logins').plugins
const MongoClient = require('mongodb').MongoClient

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  on('task', {
    findUser: (conditions) => {
      return new Promise((resolve, reject) => {
        MongoClient.connect(
          'mongodb://localhost:27017',
          { useUnifiedTopology: true },
          (error, client) => {
            if (error) {
              reject(error)
            } else {
              const db = client.db('mee')
              db.collection('users').findOne(conditions, function(error, doc) {
                if (error) reject(error)
                client.close()
                resolve(doc)
              })
            }
          }
        )
      })
    },

    GoogleSocialLogin: GoogleSocialLogin
  })
}
