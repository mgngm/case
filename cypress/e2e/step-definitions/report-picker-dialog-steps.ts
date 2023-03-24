import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { ReportPickerDialogPage } from '../page-objects/report-picker-dialog-page';
import { nanoid } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { PartnerOrgTabPage } from '../page-objects/partner-org-tab-page';
import { ReportTabPage } from '../page-objects/report-tab-page';
import { ProfileMenuPage } from '../page-objects/profile-menu-page';
import { BusinessImpactPage } from '../page-objects/business-impact-page';
import { ImprovementsPage } from '../page-objects/improvements-page';
import { ProjectTemplatesPage } from '../page-objects/project-templates-page';

const today = new Date();
const formattedDate = format(today, 'yyyy/MM/dd');
const formattedCurrentMonth = format(today, 'M');
const formattedCurrentYear = format(today, 'yyyy');

const reportPickerDialogPage = new ReportPickerDialogPage();
const partnerOrgTabPage = new PartnerOrgTabPage();
const reportTabPage = new ReportTabPage();
const profileMenuPage = new ProfileMenuPage();
const businessImpactPage = new BusinessImpactPage();
const improvementsPage = new ImprovementsPage();
const projectTemplatesPage = new ProjectTemplatesPage();

const updatedOrg1 = nanoid(4) + '&' + 'TesseractOrgUpdate';
const newOrgId1 = nanoid(4);
const newOrgId2 = nanoid(4);
const newOrgName1 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgName2 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId3 = nanoid(4);
const newOrgName3 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId4 = nanoid(4);
const newOrgName4 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId5 = nanoid(4);
const newOrgName5 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId6 = nanoid(4);
const newOrgName6 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId7 = nanoid(4);
const newOrgName7 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId8 = nanoid(4);
const newOrgName8 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId9 = nanoid(6);
const newOrgName9 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId10 = nanoid(5);
const newOrgName10 = nanoid(3) + '-' + 'TessseractOrg';
const newOrgId11 = nanoid(5);
const newOrgName11 = nanoid(3) + '-' + 'TessseractOrg';

const reportName1 = '01Report1' + nanoid(6) + '-' + formattedDate;
const reportName2 = '1Report2' + nanoid(4) + '-' + formattedDate;
const reportName3 = '1Report3' + nanoid(2) + '-' + formattedDate;
const reportName4 = '1Report4' + nanoid(1) + '-' + formattedDate;
const reportName5 = '1Report5' + nanoid(3) + '-' + formattedDate;
const reportName6 = '1Report6' + nanoid(2) + '-' + formattedDate;
const reportName7 = '1Report7' + nanoid(2) + '-' + formattedDate;
const reportName8 = '1Report8' + nanoid(2) + '-' + formattedDate;
const reportName9 = '1Report9' + nanoid(2) + '-' + formattedDate;
const newProjectId1 = 1.1 + nanoid(4);
const newProjectName1 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const newProjectId2 = 1.1 + nanoid(4);
const newProjectName2 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const newProjectId3 = 1.1 + nanoid(4);
const newProjectName3 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const newProjectId4 = 1.1 + nanoid(4);
const newProjectName4 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const newProjectId5 = 1.1 + nanoid(4);
const newProjectName5 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const newProjectId6 = 1.1 + nanoid(4);
const newProjectName6 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const newProjectId7 = 1.1 + nanoid(4);
const newProjectName7 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const newProjectId8 = 1.1 + nanoid(4);
const newProjectName8 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const newProjectId9 = 1.1 + nanoid(4);
const newProjectName9 = 1.1 + nanoid(3) + '-' + 'RPProjects';
const personaCSVFile = 'cypress/fixtures/report-picker-persona-settings-file.json';

When('{string} clicks on the bar-chart picker icon on the header bar', () => {
  reportPickerDialogPage.barChartIconReportPickerButton().click();
});

Then('{string} sees the Report picker is displayed', () => {
  reportPickerDialogPage.reportPickerDialog().should('exist');
  reportPickerDialogPage.reportPickerCurrentSelectedReportLabel().should('have.text', 'Currently Selected Report');
  reportPickerDialogPage.reportPickerCurrentlyReportName().should('exist');
  reportPickerDialogPage.reportPickerSwitchContextTab().contains('Switch context').should('exist');
  reportPickerDialogPage.selectContextReportPickerTab().should('exist');
  reportPickerDialogPage.reportPickerReportSection().should('exist');
  reportPickerDialogPage.reportPickerReportsByDateLabel().contains('Reports by date').should('exist');
  reportPickerDialogPage.reportPickerReportsByDateYearSelectLabel().contains('Year:').should('exist');
  reportPickerDialogPage.reportPickerReportsByDateYearSelectDropdown().should('exist');
  reportPickerDialogPage.reportPickerReportsByMonthLabel().contains('Month:').should('exist');
  reportPickerDialogPage.reportPickerReportsByMonthSelectDropdown().should('exist');
  reportPickerDialogPage.reportPickerCancelButton().should('exist').and('be.enabled');
});

Given('{string} attempts to log in with Organisation level valid non-SSO credentials', () => {
  if (Cypress.env('TEST_USER_ORG') && Cypress.env('TEST_PASS_ORG')) {
    cy.login(Cypress.env('TEST_USER_ORG'), Cypress.env('TEST_PASS_ORG'));
  } else {
    throw new Error('Test user and password not set in environment');
  }
});

When('{string} opens the Report picker', () => {
  reportPickerDialogPage.barChartIconReportPickerButton().click();
  reportPickerDialogPage.reportPickerDialog().should('exist');
});

Then('Switch Context displays only the organisation assigned', () => {
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportPickerDialogPage.reportPickerContextList().should('have.length', 1);
});

