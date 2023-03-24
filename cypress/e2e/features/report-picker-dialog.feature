Feature: The Report picker on Tesseract

  Scenario: Organisation level user can see only the organisation assigned in Report Picker
    Given "Alex" attempts to log in with Organisation level valid non-SSO credentials
    When "Alex" opens the Report picker
    Then "Alex" sees the Report picker is displayed
    And Switch Context displays only the organisation assigned

  Scenario: Newly created organisations in Report Picker
    Given "Alex" attempts to log in with partner-level valid non-SSO credentials
    And "Alex" creates a new organisation
    When "Alex" opens the Report picker
    Then "Alex" sees the organisation in the Switch Context list

  Scenario: Updated Organisation Name should be available in Report Picker
    Given "Alex" attempts to log in with partner-level valid non-SSO credentials
    And "Alex" updates the name of an organisation created
    When "Alex" opens the Report picker
    Then "Alex" sees the updated organisation name in the Switch Context list of Report Picker

  Scenario: No reports to view in Report Picker
    Given "Alex" attempts to log in with partner-level valid non-SSO credentials
    When "Alex" selects the organisation in the Report Picker for which no report is generated yet
    Then "Alex" sees the message saying no available reports

  Scenario:Only selected Report in Report Picker is seen in Business Impact Report page
    Given "Alex" attempts to log in with partner-level valid non-SSO credentials
    And "Alex" have an organisation selected with reports generated and report selected in the Report Picker
    When "Alex" selects a newly created organisation with reports generated in Report Picker
    And have no reports selected under it in Report Picker
    Then Business Impact Report page is having the last selected report data

  Scenario: Viewing a Report
    Given "Alex" attempts to log in with partner-level valid non-SSO credentials
    And "Alex" selects an organisation having reports generated
    When "Alex" clicks on one of the report in Report Picker to view in the Business Impact Reports
    Then "Alex" sees the selected report is displayed under the Business Impact and Improvements Reports

  Scenario: Viewing report on another organisation
    Given "Alex" attempts to log in with partner-level valid non-SSO credentials
    And "Alex" sees the Business reports selected for the assigned organisation
    When "Alex" selects another organisation from Report Picker
    And "Alex" clicks on any available report
    Then "Alex" should be able to view a report from another organisation in all the reports page

  #to be tested manually
  @skip
  Scenario: Viewing other monthly reports
    Given "Alex" has the Report picker opened with reports selected for current month
    When "Alex" selects organisation for which previous months report list is available
    And "Alex" clicks on any available report
    Then "Alex" should be to view a report from another month

   #Unable to automate Global user scenarios
  @skip
  Scenario: Only global context user can view all Reports on Tesseract
    Given "Alex" is a global user of Tesseract
    When "Alex" has the Report picker opened
    Then "Alex" will see the ALL REPORT tab

  #Unable to automate Global user scenarios
  @skip
  Scenario: Global context user viewing view all Reports on Tesseract
    Given "Alex" is a global user of Tesseract
    And "Alex" navigate to the ALL REPORT tab of the report picker
    When "Alex" use the filter to select another report
    Then "Alex" is viewing another report

  Scenario Outline: Partner-level user should be able to set 2 access levels to Reports to be viewed in Report Picker
    Given "Alex" attempts to log in with partner-level valid non-SSO credentials
    And "Alex" selects an organisation having new reports generated that are set to '<level_set>' access level
    When "Alex" tries to set the reports viewing access level to '<level_set>'
    Then "Alex" should be able to set the access level to '<level_set>'
    Examples:
      | level_set     |
      | Restricted    |
      | Unrestricted  |

  Scenario Outline: Reports viewed in Report Picker as per access level set
    Given "Alex" attempts to log in with partner-level valid non-SSO credentials
    And "Alex" selects an organisation having new reports generated with '<level_set>'
    When "Alex" sets the report access as '<level_set>'
    Then "Alex" should be able to see reports as per '<level_set>'
    Examples:
      | level_set     |
      | Restricted    |
      | Unrestricted  |