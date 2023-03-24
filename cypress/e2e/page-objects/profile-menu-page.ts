export class ProfileMenuPage {
  profileMenuImprovementButton() {
    return cy.get('#improvements-route-nav-link', { timeout: 30000 });
  }

  profileIcon() {
    return cy.get('#open-nav-drawer', { timeout: 100000 });
  }

  profileMenuBusinessReports() {
    return cy.get('#home-route-nav-link', { timeout: 30000 });
  }

  profileMenuLogoutButton() {
    return cy.get('#logout-route-nav-link');
  }

  profileMenuAdmin() {
    return cy.get('#id-route-nav-link', { timeout: 30000 });
  }
}