Given('{string} attempts to log in with partner-level valid non-SSO credentials', () => {
  if (Cypress.env('TEST_USER_PARTNER') && Cypress.env('TEST_PASS_PARTNER')) {
    cy.login(Cypress.env('TEST_USER_PARTNER'), Cypress.env('TEST_PASS_PARTNER'));
  } else {
    throw new Error('Test user and password not set in environment');
  }
});

Given('{string} creates a new organisation', () => {
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuAdmin().contains('Admin').click();
  partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
  partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click();
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().should('exist');
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId1);
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().should('exist');
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName1);
  partnerOrgTabPage.partnerAndOrgTabAddOrgCancelButton().contains('Cancel').should('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().contains('Save').should('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().contains('Save').should('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName1, { timeout: 30000 }).should('exist');
});

Then('{string} sees the organisation in the Switch Context list', () => {
  reportPickerDialogPage.selectContextReportPickerTab().should('exist');
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportPickerDialogPage.reportPickerContextList().contains(newOrgName1, { timeout: 20000 }).should('exist');
});

Given('{string} updates the name of an organisation created', () => {
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuAdmin().contains('Admin').click();
  partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
  partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click();
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().should('exist');
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId11);
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().should('exist');
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName11);
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName11, { timeout: 30000 }).should('exist');
  cy.contains(newOrgName11)
    .parent('tr')
    .within(() => {
      // all searches are automatically rooted to the found tr element
      partnerOrgTabPage.partnerAndOrgTabOrgNameEditButton().click(); //clicking on the edit button of the organisation
    });
  partnerOrgTabPage.partnerAndOrgTabUpdateOrgNameDialog().should('exist');
  partnerOrgTabPage.partnerAndOrgTabUpdateOrgNameLabel().contains('Name').should('exist');
  partnerOrgTabPage.partnerAndOrgTabUpdateOrgNameTextbox().click().clear().type(updatedOrg1);
  partnerOrgTabPage.partnerAndOrgTabUpdateOrgNameUpdateButton().contains('Update').should('exist');
  partnerOrgTabPage.partnerAndOrgTabUpdateOrgNameUpdateButton().contains('Update').should('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabUpdateOrgNameUpdateButton().contains('Update').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', updatedOrg1, { timeout: 30000 }).should('exist');
});

Then('{string} sees the updated organisation name in the Switch Context list of Report Picker', () => {
  reportPickerDialogPage.selectContextReportPickerTab().should('exist');
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportPickerDialogPage.reportPickerContextList().contains(newOrgName11, { timeout: 20000 }).should('not.exist');
  reportPickerDialogPage.reportPickerContextList().contains(updatedOrg1, { timeout: 20000 }).should('exist');
});

When('{string} selects the organisation in the Report Picker for which no report is generated yet', () => {
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuAdmin().contains('Admin').click();
  partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
  partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click(); //create organisation
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId3);
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName3);
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName3, { timeout: 30000 });
  reportTabPage.reportTab().contains('Report').click();
  reportTabPage.reportTabContextDropdown().click();
  reportTabPage.selectContextFromReportTab().contains(newOrgName3).click();
  reportTabPage.reportTabEmptyReportList().should('have.text', 'No reports found for this context');
  reportPickerDialogPage.barChartIconReportPickerButton().click();
  reportPickerDialogPage.reportPickerDialog().should('be.visible');
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportPickerDialogPage.reportPickerContextList().contains(newOrgName3).click();
});

Then('{string} sees the message saying no available reports', () => {
  reportPickerDialogPage
    .reportPickerReportsByDateYearSelectDropdown()
    .should('have.text', formattedCurrentYear + ' (0)');
  reportPickerDialogPage.reportPickerReportsByMonthSelectDropdown().should('have.text', formattedCurrentMonth + ' (0)');
  reportPickerDialogPage
    .reportPickerNoReportsAvailableMessage()
    .should('have.text', 'There are no available reports for the given context and dates.');
});

