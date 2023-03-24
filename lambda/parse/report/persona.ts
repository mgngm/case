/* eslint-disable no-relative-import-paths/no-relative-import-paths */
import { calculatePercentage } from 'lambda/shared/helpers';
import type { PersonaHybridBreakdown, PersonaLocation, WorkingLocations } from 'src/types/csv';

export const buildPersonaHybridBreakdown = (
  personaLocations: Record<string, PersonaLocation>
): Record<string, PersonaHybridBreakdown> =>
  Object.entries(personaLocations).reduce<Record<string, PersonaHybridBreakdown>>(
    (obj, [term, personaLocation]) => ({
      ...obj,
      [term]: {
        total: personaLocation.count,
        home: personaLocation.remote.count,
        office: personaLocation.office.count,
        hybrid: personaLocation.hybrid.count,
        hybridBreakdown: { ...personaLocation.hybrid.hybridBreakdown },
      },
    }),
    {}
  );

export const buildPersonaWorkingLocations = (
  personaLocations: Record<string, PersonaLocation>
): Record<string, WorkingLocations> =>
  Object.entries(personaLocations).reduce<Record<string, WorkingLocations>>(
    (obj, [term, personaLocation]) => ({
      ...obj,
      [term]: {
        home: {
          score: personaLocation.remote.hxScore,
          percentages: {
            suffering: calculatePercentage(
              personaLocation.remote.scoreCounts.suffering,
              personaLocation.remote.scoreCounts.total,
              false
            ),
            frustrated: calculatePercentage(
              personaLocation.remote.scoreCounts.frustrated,
              personaLocation.remote.scoreCounts.total,
              false
            ),
            satisfied: calculatePercentage(
              personaLocation.remote.scoreCounts.satisfied,
              personaLocation.remote.scoreCounts.total,
              false
            ),
          },
        },
        office: {
          score: personaLocation.office.hxScore,
          percentages: {
            suffering: calculatePercentage(
              personaLocation.office.scoreCounts.suffering,
              personaLocation.office.scoreCounts.total,
              false
            ),
            frustrated: calculatePercentage(
              personaLocation.office.scoreCounts.frustrated,
              personaLocation.office.scoreCounts.total,
              false
            ),
            satisfied: calculatePercentage(
              personaLocation.office.scoreCounts.satisfied,
              personaLocation.office.scoreCounts.total,
              false
            ),
          },
        },
      },
    }),
    {}
  );
