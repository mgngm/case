# Created by steve.chan at 20/01/2023

  Scenario Outline: Tesseract user can manage user account
    Given "Steinway" is a <user> of Tesseract
    And "Steinway" has Admin access
    When "Steinway" navigate 'User Management' tab
    Then "Steinway" will see <the-users> displayed
    Examples:
      | user                       | the-users                                                   |
      | Actual Experience SSO user | all users from all partners and organisations in the system |
      | Partner Level user         | all users from all organisations belonging to his Partner   |
      | Organisation user          | all users from his organisation                             |

  Scenario Outline: Creating a Tesseract User 
    Given "Eavestaff" has Admin access
    When "Eavestaff" tries to add a user with email address <email-address>
    Then "Eavestaff" will see that the user account has been <resulting> for the selected context
    And <message> is displayed on the Create User dialog
    Examples:
      | email-address                        | resulting   | message                       |
      | no-reply@actual-experience.com       | created     | User successfully created!    |
      | NO-REPLY+user1@actual-experience.com | created     | User successfully created!    |
      | no-reply@@actual-experience.com      | not created | Invalid email address format. |
      | no-reply@actual-experiencecom        | not created | Invalid email address format. |
      | no-reply@actual-experience..com      | not created | Invalid email address format. |

  Scenario Outline: User confirmation is required for user deletion 
    Given "Fazioli" has Admin access
    And "Fazioli" has the 'Delete User' dialog opened
    When "Fazioli" tries to confirm deletion of a user by entering <the-word>
    Then the user <can-or-cannot> be deleted
    Examples:
      | the-word               | can-or-cannot |
      | delete                 | can           |
      | Delete                 | cannot        |
      | de1ete                 | cannot        |
      | DELETE                 | cannot        |

  Scenario: Tesseract Users cannot edit their own accounts
    Given "Cavendish" has Admin access
    And "Cavendish" is on the 'User Management' tab
    When "Cavendish" selects his user context to display his user account
    Then "Cavendish" will see the Trashcan and Edit icons disabled for his user account

  Scenario Outline: Switching context for a user
    Given "Apollo" a <admin-user>
    And "Apollo" has Admin access
    When "Apollo" changes the context for a user
    Then "Apollo" will see the <context>  available in the 'Available Contexts' list
    Examples:
      | admin-user                 | context                                                                   | 
      | Actual Experience SSO user | Any Partner context on the system, any Organisation context on the system |
      | Partner Level user         | Any Organisation context for the Partner                                  |
 
  Scenario Outline: Providing and removing Admin access
    Given "Baldwin" is on the 'User Management' tab
    And "Baldwin" has a user with <current-admin> status
    When "Baldwin" changes the 'Admin' status of the user
    Then "Baldwin" has set the user's status to <new-admin>
    Examples:
      | current-admin | new-admin | 
      | not Admin     | has Admin |
      | has Admin     | not Admin |

  Scenario: Resetting User password
    Given "Bechstein" has users displayed for the current context
    When "Bechstein" triggers a password reset for the user
    Then "Bechstein" has triggered a password reset for the user