Given('{string} have an organisation selected with reports generated and report selected in the Report Picker', () => {
  const personaCSVFile = 'cypress/fixtures/report-picker-persona-settings-file.json';
  const inputCSVFile = 'cypress/fixtures/report-picker-upload-input-input-data-file.csv';
  const projectCSVFile1 = 'cypress/fixtures/report-picker-project-file.csv';
  const projectCSVFile2 = 'cypress/fixtures/report-picker-project-file.csv';
  cy.writeFile(
    projectCSVFile1,
    `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId1}\nL304085,Actual O365,web-bea581,remote,${newProjectId1}\nL322680,Actual O365,web-bea581,remote,${newProjectId1}`
  );

  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuAdmin().contains('Admin').click();
  partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
  partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click(); //create new organisation
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId5);
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName5);
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName5, { timeout: 30000 });
  projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click();
  projectTemplatesPage.projectTemplatesTabContextDropdown().click();
  projectTemplatesPage.selectContextProjectTemplatesTab().contains(newOrgName5).click();
  projectTemplatesPage.addProjectTemplateCreateButton().click();
  projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName1);
  projectTemplatesPage.projectTemplateID().click().type(newProjectId1);
  projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName1 + 'is successful');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('be.enabled');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
  projectTemplatesPage.projectTemplatesTabPagination().click();
  projectTemplatesPage.projectTemplatesTabPaginationList().contains('100').click();
  projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName1).should('exist');
  reportTabPage.reportTab().click();
  reportTabPage.reportTabContextDropdown().click();
  reportTabPage.selectContextFromReportTab().contains(newOrgName5).click(); //create project
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').click().wait(100);
  reportTabPage.reportTabUploadPersonaDialog().should('exist');
  reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
  reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
  reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
  reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
  reportTabPage.reportTabSuccessPersonaSettingsUploaded().contains('Valid Persona Settings Uploaded').should('exist');
  reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
  reportTabPage.reportTabCreateReportDialogTitle().contains('Create New Report').should('exist');
  reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName1);
  reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
  reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile1);
  reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
  reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

  reportTabPage
    .reportTabSaveAndPublishButton()
    .contains('Save & Publish')
    .should('not.be.disabled', { timeout: 100000 });
  reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();
  reportTabPage.reportTabPublishButton().contains('Publish').click();
  reportTabPage.reportTabPagination().click();
  reportTabPage.reportTabPaginationList().contains('100').click();
  reportTabPage.reportTabReportListTable().should('exist');
  reportTabPage.reportTabEmptyReportList().should('not.exist');
  reportPickerDialogPage.barChartIconReportPickerButton().click(); //select report to view in reports page
  reportPickerDialogPage.reportPickerDialog().should('be.visible');
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportPickerDialogPage.reportPickerReportList().contains(newOrgName5).click(); //select report under the organisation
  reportPickerDialogPage.reportPickerReportSection().should('exist');
  reportPickerDialogPage.reportPickerNoReportsAvailableMessage().should('not.exist');
  reportPickerDialogPage.reportPickerReportsByDateLabel().contains('Reports by date').should('exist');
  reportPickerDialogPage.reportPickerReportsByDateYearSelectDropdown().should('exist').click();
  reportPickerDialogPage.reportPickerYearList().contains(formattedCurrentYear).click();
  reportPickerDialogPage.reportPickerReportsByMonthSelectDropdown().should('exist').click();
  reportPickerDialogPage.reportPickerMonthList().contains(formattedCurrentMonth).click();
  reportPickerDialogPage.reportPickerReportList().contains(reportName1).should('exist');
  reportPickerDialogPage.reportPickerSelectRadioButtonOfReport().contains(reportName1).click();
  profileMenuPage.profileIcon().click(); //View report to view in reports page
  profileMenuPage.profileMenuBusinessReports().contains('Business Impact').click();
  businessImpactPage.businessImpactReportsTitle().contains(reportName1, { timeout: 30000 }).should('exist');
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuImprovementButton().contains('Improvements').click();
  improvementsPage.improvementsPageReportTitle().contains(reportName1).should('exist');
  profileMenuPage.profileIcon().click(); //create organisation
  profileMenuPage.profileMenuAdmin().contains('Admin').click();
  partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
  partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click(); //create new organisation
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId6);
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName6);
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName6, { timeout: 30000 });
  projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click(); //create new project templates
  projectTemplatesPage.projectTemplatesTabContextDropdown().click();
  projectTemplatesPage.selectContextProjectTemplatesTab().contains(newOrgName6).click();
  projectTemplatesPage.addProjectTemplateCreateButton().should('have.text', 'Add project template').should('be.exist');
  projectTemplatesPage.addProjectTemplateCreateButton().click();
  projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName2);
  projectTemplatesPage.projectTemplateID().click().type(newProjectId2);
  projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName2 + 'is successful');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('be.enabled');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
  projectTemplatesPage.projectTemplatesTabPagination().click();
  projectTemplatesPage.projectTemplatesTabPaginationList().contains('100').click();
  projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName2).should('exist'); //verify the project template created displayed in the list
  reportTabPage.reportTab().click(); //create report
  reportTabPage.reportTabContextDropdown().click();
  reportTabPage.selectContextFromReportTab().contains(newOrgName6).click();
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').click().wait(100);
  reportTabPage.reportTabUploadPersonaDialog().should('exist');
  reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
  reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
  reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
  reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
  reportTabPage.reportTabSuccessPersonaSettingsUploaded().contains('Valid Persona Settings Uploaded').should('exist');
  reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
  reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName2);
  reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
  cy.writeFile(
    projectCSVFile2,
    `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId2}\nL304085,Actual O365,web-bea581,remote,${newProjectId2}\nL322680,Actual O365,web-bea581,remote,${newProjectId2}`
  );
  reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile2);
  reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
  reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

  reportTabPage
    .reportTabSaveAndPublishButton()
    .contains('Save & Publish')
    .should('not.be.disabled', { timeout: 100000 });
  reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();
  reportTabPage.reportTabPublishButton().contains('Publish').click();
  reportTabPage.reportTabPagination().click();
  reportTabPage.reportTabPaginationList().contains('100').click();
  reportTabPage.reportTabReportListTable().contains(reportName2).should('exist');
});

When('{string} selects a newly created organisation with reports generated in Report Picker', () => {
  reportPickerDialogPage.barChartIconReportPickerButton().click();
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportTabPage.selectContextFromReportTab().contains(newOrgName6).click();
});

When('have no reports selected under it in Report Picker', () => {
  reportPickerDialogPage.reportPickerCurrentlyReportName().contains(reportName1).should('exist');
  reportPickerDialogPage.reportPickerReportList().contains(reportName2).should('exist');
  reportPickerDialogPage.reportPickerCancelButton().contains('Cancel').click();
});

Then('Business Impact Report page is having the last selected report data', () => {
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuBusinessReports().contains('Business Impact').click();
  businessImpactPage.businessImpactReportsTitle().contains(reportName1, { timeout: 30000 }).should('exist');
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuImprovementButton().contains('Improvements').click();
  improvementsPage.improvementsPageReportTitle().contains(reportName1).should('exist');
});

