export class ImprovementsPage {
  improvementsPageReportTitle() {
    return cy.get('#improvements-report-name', { timeout: 30000 });
  }
}
