import PageSection from 'src/components/ui/page-section';
import { ALL_EMPLOYEES } from 'src/constants/report';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import useBreakpoint from 'src/hooks/use-breakpoint';
import useReport from 'src/hooks/use-report';
import { generateSankeyFromEmployeeData } from 'src/logic/libs/digital-workplace';
import {
  selectPersonasFromEmployeeCounts,
  selectEmployeeCountsByPersona,
  selectReportPersonaFilter,
  setReportPersonaFilter,
} from 'src/slices/dashboard';
import styles from './persona-select.module.scss';
import SankyDiagram from './sankey';
import Table from './table';

const DigitalWorkplace = () => {
  const personaFilter = useAppSelector(selectReportPersonaFilter);
  const dispatch = useAppDispatch();

  const { report } = useReport();

  const employeeData = generateSankeyFromEmployeeData(selectEmployeeCountsByPersona(report?.reportData, personaFilter));
  const personas = selectPersonasFromEmployeeCounts(report?.reportData);

  const matches = useBreakpoint('lg');

  return (
    <PageSection title="your digital workplace">
      <div className={styles.personaSelectWrapper}>
        <select
          className={styles.personaSelect}
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
      </div>
      {matches ? <SankyDiagram data={employeeData} /> : <Table data={employeeData} />}
    </PageSection>
  );
};

export default DigitalWorkplace;