Given('{string} selects an organisation having reports generated', () => {
  const personaCSVFile = 'cypress/fixtures/report-picker-persona-settings-file.json';
  const inputCSVFile = 'cypress/fixtures/report-picker-upload-input-input-data-file.csv';
  const projectCSVFile1 = 'cypress/fixtures/report-picker-project-file.csv';
  const projectCSVFile2 = 'cypress/fixtures/report-picker-project-file.csv';
  cy.writeFile(
    projectCSVFile1,
    `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId3}\nL304085,Actual O365,web-bea581,remote,${newProjectId3}\nL322680,Actual O365,web-bea581,remote,${newProjectId3}`
  );
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuAdmin().contains('Admin').click();
  partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
  partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click();
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId4);
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName4);
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName4, { timeout: 30000 });
  projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click(); //create project templates
  projectTemplatesPage.projectTemplatesTabContextDropdown().click();
  projectTemplatesPage.selectContextProjectTemplatesTab().contains(newOrgName4).click();
  projectTemplatesPage.addProjectTemplateCreateButton().should('have.text', 'Add project template').should('be.exist');
  projectTemplatesPage.addProjectTemplateCreateButton().click();
  projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName3);
  projectTemplatesPage.projectTemplateID().click().type(newProjectId3);
  projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName3 + 'is successful');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('be.enabled');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
  projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName3).should('exist');

  reportTabPage.reportTab().click();
  reportTabPage.reportTabContextDropdown().click();
  reportTabPage.selectContextFromReportTab().contains(newOrgName4).click();
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').click().wait(100);
  reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
  reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
  reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
  reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
  reportTabPage.reportTabSuccessPersonaSettingsUploaded().contains('Valid Persona Settings Uploaded').should('exist');
  reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
  reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName3);
  reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
  reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile1);
  reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
  reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

  reportTabPage
    .reportTabSaveAndPublishButton()
    .contains('Save & Publish')
    .should('not.be.disabled', { timeout: 100000 });
  reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();
  reportTabPage.reportTabPublishButton().contains('Publish').click();
  reportTabPage.reportTabPagination().click();
  reportTabPage.reportTabPaginationList().contains('100').click();
  reportTabPage.reportTabReportListTable().contains(reportName3).should('exist');
  reportTabPage.reportTabEmptyReportList().should('not.exist');
});

When('{string} clicks on one of the report in Report Picker to view in the Business Impact Reports', () => {
  reportPickerDialogPage.barChartIconReportPickerButton().click();
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportPickerDialogPage.reportPickerContextList().contains(newOrgName4).click();
  reportPickerDialogPage.reportPickerReportSection().should('exist');
  reportPickerDialogPage.reportPickerNoReportsAvailableMessage().should('not.exist');
  reportPickerDialogPage.reportPickerReportList().contains(reportName3).should('exist');
  reportPickerDialogPage.reportPickerSelectRadioButtonOfReport().contains(reportName3).click();
});

Then('{string} sees the selected report is displayed under the Business Impact and Improvements Reports', () => {
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuBusinessReports().contains('Business Impact').click();
  businessImpactPage.businessImpactReportsTitle().contains(reportName3, { timeout: 30000 }).should('exist');
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuImprovementButton().contains('Improvements').click();
  improvementsPage.improvementsPageReportTitle().contains(reportName3).should('exist');
});

Given('{string} sees the Business reports selected for the assigned organisation', () => {
  const inputCSVFile = 'cypress/fixtures/report-picker-upload-input-input-data-file.csv';
  const projectCSVFile1 = 'cypress/fixtures/report-picker-project-file.csv';
  const projectCSVFile2 = 'cypress/fixtures/report-picker-project-file.csv';
  cy.writeFile(
    projectCSVFile1,
    `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId4}\nL304085,Actual O365,web-bea581,remote,${newProjectId4}\nL322680,Actual O365,web-bea581,remote,${newProjectId4}`
  );
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuAdmin().contains('Admin').click();
  partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
  partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click(); //create Organisation
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId7);
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName7);
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName7, { timeout: 30000 });
  projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click(); //create projects before report
  projectTemplatesPage.projectTemplatesTabContextDropdown().click();
  projectTemplatesPage.selectContextProjectTemplatesTab().contains(newOrgName7).click();
  projectTemplatesPage.addProjectTemplateCreateButton().should('have.text', 'Add project template').should('be.exist');
  projectTemplatesPage.addProjectTemplateCreateButton().click();
  projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName4);
  projectTemplatesPage.projectTemplateID().click().type(newProjectId4);
  projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName4 + 'is successful');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('be.enabled');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
  projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName4).should('exist');
  reportTabPage.reportTab().click(); //create report steps
  reportTabPage.reportTabContextDropdown().click();
  reportTabPage.selectContextFromReportTab().contains(newOrgName7).click();
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').click().wait(100);
  reportTabPage.reportTabUploadPersonaDialog().should('exist');
  reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
  reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
  reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
  reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
  reportTabPage.reportTabSuccessPersonaSettingsUploaded().contains('Valid Persona Settings Uploaded').should('exist');
  reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
  reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName4);
  reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
  reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile1);
  reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
  reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

  reportTabPage
    .reportTabSaveAndPublishButton()
    .contains('Save & Publish')
    .should('not.be.disabled', { timeout: 200000 });
  reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();

  reportTabPage.reportTabPublishButton().contains('Publish').click();
  reportTabPage.reportTabPagination().click();
  reportTabPage.reportTabPaginationList().contains('100').click();
  reportTabPage.reportTabReportListTable().contains(reportName4).should('exist');
  reportPickerDialogPage.barChartIconReportPickerButton().click(); //Select report in report picker
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportPickerDialogPage.reportPickerContextList().contains(newOrgName7).click();
  reportPickerDialogPage.reportPickerNoReportsAvailableMessage().should('not.exist');
  reportPickerDialogPage.reportPickerReportList().should('exist');
  reportPickerDialogPage.reportPickerSelectRadioButtonOfReport().contains(reportName4).click();
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuBusinessReports().contains('Business Impact').click();
  businessImpactPage.businessImpactReportsTitle().contains(reportName4, { timeout: 30000 }).should('exist');
});

