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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

export {};

import { LoginPage } from '../e2e/page-objects/login-page';

const loginPage = new LoginPage();

Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  loginPage.emailField().type(username);
  loginPage.emailLoginButton().click();
  loginPage.passwordField().type(password);
  loginPage.passwordLoginButton().click();
});

Cypress.Commands.add('ssoLogin', (username) => {
  cy.visit('/login');
  loginPage.emailField().type(username);
  loginPage.emailLoginButton().click();
  //cy.origin('tesseract74mo7u6u13ostdr72dhmoc6dv6-develop.auth.eu-west-1.amazoncognito.com', () => {});
});
