Feature: Log in to Tesseract

  Scenario: Unauthenticated user is redirected to login page
    When "Lisa" attempts to access Tesseract without logging in
    Then "Lisa" is redirected to the login page

  @skip
  Scenario: SSO user can log in
    Given "Lisa" wants to log in to Tesseract
    When "Lisa" attempts to log in with valid SSO credentials
    Then "Lisa" is able to log in successfully

  Scenario: Non-SSO user can log in
    Given "Lisa" wants to log in to Tesseract
    When "Lisa" attempts to log in with valid non-SSO credentials
    Then "Lisa" is able to log in successfully

  Scenario: Go back from entering password to entering email
    Given "Lisa" wants to log in to Tesseract
    And "Lisa" attempts to log in with valid non-SSO id
    When "Lisa" tries to go back from password page to login page
    Then "Lisa" is redirected to the login page

  Scenario: Reset password
    Given "Lisa" wants to log in to Tesseract
    When "Lisa" tries to reset password
    Then "Lisa" is redirected to the Reset password page
    And "Lisa" is informed that a password reset email has been sent

  Scenario: Reset password page from the here link
    Given "Lisa" wants to log in to Tesseract
    When "Lisa" tries to reset password from the here link
    Then "Lisa" is redirected to the Reset password page

  Scenario Outline: Go back to login page from password reset page
    Given "Lisa" wants to log in to Tesseract
    When "Lisa" go back from reset password page when navigated from the the '<link>'
    Then "Lisa" is redirected to the login page
    Examples:
      | link                  |
      | here                  |
      | reset password button |

  Scenario: Email id mandatory while resetting password
    Given "Lisa" wants to log in to Tesseract
    When "Lisa" tries to reset password without entering email id
    Then "Lisa" is not allowed to reset password without email id

  @skip
  Scenario Outline: Go to footer links
    Given "Lisa" wants to log in to Tesseract
    When "Lisa" navigates to the footer links '<links>'
    Then "Lisa" is redirected to the '<links>' page
    Examples:
      | links                       |
      | User Interface Terms of Use |
      | Privacy Notice              |
      | explained here              |