When('{string} selects another organisation from Report Picker', () => {
  const personaCSVFile = 'cypress/fixtures/report-picker-persona-settings-file.json';
  const inputCSVFile = 'cypress/fixtures/report-picker-upload-input-input-data-file.csv';
  const projectCSVFile1 = 'cypress/fixtures/report-picker-project-file.csv';
  const projectCSVFile2 = 'cypress/fixtures/report-picker-project-file.csv';
  cy.writeFile(
    projectCSVFile1,
    `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId5}\nL304085,Actual O365,web-bea581,remote,${newProjectId5}\nL322680,Actual O365,web-bea581,remote,${newProjectId5}`
  );
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuAdmin().contains('Admin').click();
  partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
  partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click(); //create Organisation
  partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId8);
  partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName8);
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
  partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
  partnerOrgTabPage.partnerAndOrgTabPagination().click();
  partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
  partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName8, { timeout: 30000 });
  projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click(); //create projects before report
  projectTemplatesPage.projectTemplatesTabContextDropdown().click();
  projectTemplatesPage.selectContextProjectTemplatesTab().contains(newOrgName8).click();
  projectTemplatesPage.addProjectTemplateCreateButton().should('have.text', 'Add project template').should('be.exist');
  projectTemplatesPage.addProjectTemplateCreateButton().click();
  projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName5);
  projectTemplatesPage.projectTemplateID().click().type(newProjectId5);
  projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName5 + 'is successful');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('be.enabled');
  projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
  projectTemplatesPage.projectTemplatesTabPagination().click();
  projectTemplatesPage.projectTemplatesTabPaginationList().contains('100').click();
  projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName5).should('exist');
  reportTabPage.reportTab().click(); //create report
  reportTabPage.reportTabContextDropdown().click();
  reportTabPage.selectContextFromReportTab().contains(newOrgName8).click();
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
  reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').click().wait(100);
  reportTabPage.reportTabUploadPersonaDialog().should('exist');
  reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
  reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
  reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
  reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
  reportTabPage.reportTabSuccessPersonaSettingsUploaded().contains('Valid Persona Settings Uploaded').should('exist');
  reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
  reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName5);
  reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
  reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile2);
  reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
  reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

  reportTabPage
    .reportTabSaveAndPublishButton()
    .contains('Save & Publish')
    .should('not.be.disabled', { timeout: 100000 });
  reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();
  reportTabPage.reportTabPublishButton().contains('Publish').click();
  reportTabPage.reportTabPagination().click();
  reportTabPage.reportTabPaginationList().contains('100').click();
  reportTabPage.reportTabReportListTable().contains(reportName5).should('exist');
  reportTabPage.reportTabEmptyReportList().should('not.exist');
  reportPickerDialogPage.barChartIconReportPickerButton().click(); //see report in report picker
  reportPickerDialogPage.selectContextReportPickerTab().click();
  reportPickerDialogPage.reportPickerContextList().contains(newOrgName8).click();
});

When('{string} clicks on any available report', () => {
  reportPickerDialogPage.reportPickerReportList().contains(reportName5).should('exist');
  reportPickerDialogPage.reportPickerSelectRadioButtonOfReport().contains(reportName5).click(); //select report in report picker
});

Then('{string} should be able to view a report from another organisation in all the reports page', () => {
  profileMenuPage.profileIcon().click(); //view selected reports in reports pages
  profileMenuPage.profileMenuBusinessReports().contains('Business Impact').click();
  businessImpactPage.businessImpactReportsTitle().contains(reportName5, { timeout: 30000 }).should('exist');
  profileMenuPage.profileIcon().click();
  profileMenuPage.profileMenuImprovementButton().contains('Improvements').click();
  improvementsPage.improvementsPageReportTitle().contains(reportName5).should('exist');
});

