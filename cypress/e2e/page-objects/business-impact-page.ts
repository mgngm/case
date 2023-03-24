export class BusinessImpactPage {
  businessImpactReportsTitle() {
    return cy.get('#report-title-display', { timeout: 30000 });
  }
}
