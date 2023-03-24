export class ReportPickerDialogPage {
  barChartIconReportPickerButton() {
    return cy.get('#open-data-switcher');
  }

  reportPickerDialog() {
    return cy.get('#report-picker-dialog');
  }

  reportPickerCurrentlyReportName() {
    return cy.get('#currently-selected-report');
  }

  reportPickerSelectRadioButtonOfReport() {
    return cy.get('.MuiListItemButton-root');
  }

  reportPickerCurrentSelectedReportLabel() {
    return cy.get('#currently-selected-label');
  }

  reportPickerSwitchContextTab() {
    return cy.get('#simple-tab-switch-context');
  }

  reportPickerReportSection() {
    return cy.get('.header_reportPickerWrapper__1ASX7');
  }

  reportPickerReportsByDateLabel() {
    return cy.get('.header_subsectionHeader__adr14');
  }

  reportPickerReportsByDateYearSelectDropdown() {
    return cy.get('#report-select-year-dropdown');
  }

  reportPickerYearList() {
    return cy.get('[aria-labelledby="year-select-label"]');
  }

  reportPickerMonthList() {
    return cy.get('[aria-labelledby="month-select-label"]');
  }

  reportPickerReportsByDateYearSelectLabel() {
    return cy.get('#year-label');
  }

  reportPickerReportsByMonthLabel() {
    return cy.get('#month-label');
  }

  reportPickerReportsByMonthSelectDropdown() {
    return cy.get('#report-select-month-dropdown');
  }

  reportPickerNoReportsAvailableMessage() {
    return cy.get('.header_reportListEmpty__gLvkh > span');
  }

  reportPickerCancelButton() {
    return cy.get('#report-picker-close-button');
  }

  selectContextReportPickerTab() {
    return cy.get('#report-select-context-dropdown', { timeout: 40000 });
  }

  reportPickerContextList() {
    return cy.get('.context_contextItem__AgU9H');
  }

  reportPickerReportList() {
    return cy.get('ul > li');
  }
}