Given(
  '{string} selects an organisation having new reports generated that are set to {string} access level',
  (name: string, level_set: string) => {
    const personaCSVFile = 'cypress/fixtures/report-picker-persona-settings-file.json';
    const inputCSVFile = 'cypress/fixtures/report-picker-upload-input-input-data-file.csv';
    const projectCSVFile1 = 'cypress/fixtures/report-picker-project-file.csv';
    const projectCSVFile2 = 'cypress/fixtures/report-picker-project-file.csv';
    cy.writeFile(
      projectCSVFile1,
      `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId6}\nL304085,Actual O365,web-bea581,remote,${newProjectId6}\nL322680,Actual O365,web-bea581,remote,${newProjectId6}`
    );
    cy.writeFile(
      projectCSVFile2,
      `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId7}\nL304085,Actual O365,web-bea581,remote,${newProjectId7}\nL322680,Actual O365,web-bea581,remote,${newProjectId7}`
    );

    if (level_set === 'Restricted') {
      //create organisation
      profileMenuPage.profileIcon().click();
      profileMenuPage.profileMenuAdmin().contains('Admin').click();
      partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
      partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click(); //create Organisation
      partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId9);
      partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName9);
      partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
      partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
      partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
      partnerOrgTabPage.partnerAndOrgTabPagination().click();
      partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
      partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName9, { timeout: 30000 });
      projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click(); //create projects before report
      projectTemplatesPage.projectTemplatesTabContextDropdown().click();
      projectTemplatesPage.selectContextProjectTemplatesTab().contains(newOrgName9).click();
      projectTemplatesPage
        .addProjectTemplateCreateButton()
        .should('have.text', 'Add project template')
        .should('be.exist');
      projectTemplatesPage.addProjectTemplateCreateButton().click();
      projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName6);
      projectTemplatesPage.projectTemplateID().click().type(newProjectId6);
      projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName6 + 'is successful');
      projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
      projectTemplatesPage
        .projectTemplateAddProjectTemplateSaveButton()
        .should('have.text', 'Save')
        .should('be.enabled');
      projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
      projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName6).should('exist');
      reportTabPage.reportTab().click(); //create report
      reportTabPage.reportTabContextDropdown().click();
      reportTabPage.selectContextFromReportTab().contains(newOrgName9).click();
      reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
      reportTabPage
        .reportTabUploadPersonaButton()
        .contains('Upload a new persona settings JSON file')
        .click()
        .wait(100);
      reportTabPage.reportTabUploadPersonaDialog().should('exist');
      reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
      reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
      reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
      reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
      reportTabPage
        .reportTabSuccessPersonaSettingsUploaded()
        .contains('Valid Persona Settings Uploaded')
        .should('exist');
      reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
      reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName6);
      reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
      reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile1);
      reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
      reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

      reportTabPage
        .reportTabSaveAndPublishButton()
        .contains('Save & Publish')
        .should('not.be.disabled', { timeout: 100000 });
      reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();
      reportTabPage.reportTabPublishButton().contains('Publish').click();
      reportTabPage.reportTabEmptyReportList().should('not.exist');
      reportTabPage.reportTabReportsHeader().contains('Reports').should('exist');
      reportTabPage.reportTabPagination().click();
      reportTabPage.reportTabPaginationList().contains('100').click();
      const reportName = 'AE-A/' + newOrgId9 + reportName6; //verify report name
      cy.contains(reportName6)
        .parent('tr')
        .within(() => {
          reportTabPage.reportTabAccessLevelDropdown().click();
        });
      reportTabPage.reportTabAccessLevelDropdownListOptions().contains('Super User').should('not.exist');
      reportTabPage.reportTabAccessLevelDropdownListOptions().should('have.length', 2);
    }

    if (level_set === 'Unrestricted') {
      profileMenuPage.profileIcon().click(); //create organisation
      profileMenuPage.profileMenuAdmin().contains('Admin').click();
      partnerOrgTabPage.partnerAndOrgTab().should('have.text', 'Partners & Organisations').click();
      partnerOrgTabPage.partnerAndOrgTabAddOrganisation().contains('Add organisation').click();
      partnerOrgTabPage.partnerAndOrgTabEnterOrgIdTextbox().type(newOrgId10);
      partnerOrgTabPage.partnerAndOrgTabEnterOrgNameTextbox().type(newOrgName10);
      partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('exist');
      partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').and('be.enabled');
      partnerOrgTabPage.partnerAndOrgTabAddOrgSaveButton().should('have.text', 'Save').wait(500).click().wait(500);
      partnerOrgTabPage.partnerAndOrgTabPagination().click();
      partnerOrgTabPage.partnerAndOrgTabPaginationList().contains('100').click();
      partnerOrgTabPage.partnerAndOrgTabOrganisationList().contains('td', newOrgName10, { timeout: 30000 });
      projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click(); //create projects before report
      projectTemplatesPage.projectTemplatesTabContextDropdown().click();
      projectTemplatesPage.selectContextProjectTemplatesTab().contains(newOrgName10).click();
      projectTemplatesPage
        .addProjectTemplateCreateButton()
        .should('have.text', 'Add project template')
        .should('be.exist');
      projectTemplatesPage.addProjectTemplateCreateButton().click();
      projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName7);
      projectTemplatesPage.projectTemplateID().click().type(newProjectId7);
      projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName7 + 'is successful');
      projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
      projectTemplatesPage
        .projectTemplateAddProjectTemplateSaveButton()
        .should('have.text', 'Save')
        .should('be.enabled');
      projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
      projectTemplatesPage.projectTemplatesTabPagination().click();
      projectTemplatesPage.projectTemplatesTabPaginationList().contains('100').click();
      projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName7).should('exist');
      reportTabPage.reportTab().click(); //create report
      reportTabPage.reportTabContextDropdown().click();
      reportTabPage.selectContextFromReportTab().contains(newOrgName10).click();
      reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
      reportTabPage
        .reportTabUploadPersonaButton()
        .contains('Upload a new persona settings JSON file')
        .click()
        .wait(100);
      reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
      reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
      reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
      reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
      reportTabPage
        .reportTabSuccessPersonaSettingsUploaded()
        .contains('Valid Persona Settings Uploaded')
        .should('exist');
      reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
      reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName7);
      reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
      reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile2);
      reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
      reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

      reportTabPage
        .reportTabSaveAndPublishButton()
        .contains('Save & Publish')
        .should('not.be.disabled', { timeout: 100000 });
      reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();
      reportTabPage.reportTabPublishButton().contains('Publish').click();
      reportTabPage.reportTabEmptyReportList().should('not.exist');
      reportTabPage.reportTabReportsHeader().contains('Reports').should('exist');
      reportTabPage.reportTabPagination().click();
      reportTabPage.reportTabPaginationList().contains('100').click();
      const reportName = 'AE-A/' + newOrgId10 + reportName7; //verify report name
      cy.contains(reportName)
        .parent('tr')
        .within(() => {
          reportTabPage.reportTabAccessLevelDropdown().click();
        });
      reportTabPage.reportTabAccessLevelDropdownListOptions().contains('Super User').should('not.exist');
      reportTabPage.reportTabAccessLevelDropdownListOptions().should('have.length', 2);
    }
  }
);

