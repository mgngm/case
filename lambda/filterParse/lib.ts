/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DU } from 'src/graphql';
import type { Employee, EmployeeLocation, PersonaSettings } from 'src/types/csv';
import type { DashboardData } from 'src/types/slices';

export const getInputLocationsFromReportData = (reportData: DashboardData) => {
  const allOffices = reportData.worstOffices.all;
  return Object.keys(allOffices);
};

export const mapDUsToEmployees = (dus: DU[], personaSettings: PersonaSettings): Employee[] =>
  dus.map(
    (du) =>
      ({
        User: du.name,
        employeeHxScore: du.hxScore!,
        analytics: du.analytics ?? [],
        hybridPercent: du.hybridPercent!,

        employeeDailyWastedMinutes: du.timeLost!,
        employeeOperationalLoss: du.payroll!,
        employeeRevenueLoss: du.revenue!,

        [personaSettings.termType]: {
          [personaSettings.term]: [du.persona!],
        },

        locations: (du.locations
          ? typeof du.locations === 'string'
            ? JSON.parse(du.locations)
            : du.locations
          : {}) as Record<string, EmployeeLocation>,

        // these are in the type but not used
        employeeQualityScore: 0,
        employeePotentialScore: 0,
        employeeScoreDelta: 0,
        employeeScoreWeight: 0,
      } as Employee)
  );
