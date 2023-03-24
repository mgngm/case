export class ProjectTemplatesPage {
  projectTemplatesTabContextDropdown() {
    return cy.get('#org-select');
  }

  selectContextProjectTemplatesTab() {
    return cy.get('.context_contextItem__AgU9H');
  }

  projectTemplatesTab() {
    return cy.get('#simple-tab-project-templates', { timeout: 50000 });
  }

  projectTemplatesHeading() {
    return cy.get('h2');
  }

  projectTemplateProjectListTableNameHeading() {
    return cy.get('#project-template-name-heading');
  }

  projectTemplateProjectListTableProjectIDHeading() {
    return cy.get('#actions-heading');
  }

  projectTemplateProjectListTableActionsHeading() {
    return cy.get('#admin-heading');
  }

  addProjectTemplateCreateButton() {
    return cy.get('#create-project-template-button');
  }

  projectTemplatesEmptyProjectList() {
    return cy.get('#project-templates-list-empty');
  }

  projectTemplateProjectListTable() {
    return cy.get('table', { timeout: 30000 });
  }

  projectTemplatesProjectEditButton() {
    return cy.get('[data-testid="EditIcon"]');
  }

  projectTemplatesProjectDeleteButton() {
    return cy.get('[data-testid="DeleteIcon"]');
  }

  projectTemplateDialogDeleteTemplateButton() {
    return cy.get('.MuiButton-containedError');
  }

  projectTemplateListRefreshIcon() {
    return cy.get('[data-testid="RefreshIcon"]');
  }

  projectTemplateDialogTitle() {
    return cy.get('#project-dialog-title');
  }

  projectTemplateLabels() {
    return cy.get('.project-template-dialog_formRow__aBxQl > label');
  }

  projectTemplateNameLabel() {
    return cy.get('label[for="name"]');
  }

  projectTemplateNameTextbox() {
    return cy.get('#name-field');
  }

  projectTemplateTemplateIDLabel() {
    return cy.get('.project-template-dialog_formRow__aBxQl > label');
  }

  projectTemplateID() {
    return cy.get('#templateId-field');
  }

  projectTemplateStatusLabel() {
    return cy.get('.project-template-dialog_formRow__aBxQl > label');
  }

  projectTemplateStatusDropdown() {
    return cy.get('#status-select');
  }

  projectTemplateStatusDropdownList() {
    return cy.get('[aria-labelledby="status-select-label"]');
  }

  projectTemplateTypeLabel() {
    return cy.get('.project-template-dialog_formRow__aBxQl > label');
  }

  projectTemplateTypeDropdownSelected() {
    return cy.get('#type-select');
  }

  projectTemplateTypeDropdownList() {
    return cy.get('[aria-labelledby="type-select-label"]');
  }

  projectTemplateBodyLabel() {
    return cy.get('.project-template-dialog_formRow__aBxQl > label');
  }

  projectTemplateBodyTextbox() {
    return cy.get('#body-field');
  }

  projectTemplateIDUniqueError() {
    return cy.get('#project-mapping-warning');
  }

  projectTemplateEmptyKeyMetrices() {
    return cy.get('.project-template-dialog_metricListEmpty__zvwIe');
  }

  projectTemplateAddKeyMetricesButton() {
    return cy.get('#create-project-template-add-key-metric-button');
  }

  projectTemplatesFirstKeyMetricesTextBox() {
    return cy.get('#metric-text-0');
  }

  projectTemplatesSecondKeyMetricesTextBox() {
    return cy.get('#metric-text-1');
  }

  projectTemplatesThirdKeyMetricesTextBox() {
    return cy.get('metric-text-2');
  }

  projectTemplateAddKeyMetricesMetricLabel() {
    return cy.get('.project-template-dialog_keyMetricInput__hMLtH > label');
  }

  projectTemplateAddKeyMetricesMetricTextBox() {
    return cy.get('.project-template-dialog_keyMetricText__pQ_tx');
  }

  projectTemplateAddKeyMetricesMetricConfirmButton() {
    return cy.get('.project-template-dialog_confirmEditIcon__fJwCe');
  }

  projectTemplateAddKeyMetricesMetricDeleteButton() {
    return cy.get('#create-project-template-remove-key-metric-button');
  }
  projectTemplateChartsTitle() {
    return cy.get('.project-template-dialog_metricTitle__bUM_x');
  }
  projectTemplateEmptyChartsMessage() {
    return cy.get('.project-template-dialog_metricListEmptyChart__8nYeQ');
  }

  projectTemplateAddChartsButton() {
    return cy.get('#create-project-template-add-chart-button');
  }

  projectTemplateAddChartsLabels() {
    return cy.get('.project-template-dialog_formRow__aBxQl >label');
  }

  projectTemplateAddChartsTitleTextbox() {
    return cy.get('#title');
  }

  projectTemplateAddChartsBodyTextbox() {
    return cy.get('#body-field');
  }

  projectTemplateAddChartsBodyImageChoosefileButton() {
    return cy.get('#chart-image-0-label');
  }

  projectTemplateAddChartsFirstTitleTextbox() {
    return cy.get('#chart-title-0');
  }

  projectTemplateAddChartsFirstBodyTextbox() {
    return cy.get('#body-field');
  }

  reportPreviewImprovementsPageKeyMetricBlock() {
    return cy.get('.details_detailBlock__jVsAs');
  }

  projectTemplateAddChartsSecondTitleTextbox() {
    return cy.get('#chart-title-1');
  }

  projectTemplateAddChartsSecondBodyTextbox() {
    return cy.get('#chart-title-1');
  }

  projectTemplateAddChartsSecondImageFileUpload() {
    return cy.get('#chart-image-1-label');
  }

  projectTemplateAddChartsThirdTitleTextbox() {
    return cy.get('#chart-title-2');
  }

  projectTemplateAddChartsThirdBodyTextbox() {
    return cy.get('#chart-title-2');
  }

  projectTemplateAddChartsThirdImageFileUpload() {
    return cy.get('#chart-image-2-label');
  }

  projectTemplateChartsDeleteButton() {
    return cy.get('[data-testid="RemoveCircleIcon"]');
  }

  projectTemplateCancelButton() {
    return cy.get('#create-project-template-close-button');
  }

  projectTemplateAddProjectTemplateSaveButton() {
    return cy.get('#create-project-template-submit-button', { timeout: 30000 });
  }

  projectTemplatesTabPagination() {
    return cy.get('#project-templates-list-rows-per-page-select', { timeout: 30000 });
  }

  projectTemplatesTabPaginationList() {
    return cy.get('ul > li');
  }
}
