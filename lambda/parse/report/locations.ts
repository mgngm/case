/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import cloneDeep from 'lodash/cloneDeep';
import { hasKey } from 'lambda/shared/helpers';
import type { Employee, Hybrid, Levers, Locations, Office, PersonaTerm, Remote } from 'src/types/csv';
import { DEFAULT_HYBRID_LOWER, DEFAULT_HYBRID_UPPER, DEFAULT_WORKING_DAYS } from './constants';

const updateScoreCountCategory = (
  scoreCounts: {
    total: number;
    suffering: number;
    frustrated: number;
    satisfied: number;
  },
  score: number
) => {
  switch (true) {
    case score < 5:
      scoreCounts.suffering += 1;
      break;
    case score < 8:
      scoreCounts.frustrated += 1;
      break;
    default:
      scoreCounts.satisfied += 1;
      break;
  }

  return scoreCounts;
};

/**
 * calculate aggregate HX scores for employee locations
 * in the remote/home, office and hybrid splits
 *
 * @param employeeData List of employee data objects`
 * @returns Locations
 */
export const calculateScoresPerLocation = (
  employeeData: Employee[],
  { hybridLower, hybridUpper }: Levers = {
    hybridLower: DEFAULT_HYBRID_LOWER,
    hybridUpper: DEFAULT_HYBRID_UPPER,
    workingDays: DEFAULT_WORKING_DAYS,
  },
  personaTerm: PersonaTerm
) => {
  const defaultLocation = {
    count: 0,
    scoreSum: 0,
    weightSum: 0,
    hxScore: 0,
    scoreCounts: { total: 0, suffering: 0, frustrated: 0, satisfied: 0 },
  };
  const defaultHybrid = { count: 0, hybridBreakdown: { 0: 0, 20: 0, 40: 0, 60: 0, 80: 0 } };

  // build initial object
  const combinedLocations: Locations = {
    all: {
      office: cloneDeep(defaultLocation),
      remote: cloneDeep(defaultLocation),
      hybrid: cloneDeep(defaultHybrid),
    },
    personas: {},
    offices: {},
  };

  // for each employee location set
  employeeData.forEach((employee) => {
    const { locations } = employee;

    // determine if user is home, office or hybrid based
    const offices = Object.fromEntries(Object.entries(locations).filter(([l]) => l !== 'remote'));
    const hasOffices = Object.keys(offices).length > 0;
    const hasRemote = !!locations.remote.locations.length;

    // calculate hybrid breakdown
    const officeDuration = Object.values(offices).reduce((p, o) => p + o.maxDuration, 0);
    const remoteDuration = locations.remote.maxDuration ?? 0;
    const totalDuration = officeDuration + remoteDuration;
    const hybridPercent = officeDuration / (totalDuration || 1);

    // store the durations on the employee
    employee.officeDuration = officeDuration;
    employee.remoteDuration = remoteDuration;
    employee.hybridPercent = hybridPercent;
    // we'll set these later
    employee.remote = false;
    employee.office = false;
    employee.hybrid = false;

    // setup persona keys
    const employeeTerms: string[] = [];
    const terms = employee[personaTerm.termType] as Record<string, string[]>;
    if (terms[personaTerm.value]) {
      employeeTerms.push(...terms[personaTerm.value]);

      employeeTerms.forEach((term) => {
        if (combinedLocations.personas && term in combinedLocations.personas) {
          combinedLocations.personas[term].count += 1;
        } else {
          if (!combinedLocations.personas) {
            combinedLocations.personas = {};
          }

          combinedLocations.personas[term] = {
            count: 1,
            office: cloneDeep(defaultLocation),
            remote: cloneDeep(defaultLocation),
            hybrid: cloneDeep(defaultHybrid),
          };
        }
      });
    }

    const updatePersonaCount = (key: string) =>
      employeeTerms.forEach((term) => {
        if (hasKey(combinedLocations.personas[term], key)) {
          (combinedLocations.personas[term][key] as Office | Remote | Hybrid).count += 1;
        }
      });

    const updatePersonaHybridBreakdownCount = (key: string) =>
      employeeTerms.forEach((term) => {
        if (hasKey(combinedLocations.personas[term].hybrid.hybridBreakdown, key)) {
          (combinedLocations.personas[term].hybrid.hybridBreakdown[key] as number) += 1;
        }
      });

    // increment location counts
    if (hasOffices && hasRemote) {
      // we could have a hybrid worker...

      // apply hybrid buffer values here (ie if employee spends less than 1 day or less in the office per month (<0.05) they are remote, not hybrid)
      if (hybridPercent <= hybridLower) {
        // hybrid remote
        combinedLocations.all.remote.count += 1;
        updatePersonaCount('remote');
        employee.remote = true;
      } else if (hybridPercent >= hybridUpper) {
        // hybrid office
        combinedLocations.all.office.count += 1;
        updatePersonaCount('office');
        employee.office = true;
      } else {
        // worker is definitely hybrid
        combinedLocations.all.hybrid.count += 1;
        updatePersonaCount('hybrid');
        employee.hybrid = true;

        // add hybrid worker to correct hybrid breakdown value
        switch (true) {
          case hybridPercent < 0.2: {
            combinedLocations.all.hybrid.hybridBreakdown['0'] += 1;
            updatePersonaHybridBreakdownCount('0');
            break;
          }
          case hybridPercent < 0.4: {
            combinedLocations.all.hybrid.hybridBreakdown['20'] += 1;
            updatePersonaHybridBreakdownCount('20');
            break;
          }
          case hybridPercent < 0.6: {
            combinedLocations.all.hybrid.hybridBreakdown['40'] += 1;
            updatePersonaHybridBreakdownCount('40');
            break;
          }
          case hybridPercent < 0.8: {
            combinedLocations.all.hybrid.hybridBreakdown['60'] += 1;
            updatePersonaHybridBreakdownCount('60');
            break;
          }
          case hybridPercent < 1: {
            combinedLocations.all.hybrid.hybridBreakdown['80'] += 1;
            updatePersonaHybridBreakdownCount('80');
            break;
          }
        }
      }
    } else if (hasOffices && !hasRemote) {
      combinedLocations.all.office.count += 1;
      updatePersonaCount('office');
      employee.office = true;
    } else {
      combinedLocations.all.remote.count += 1;
      updatePersonaCount('remote');
      employee.remote = true;
    }

    // calculate combined scores
    Object.entries(locations).forEach(([locationKey, location]) => {
      let scoreKey = 'office';

      const locationScore = location.hxScore;

      if (locationKey === 'remote') {
        scoreKey = 'remote';
      } else {
        // add office to combinedLocations.offices
        if (locationKey in combinedLocations.offices) {
          combinedLocations.offices[locationKey].count += 1;
          combinedLocations.offices[locationKey].scoreCounts.total += 1;

          combinedLocations.offices[locationKey].scoreSum += location.hxScore;
          combinedLocations.offices[locationKey].weightSum += location.weightSum;
        } else {
          combinedLocations.offices[locationKey] = {
            count: 1,
            hxScore: location.hxScore,
            scoreSum: location.hxScore,
            weightSum: location.weightSum,
            scoreCounts: {
              total: 1,
              suffering: 0,
              frustrated: 0,
              satisfied: 0,
            },
          };
        }

        combinedLocations.offices[locationKey].scoreCounts = updateScoreCountCategory(
          combinedLocations.offices[locationKey].scoreCounts,
          locationScore
        );
      }

      if (hasKey(combinedLocations.all, scoreKey)) {
        const parsedLocation = combinedLocations.all[scoreKey] as Office | Remote;

        // add location score to score count boundings
        parsedLocation.scoreCounts.total += 1;

        parsedLocation.scoreCounts = updateScoreCountCategory(parsedLocation.scoreCounts, locationScore);

        parsedLocation.scoreSum += location.hxScore;
        parsedLocation.weightSum += location.weightSum;
      }

      employeeTerms.forEach((term) => {
        if (hasKey(combinedLocations.personas[term], scoreKey)) {
          const personaLocation = combinedLocations.personas[term][scoreKey] as Office | Remote;
          personaLocation.scoreCounts.total += 1;

          personaLocation.scoreCounts = updateScoreCountCategory(personaLocation.scoreCounts, locationScore);

          personaLocation.scoreSum += location.hxScore;
          personaLocation.weightSum += location.weightSum;
        }
      });
    });
  });

  // "one man one vote" simple mean for each (ie, weight is not used)
  combinedLocations.all.office.hxScore =
    combinedLocations.all.office.scoreSum / (combinedLocations.all.office.scoreCounts.total || 1);
  combinedLocations.all.remote.hxScore =
    combinedLocations.all.remote.scoreSum / (combinedLocations.all.remote.scoreCounts.total || 1);

  Object.keys(combinedLocations.personas).forEach((term) => {
    combinedLocations.personas[term].office.hxScore =
      combinedLocations.personas[term].office.scoreSum /
      (combinedLocations.personas[term].office.scoreCounts.total || 1);

    combinedLocations.personas[term].remote.hxScore =
      combinedLocations.personas[term].remote.scoreSum /
      (combinedLocations.personas[term].remote.scoreCounts.total || 1);
  });

  Object.keys(combinedLocations.offices).forEach((office) => {
    combinedLocations.offices[office].hxScore =
      combinedLocations.offices[office].scoreSum / (combinedLocations.offices[office].scoreCounts.total || 1);
  });

  return combinedLocations;
};
