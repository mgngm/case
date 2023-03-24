export const listPartnersAndOrganisations = /* GraphQL */ `
  query ListPartnersAndOrganisations($filter: ModelPartnerFilterInput, $limit: Int, $nextToken: String) {
    listPartners(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        partnerId
        partnerName
        organisations {
          nextToken
          startedAt
          items {
            id
            organisationId
            organisationName
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            partnerOrganisationsId
          }
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;

export const duWithProjectsByReport = /* GraphQL */ `
  query DuWithProjectsByReport(
    $reportId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelDUFilterInput
    $limit: Int
    $nextToken: String
  ) {
    duByReportId(
      reportId: $reportId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        hxScore
        persona
        timeLost
        payroll
        revenue
        locationType
        projects {
          startedAt
          nextToken
          items {
            project {
              id
              projectName
              projectType
            }
          }
        }
        office
        country
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        reportDusId
      }
      nextToken
      startedAt
    }
  }
`;
