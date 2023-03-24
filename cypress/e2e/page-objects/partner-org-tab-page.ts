export class PartnerOrgTabPage {
  partnerAndOrgTab() {
    return cy.get('#simple-tab-partners-and-orgs', { timeout: 30000 });
  }

  partnerAndOrgTabAddOrganisation() {
    return cy.get('#add-organisation-button', { timeout: 50000 });
  }

  partnerAndOrgTabEnterOrgIdTextbox() {
    return cy.get('#org-id-field');
  }

  partnerAndOrgTabEnterOrgNameTextbox() {
    return cy.get('#org-name-field');
  }

  partnerAndOrgTabOrgDeleteButton() {
    return cy.get('[data-testid="DeleteIcon"]');
  }

  partnerAndOrgTabOrgNameEditButton() {
    return cy.get('[data-testid="EditIcon"]');
  }

  partnerAndOrgTabUpdateOrgNameDialog() {
    return cy.get('[aria-describedby="edit-context-dialog-description"]');
  }

  partnerAndOrgTabUpdateOrgDialogTitle() {
    return cy.get('#edit-context-dialog-title');
  }

  partnerAndOrgTabUpdateOrgNameLabel() {
    return cy.get('#edit-context-name-label');
  }

  partnerAndOrgTabUpdateOrgNameUpdateButton() {
    return cy.get('#edit-org-confirm-button');
  }

  partnerAndOrgTabUpdateOrgNameTextbox() {
    return cy.get('#edit-context-name-field');
  }

  partnerOrgTabUpdateOrgNameLabel() {
    return cy.get('#edit-context-dialog-form > div > label');
  }

  partnerOrgUpdateOrgNameUpdateButton() {
    return cy.get('#edit-org-confirm-button');
  }

  partnerAndOrgTabOrgDialogDeleteButton() {
    return cy.get('#delete-org-confirm-button');
  }

  partnerAndOrgTabDeleteTextBox() {
    return cy.get('#confirm-delete-org-field');
  }

  partnerAndOrgTabAddOrgCancelButton() {
    return cy.get('#create-org-close-button');
  }

  partnerAndOrgTabAddOrgSaveButton() {
    return cy.get('#create-org-confirm-button', { timeout: 50000 });
  }

  partnerAndOrgTabOrganisationList() {
    return cy.get('table > tbody > tr > td', { timeout: 50000 });
  }

  partnerAndOrgTabPagination() {
    return cy.get('#organisations-list-pagination-rows-per-page-select');
  }

  partnerAndOrgTabPaginationList() {
    return cy.get('ul > li');
  }
}
