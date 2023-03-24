// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in to Tesseract with email and password
       * @example cy.login('no-reply+tesseractdev@actual-experience.com', 'TempTestPa55word')
       */
      login(email: string, password: string): Chainable<Element>;
      ssoLogin(email: string): Chainable<Element>;
      getBySel(selector: string): Chainable<Element>;
    }
  }
}