When('{string} tries to set the reports viewing access level to {string}', (name: string, access_level: string) => {
  if (access_level === 'Restricted') {
    reportTabPage
      .reportTabAccessLevelDropdownListOptions()
      .contains('Restricted (AE/Automation Test-Partner only)')
      .should('exist');
    reportTabPage
      .reportTabAccessLevelDropdownListOptions()
      .contains('Restricted (AE/Automation Test-Partner only)')
      .click(); //set access level
  }
  if (access_level === 'Unrestricted') {
    reportTabPage.reportTabAccessLevelDropdownListOptions().contains('Unrestricted').should('exist');
    reportTabPage.reportTabAccessLevelDropdownListOptions().contains('Unrestricted').click(); //set access level
  }
});

Then('{string} should be able to set the access level to {string}', (name: string, access_level: string) => {
  if (access_level === 'Restricted') {
    reportTabPage.reportTabAccessLevelDropdown().contains('Restricted (AE/Automation Test-Partner only)');
  }
  if (access_level === 'Unrestricted') {
    reportTabPage.reportTabAccessLevelDropdown().contains('Unrestricted');
  }
});

Given(
  '{string} selects an organisation having new reports generated with {string}',
  (name: string, level_set: string) => {
    const personaCSVFile = 'cypress/fixtures/report-picker-persona-settings-file.json';
    const inputCSVFile = 'cypress/fixtures/report-picker-upload-input-input-data-file.csv';
    const projectCSVFile1 = 'cypress/fixtures/report-picker-project-file.csv';
    const projectCSVFile2 = 'cypress/fixtures/report-picker-project-file.csv';
    cy.writeFile(
      projectCSVFile1,
      `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId8}\nL304085,Actual O365,web-bea581,remote,${newProjectId8}\nL322680,Actual O365,web-bea581,remote,${newProjectId8}`
    );
    cy.writeFile(
      projectCSVFile2,
      `DU Name,Target Name,Mission Name,Location,Project ID\nL348615,Actual O365,web-bea581,Westminster Nobel House (220WNH),${newProjectId9}\nL304085,Actual O365,web-bea581,remote,${newProjectId9}\nL322680,Actual O365,web-bea581,remote,${newProjectId9}`
    );

    if (level_set === 'Restricted') {
      //create organisation
      profileMenuPage.profileIcon().click();
      profileMenuPage.profileMenuAdmin().contains('Admin').click();
      projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click(); //create projects before report
      projectTemplatesPage.projectTemplatesTabContextDropdown().click();
      projectTemplatesPage.selectContextProjectTemplatesTab().contains('Automation-Test-Org').click();
      projectTemplatesPage
        .addProjectTemplateCreateButton()
        .should('have.text', 'Add project template')
        .should('be.exist');
      projectTemplatesPage.addProjectTemplateCreateButton().click();
      projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName8);
      projectTemplatesPage.projectTemplateID().click().type(newProjectId8);
      projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName8 + 'is successful');
      projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
      projectTemplatesPage
        .projectTemplateAddProjectTemplateSaveButton()
        .should('have.text', 'Save')
        .should('be.enabled');
      projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
      projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName8).should('exist');
      reportTabPage.reportTab().should('have.text', 'Report').click();
      reportTabPage.reportTabContextDropdown().click();
      reportTabPage.selectContextFromReportTab().contains('Automation-Test-Org').click();
      reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
      reportTabPage
        .reportTabUploadPersonaButton()
        .contains('Upload a new persona settings JSON file')
        .click()
        .wait(100);
      reportTabPage.reportTabUploadPersonaDialog().should('exist');
      reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
      reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
      reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
      reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
      reportTabPage
        .reportTabSuccessPersonaSettingsUploaded()
        .contains('Valid Persona Settings Uploaded')
        .should('exist');
      reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
      reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName8);
      reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
      reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile1);
      reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
      reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

      reportTabPage
        .reportTabSaveAndPublishButton()
        .contains('Save & Publish')
        .should('not.be.disabled', { timeout: 100000 });
      reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();

      reportTabPage.reportTabPublishButton().contains('Publish').click();
      reportTabPage.reportTabEmptyReportList().should('not.exist');
      reportTabPage.reportTabReportsHeader().contains('Reports').should('exist');
      reportTabPage.reportTabRefreshListButton().click();
      reportTabPage.reportTabPagination().click();
      reportTabPage.reportTabPaginationList().contains('100').click();
      const reportName = 'AE-A/' + 'AEA' + reportName8; //verify report name
      cy.contains(reportName)
        .parent('tr')
        .within(() => {
          reportTabPage.reportTabAccessLevelDropdown().click();
        });
      reportTabPage.reportTabAccessLevelDropdownListOptions().contains('Super User').should('not.exist');
      reportTabPage.reportTabAccessLevelDropdownListOptions().should('have.length', 2);
    }

    if (level_set === 'Unrestricted') {
      profileMenuPage.profileIcon().click(); //create organisation
      profileMenuPage.profileMenuAdmin().contains('Admin').click();
      projectTemplatesPage.projectTemplatesTab().contains('Project Templates').should('be.exist').click(); //create projects before report
      projectTemplatesPage.projectTemplatesTabContextDropdown().click();
      projectTemplatesPage.selectContextProjectTemplatesTab().contains('Automation-Test-Org').click();
      projectTemplatesPage
        .addProjectTemplateCreateButton()
        .should('have.text', 'Add project template')
        .should('be.exist');
      projectTemplatesPage.addProjectTemplateCreateButton().click();
      projectTemplatesPage.projectTemplateNameTextbox().click().type(newProjectName9);
      projectTemplatesPage.projectTemplateID().click().type(newProjectId9);
      projectTemplatesPage.projectTemplateBodyTextbox().type(newProjectName9 + 'is successful');
      projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().should('have.text', 'Save').should('exist');
      projectTemplatesPage
        .projectTemplateAddProjectTemplateSaveButton()
        .should('have.text', 'Save')
        .should('be.enabled');
      projectTemplatesPage.projectTemplateAddProjectTemplateSaveButton().contains('Save').wait(100).click().wait(500);
      projectTemplatesPage.projectTemplateProjectListTable().contains(newProjectName9).should('exist');
      reportTabPage.reportTab().click(); //create report
      reportTabPage.reportTabContextDropdown().click();
      reportTabPage.selectContextFromReportTab().contains('Automation-Test-Org').click();
      reportTabPage.reportTabUploadPersonaButton().contains('Upload a new persona settings JSON file').should('exist');
      reportTabPage
        .reportTabUploadPersonaButton()
        .contains('Upload a new persona settings JSON file')
        .click()
        .wait(100);
      reportTabPage.reportTabPersonaFileUploadButton().click().selectFile(personaCSVFile);
      reportTabPage.reportTabPersonaUploadButton().contains('Upload').click();
      reportTabPage.reportTabUploadPersonaSuccessMessage().contains('File Uploaded successfully!', { timeout: 30000 });
      reportTabPage.reportTabUploadPersonaCloseButton().contains('Close').click();
      reportTabPage
        .reportTabSuccessPersonaSettingsUploaded()
        .contains('Valid Persona Settings Uploaded')
        .should('exist');
      reportTabPage.reportTabCreateReportButton().contains('Create new report').click();
      reportTabPage.reportTabCreateReportReportName().should('exist').type(reportName9);
      reportTabPage.reportTabInputCSVChooseFileCreateReportButton().click().selectFile(inputCSVFile);
      reportTabPage.reportTabProjectCSVChooseFileCreateReportButton().click().selectFile(projectCSVFile2);
      reportTabPage.reportTabCreateReportUploadButton().contains('Upload').click();
      reportTabPage.reportTabReportPreviewPageTitle().contains('Report Preview').should('exist');

      reportTabPage
        .reportTabSaveAndPublishButton()
        .contains('Save & Publish')
        .should('not.be.disabled', { timeout: 100000 });
      reportTabPage.reportTabSaveAndPublishButton().contains('Save & Publish').should('exist').click();
      reportTabPage.reportTabPublishButton().contains('Publish').click();
      reportTabPage.reportTabEmptyReportList().should('not.exist');
      reportTabPage.reportTabReportsHeader().contains('Reports').should('exist');
      reportTabPage.reportTabRefreshListButton().click();
      reportTabPage.reportTabPagination().click();
      reportTabPage.reportTabPaginationList().contains('100').click();
      const reportName = 'AE-A/' + 'AEA' + reportName9; //verify report name
      cy.contains(reportName)
        .parent('tr')
        .within(() => {
          reportTabPage.reportTabAccessLevelDropdown().click();
        });
      reportTabPage.reportTabAccessLevelDropdownListOptions().contains('Super User').should('not.exist');
      reportTabPage.reportTabAccessLevelDropdownListOptions().should('have.length', 2);
    }
  }
);

