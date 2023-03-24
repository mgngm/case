import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { HeaderBar } from '../page-objects/header-bar';
import { LoginPage } from '../page-objects/login-page';
const headerBar = new HeaderBar();
const loginPage = new LoginPage();

Given('{string} wants to log in to Tesseract', () => {
  cy.visit('/login');
});

When('{string} attempts to access Tesseract without logging in', () => {
  cy.visit('/');
});

Then('{string} is redirected to the login page', () => {
  cy.url().should('include', '/login');
});

When('{string} attempts to log in with valid SSO credentials', () => {
  if (Cypress.env('TEST_SSO_USER')) {
    cy.ssoLogin(Cypress.env('TEST_SSO_USER'));
  } else {
    throw new Error('Test user not set in environment');
  }
});

When('{string} attempts to log in with valid non-SSO credentials', () => {
  if (Cypress.env('TEST_USER_PARTNER') && Cypress.env('TEST_PASS_PARTNER')) {
    cy.login(Cypress.env('TEST_USER_PARTNER'), Cypress.env('TEST_PASS_PARTNER'));
  } else {
    throw new Error('Test user and password not set in environment');
  }
});

Then('{string} is able to log in successfully', () => {
  headerBar.header().should('be.visible');
  loginPage.defaultLandingPageTab().should('have.text', 'Business Impact');
});

Given('{string} attempts to log in with valid non-SSO id', () => {
  loginPage.emailField().type(Cypress.env('TEST_USER_PARTNER'));
  loginPage.emailLoginButton().contains('Login').click();
});

When('{string} tries to go back from password page to login page', () => {
  loginPage.loginBackButton().contains('button', 'Back').click();
});

When('{string} tries to reset password', () => {
  loginPage.emailField().type(Cypress.env('TEST_USER_PARTNER'));
  loginPage.resetPasswordLink().click();
  loginPage.enterEmailMessage().contains('Please enter your email address to reset your password');
  loginPage.resetPasswordSubmitButton().contains('Reset Password').click();
});

Then('{string} is redirected to the Reset password page', () => {
  loginPage
    .passwordSentText()
    .should('exist')
    .and(
      'have.text',
      'Your password has been set to reset, you should have received an email containing your verification code. Please enter your email and verification code to continue: '
    );
  loginPage.resetPasswordEmailLabel().contains('label', 'Email').should('be.exist');
  loginPage.forgotPasswordEmail().should('be.enabled');
  loginPage.resetVerificationCodeLabel().contains('label', 'Verification Code:');
  loginPage.resetVerificationCodeTextbox().should('exist').and('be.enabled');
  loginPage.resetNewPasswordLabel().contains('label', 'New Password:');
  loginPage.resetNewPasswordTextbox().should('exist').and('be.enabled');
  loginPage.resetConfirmNewPasswordLabel().contains('label', 'Confirm New Password:');
  loginPage.resetConfirmNewPasswordTextbox().should('exist').and('be.enabled');
  loginPage.resetSubmitButton().should('exist').and('be.enabled');
  loginPage.resetSubmitButton().should('have.text', 'Submit');
  loginPage.resetPasswordBackButton().contains('button', 'Back').should('exist').and('be.enabled');
});

Then('{string} is informed that a password reset email has been sent', () => {
  loginPage
    .passwordSentText()
    .should('exist')
    .and(
      'have.text',
      'Your password has been set to reset, you should have received an email containing your verification code. Please enter your email and verification code to continue: '
    );
});

When('{string} tries to reset password from the here link', () => {
  loginPage.resetPasswordLink().click();
  loginPage.forgotPasswordEmail().type(Cypress.env('TEST_USER_PARTNER'));
  loginPage.clickHereText().contains('span', 'Click here if you have already received a code');
  loginPage.hereLink().click();
});

When('{string} go back from reset password page when navigated from the the {string}', (name: string, link: string) => {
  if (link === 'here') {
    loginPage.emailField().type(Cypress.env('TEST_USER_PARTNER'));
    loginPage.resetPasswordLink().click();
    loginPage.hereLink().click();
    loginPage.resetPasswordBackButton().contains('button', 'Back').should('exist').and('be.enabled');
    loginPage.resetPasswordBackButton().contains('button', 'Back').click();
  }
  if (link === 'reset password button') {
    loginPage.resetPasswordLink().click();
    loginPage.forgotPasswordEmail().type(Cypress.env('TEST_USER_PARTNER'));
    loginPage.resetPasswordSubmitButton().contains('Reset Password').click();
    loginPage.resetSubmitButton().should('have.text', 'Submit', { timeout: 20000 });
    loginPage.resetPasswordBackButton().contains('button', 'Back').should('exist').and('be.enabled');
    loginPage.resetPasswordBackButton().contains('button', 'Back').click();
  }
});

When('{string} tries to reset password without entering email id', () => {
  loginPage.resetPasswordLink().click();
  loginPage.resetPasswordSubmitButton().contains('Reset Password').click();
});
Then('{string} is not allowed to reset password without email id', () => {
  loginPage
    .emailError()
    .should('have.text', 'Email not found. Please contact your system administrator or try again later.');
});

When('{string} navigates to the footer links {string}', (name: string, links: string) => {
  if (links === 'User Interface Terms of Use') {
    loginPage.userInterfaceTermsofUseLink().should('exist').should('have.text', 'User Interface Terms of Use');
    loginPage.userInterfaceTermsofUseLink().should('have.text', 'User Interface Terms of Use').click();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; // returning false here prevents Cypress from // failing the test
    });
  }

  if (links === 'Privacy Notice') {
    loginPage.privacyNoticeLink().should('exist').should('have.text', 'Privacy Notice');
    loginPage.privacyNoticeLink().should('have.text', 'Privacy Notice').click();

    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; // returning false here prevents Cypress from // failing the test
    });
  }

  if (links === 'explained here') {
    loginPage.explainedHereLink().should('exist').should('have.text', 'explained here');
    loginPage.explainedHereLink().should('have.text', 'explained here').click();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; // returning false here prevents Cypress from // failing the test
    });
  }
});

Then('{string} is redirected to the {string} page', (name: string, links: string) => {
  if (links === 'User Interface Terms of Use') {
    cy.origin('https://actual-experience.com', () => {
      cy.visit('/resources/ui-terms-of-use');
      cy.url().should('include', 'https://actual-experience.com/resources/ui-terms-of-use');
      cy.get('.h1').contains('Terms and Conditions');
    });
  }
  if (links === 'Privacy Notice') {
    cy.origin('https://actual-experience.com', () => {
      cy.visit('/resources/privacy');
      cy.url().should('include', 'https://actual-experience.com/resources/privacy');
      cy.get('.h1').contains('Privacy Notice');
    });
  }
  if (links === 'explained here') {
    cy.origin('https://actual-experience.com', () => {
      cy.visit('/resources/cookies');
      cy.url().should('include', 'https://actual-experience.com/resources/cookies');
      cy.get('.h1').contains('Cookies');
    });
  }
});
