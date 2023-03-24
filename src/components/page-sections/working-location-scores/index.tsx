import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import selectStyles from 'src/components/page-sections/digital-workplace/persona-select.module.scss';
import Radials from 'src/components/page-sections/working-location-scores/radials';
import PageSection from 'src/components/ui/page-section';
import { ALL_EMPLOYEES } from 'src/constants/report';
import { BREAKDOWN_DATA_VIEW_STRING, OVERVIEW_DATA_VIEW_STRING } from 'src/constants/scores';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useReport from 'src/hooks/use-report';
import {
  selectPersonasFromWorkingLocations,
  selectReportPersonaFilter,
  selectWorkingLocationDataByPersona,
  setReportPersonaFilter,
} from 'src/slices/dashboard';
import type { WorkingLocation } from 'src/types/csv';
import styles from './working-location-scores.module.scss';

const emptyLocation: WorkingLocation = {
  score: 0,
  percentages: {
    suffering: 0,
    satisfied: 0,
    frustrated: 0,
  },
};

const WorkingLocationScores = () => {
  const [dataView, setDataView] = useState<string>(OVERVIEW_DATA_VIEW_STRING);
  const personaFilter = useAppSelector(selectReportPersonaFilter);
  const dispatch = useAppDispatch();

  const { report } = useReport();
  const workingLocations = selectWorkingLocationDataByPersona(report?.reportData, personaFilter);
  const personas = selectPersonasFromWorkingLocations(report?.reportData);

  return (
    <PageSection title="HX Score by working location" className={styles.workingLocationsWrapper}>
      <div className={styles.dataTypeSelector}>
        <select
          className={selectStyles.personaSelect}
          value={personaFilter}
          onChange={(e) => dispatch(setReportPersonaFilter(e.target.value))}
        >
          <option value={ALL_EMPLOYEES}>All employees</option>
          {personas.map((persona) => (
            <option key={persona} value={persona}>
              {persona}
            </option>
          ))}
        </select>
        <ToggleButtonGroup
          value={dataView}
          onChange={(e, val) => setDataView(val)}
          exclusive
          className={styles.dataTypePill}
        >
          <ToggleButton value={OVERVIEW_DATA_VIEW_STRING} className={styles.dataType}>
            Overview
          </ToggleButton>
          <ToggleButton value={BREAKDOWN_DATA_VIEW_STRING} className={styles.dataType}>
            Breakdown
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <Radials data={workingLocations ?? { home: emptyLocation, office: emptyLocation }} dataView={dataView} />
    </PageSection>
  );
};

export default WorkingLocationScores;