When('{string} sets the report access as {string}', (name: string, level_set: string) => {
  if (level_set === 'Restricted') {
    reportTabPage
      .reportTabAccessLevelDropdownListOptions()
      .contains('Restricted (AE/Automation Test-Partner only)')
      .should('exist');
    reportTabPage
      .reportTabAccessLevelDropdownListOptions()
      .contains('Restricted (AE/Automation Test-Partner only)')
      .click();

    profileMenuPage.profileIcon().click();
    profileMenuPage.profileMenuLogoutButton().click();
  }
  if (level_set === 'Unrestricted') {
    reportTabPage.reportTabAccessLevelDropdownListOptions().contains('Unrestricted').should('exist');
    reportTabPage.reportTabAccessLevelDropdownListOptions().contains('Unrestricted').click();
  }
});

Then('{string} should be able to see reports as per {string}', (name: string, level_set: string) => {
  if (level_set === 'Restricted') {
    cy.login(Cypress.env('TEST_USER_ORG'), Cypress.env('TEST_PASS_ORG'));
    reportPickerDialogPage.barChartIconReportPickerButton().click(); //see report in report picker
    reportPickerDialogPage.selectContextReportPickerTab().click();
    reportPickerDialogPage.reportPickerContextList().contains('Automation-Test-Org').click();
    reportPickerDialogPage.reportPickerReportList().contains(reportName8).should('not.exist');
  }

  if (level_set === 'Unrestricted') {
    reportPickerDialogPage.barChartIconReportPickerButton().click(); //see report in report picker
    reportPickerDialogPage.selectContextReportPickerTab().click();
    reportPickerDialogPage.reportPickerContextList().contains('Automation-Test-Org').click();
    reportPickerDialogPage.reportPickerReportList().contains(reportName9).should('exist');
    reportPickerDialogPage.reportPickerSelectRadioButtonOfReport().contains(reportName9).click();
    profileMenuPage.profileIcon().click(); //view selected reports in reports pages
    profileMenuPage.profileMenuBusinessReports().contains('Business Impact').click();
    businessImpactPage.businessImpactReportsTitle().contains(reportName9, { timeout: 30000 }).should('exist');
    profileMenuPage.profileIcon().click();
    profileMenuPage.profileMenuImprovementButton().contains('Improvements').click();
    improvementsPage.improvementsPageReportTitle().contains(reportName9).should('exist');
  }
});
