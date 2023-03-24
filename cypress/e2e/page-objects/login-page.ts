export class LoginPage {
  emailField() {
    return cy.get('input[name="email"]', { timeout: 30000 });
  }

  passwordField() {
    return cy.get('input[name="password"]', { timeout: 30000 });
  }

  forgotPasswordEmail() {
    return cy.get('input[name="forgotPasswordEmail"]');
  }

  emailLoginButton() {
    return cy.get('button[name="login"]', { timeout: 30000 });
  }

  resetPasswordSubmitButton() {
    return cy.get('button[name="Forgot Password"]');
  }

  resetPasswordText() {
    return cy.get('.Login_info__7LdhA');
  }

  passwordLoginButton() {
    return cy.get('[name="login"]', { timeout: 30000 });
  }

  defaultLandingPageTab() {
    return cy.get('.header_selected__KmnH7');
  }

  resetPasswordLink() {
    return cy.get('.Base_link__ExRI8');
  }

  enterEmailMessage() {
    return cy.get('.Login_loginForm__WVf1J > span');
  }

  clickHereText() {
    return cy.get('.Login_loginForm__WVf1J > span');
  }

  hereLink() {
    return cy.get('.Login_link___Hd0F');
  }

  loginBackButton() {
    return cy.get('#login-page-back-button');
  }

  passwordSentText() {
    return cy.get('p.Login_info__7LdhA');
  }

  resetPasswordEmailLabel() {
    return cy.get('#email-label');
  }

  resetVerificationCodeLabel() {
    return cy.get('#2fa-code-label');
  }

  resetVerificationCodeTextbox() {
    return cy.get('input[name="resetCode"]');
  }

  resetNewPasswordLabel() {
    return cy.get('#new-password-label');
  }

  resetNewPasswordTextbox() {
    return cy.get('input[name="resetPassword"]');
  }

  resetConfirmNewPasswordLabel() {
    return cy.get('#confirm-new-password-label');
  }

  resetConfirmNewPasswordTextbox() {
    return cy.get('input[name="resetPasswordConfirm"]');
  }

  resetSubmitButton() {
    return cy.get('button[name="Reset"]');
  }

  resetPasswordBackButton() {
    return cy.get('#login-page-back-button');
  }

  emailError() {
    return cy.get('.Login_loginFormError__1SSfg');
  }

  userInterfaceTermsofUseLink() {
    return cy.get('[href="https://actual-experience.com/resources/ui-terms-of-use/"]');
  }

  privacyNoticeLink() {
    return cy.get('[href="https://actual-experience.com/resources/privacy/"]');
  }

  explainedHereLink() {
    return cy.get('[href="https://actual-experience.com/resources/cookies/"]');
  }

  footerPageTitle() {
    return cy.get('h1.h1.internal-title');
  }
}
