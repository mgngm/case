import { useMemo } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import clsx from 'clsx';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-dark.css';
import styles from 'src/components/admin/preview/preview.module.scss';
import Projects from 'src/components/admin/preview/projects';
import CustomProjects from 'src/components/admin/preview/projects/custom-projects';
import type { PreviewAccordion } from 'src/constants/report';
import { PROJECTS_ACCORDION } from 'src/constants/report';
import type { Project } from 'src/graphql';
import { selectAllInsights, selectInsightsMap, useListProjectInsightsByContextQuery } from 'src/slices/insights';
import type { UpdateReportWithProjectsFn } from 'src/types/preview';
import type { CustomProject } from 'src/types/projects';

type ProjectAndInsightsEditorProps = {
  toggleAccordion: (x: PreviewAccordion) => void;
  isAccordionClosed: (x: PreviewAccordion) => boolean;
  projects: Project[];
  customProjects: CustomProject[];
  orgId: string; //Need for insight query
  updateReportFn: UpdateReportWithProjectsFn;
  regenTrigger: (projectKey?: string) => Promise<void>;
  date: string;
  warnings: string[];
  selectedInsights: string[];
  inputProjectCsv: string;
};

const ProjectAndInsightsEditor = ({
  toggleAccordion,
  isAccordionClosed,
  projects,
  orgId,
  updateReportFn,
  regenTrigger,
  date,
  warnings,
  customProjects,
  selectedInsights,
  inputProjectCsv,
}: ProjectAndInsightsEditorProps) => {
  const { insights, insightMap } = useListProjectInsightsByContextQuery(
    { context: orgId }, //alerady formatted in preview component above.
    {
      skip: !orgId,
      selectFromResult: ({ data }) => ({
        insights: data && selectAllInsights(data.data),
        insightMap: data && selectInsightsMap(data.data),
      }),
    }
  );

  // we want to only show insights that exist in the Select component, since IDs that
  // live on a report may have been removed from the DB via the insights tab in admin
  const filteredSelection = useMemo(() => {
    if (selectedInsights && insights) {
      return selectedInsights.filter((ins) => insights?.find(({ id }) => ins === id));
    }
    return [];
  }, [insights, selectedInsights]);

  return (
    <>
      <div
        className={styles.accordion}
        id="projects-accordion"
        onClick={() => {
          toggleAccordion(PROJECTS_ACCORDION);
        }}
      >
        <div className={styles.accordionTitle}>Projects</div>
        <KeyboardArrowUpIcon
          className={clsx(styles.accordionArrow, isAccordionClosed(PROJECTS_ACCORDION) && styles.accordionClosed)}
        />
      </div>
      <div
        className={clsx(
          styles.accordionContent,
          isAccordionClosed(PROJECTS_ACCORDION) && styles.accordionClosed,
          styles.projectsContent
        )}
      >
        <CustomProjects
          customProjects={customProjects}
          updateReport={updateReportFn}
          organisation={orgId}
          date={date}
        />
        <Projects
          projects={projects}
          updateReport={updateReportFn}
          organisation={orgId}
          date={date}
          parseWarnings={warnings}
          inputProjectCsv={inputProjectCsv}
          regenerateTrigger={regenTrigger} //need to pipe this down (or leave here in this component?)
        />
        <div className={styles.insightsContainer}>
          <h3>Insights</h3>
          <Select
            id="insight-select"
            MenuProps={{ id: 'insight-select-menu' }}
            className={styles.insightsSelect}
            value={filteredSelection}
            sx={{ color: 'white' }}
            onChange={(e) => {
              const { value } = e.target;
              if (Array.isArray(value)) {
                updateReportFn({ insights: value });
              }
            }}
            multiple
            renderValue={(selected) => (
              <div className={styles.insightSelected}>
                {selected.map((id) => (
                  <Chip key={id} className={styles.insightChip} label={insightMap?.[id]?.name} />
                ))}
              </div>
            )}
          >
            {insights?.map((insight) => (
              <MenuItem key={insight.id} value={insight.id} className={styles.insightItem}>
                <span className={styles.insightDate}>{insight.insightDate}</span>
                <span>{insight.name}</span>
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default ProjectAndInsightsEditor;
