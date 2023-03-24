export class ReportTabPage {
  reportTab() {
    return cy.get('#simple-tab-report');
  }

  reportTabDUProcessingMessage() {
    return cy.get('.preview_parseState__7MqI6 > span', { timeout: 30000 });
  }

  reportTabSaveAndPublishButton() {
    return cy.get('#save-and-publish-button', { timeout: 100000 });
  }

  reportTabPublishButton() {
    return cy.get('#publish-button');
  }

  reportTabContextDropdown() {
    return cy.get('#org-select');
  }

  selectContextFromReportTab() {
    return cy.get('.context_contextItem__AgU9H');
  }

  reportTabReportListTable() {
    return cy.get('#report-list-table');
  }

  reportTabEmptyReportList() {
    return cy.get('#reports-list-empty');
  }

  reportTabReportsHeader() {
    return cy.get('#report-list-title');
  }

  reportTabPagination() {
    return cy.get('#reports-list-rows-per-page-select', { timeout: 30000 });
  }

  reportTabPaginationList() {
    return cy.get('ul > li');
  }

  reportTabUploadPersonaButton() {
    return cy.get('#persona-settings-upload-button');
  }

  reportTabUploadPersonaDialog() {
    return cy.get('[aria-labelledby="persona-settings-dialog-title"]');
  }

  reportTabPersonaFileUploadButton() {
    return cy.get('#upload-persona-settings-field-label', { timeout: 30000 });
  }

  reportTabPersonaUploadButton() {
    return cy.get('#upload-persona-settings-upload');
  }

  reportTabUploadPersonaSuccessMessage() {
    return cy.get('#upload-persona-settings-success', { timeout: 50000 });
  }

  reportTabUploadPersonaCloseButton() {
    return cy.get('#close-persona-settings');
  }

  reportTabSuccessPersonaSettingsUploaded() {
    return cy.get('.landing_personaSettingsInfo__DlScN');
  }

  reportTabCreateReportButton() {
    return cy.get('#create-report-button');
  }

  reportTabCreateReportDialogTitle() {
    return cy.get('#create-report-dialog-title', { timeout: 100000 });
  }

  reportTabCreateReportReportName() {
    return cy.get('#report-name');
  }

  reportTabInputCSVChooseFileCreateReportButton() {
    return cy.get('#reportCSV-label');
  }

  reportTabProjectCSVChooseFileCreateReportButton() {
    return cy.get('#projectCSV-label');
  }

  reportTabCreateReportUploadButton() {
    return cy.get('#create-report-upload-button');
  }

  reportTabReportPreviewPageTitle() {
    return cy.get('#admin-title', { timeout: 200000 });
  }

  reportTabAccessLevelHeading() {
    return cy.get('#admin-heading');
  }

  reportTabRefreshListButton() {
    return cy.get('#refresh-report-list-button');
  }

  reportTabAccessLevelDropdown() {
    return cy.get('#access-level-select');
  }

  reportTabAccessLevelDropdownListOptions() {
    return cy.get('.context_contextItem__AgU9H');
  }

  reportTabAccessLevelDropdownOptionRestricted() {
    return cy.get('#access-level-list-item-PARTNER');
  }

  reportTabAccessLevelDropdownOptionUnrestricted() {
    return cy.get('#access-level-list-item-ORGANISATION');
  }
}
