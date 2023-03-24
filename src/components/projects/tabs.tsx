import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { a11yProps } from 'src/components/shared/tabs';
import { PROJECTS_SUMMARY_ROUTE, PROJECTS_PROJECT_ROUTE, PROJECTS_INSIGHTS_ROUTE } from 'src/constants/routes';
import useIsPreview from 'src/hooks/use-is-preview';
import useReport from 'src/hooks/use-report';
import { selectCustomProjectsFromReportData } from 'src/slices/report';
import styles from './tabs.module.scss';

const ProjectTabs = () => {
  const router = useRouter();
  const preview = useIsPreview();
  const { report } = useReport();

  // if we don't have custom projects or insights we need to
  // hide those tabs
  const { hasSummary, hasInsights } = useMemo(() => {
    if (!preview && report && !report.loading && report.data) {
      const projects = selectCustomProjectsFromReportData(report?.data);
      const insights = report?.data?.insightIds;
      return {
        hasSummary: !!projects?.length,
        hasInsights: !!insights?.length,
      };
    } else {
      return {
        hasSummary: true,
        hasInsights: true,
      };
    }
  }, [preview, report]);

  // TODO: turn this into a callback?
  let value = router.pathname;

  // update tabs value if a tab has been hidden and it's selected
  if (!hasSummary && value === PROJECTS_SUMMARY_ROUTE) {
    value = PROJECTS_PROJECT_ROUTE;
  }

  if (!hasInsights && value === PROJECTS_INSIGHTS_ROUTE) {
    value = PROJECTS_PROJECT_ROUTE;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        aria-label="projects tabs"
        className={styles.tabContainer}
        TabIndicatorProps={{
          sx: {
            borderLeft: '1px solid #D8D8D8',
            borderRight: '1px solid #D8D8D8',
          },
        }}
        sx={(theme) => theme.mixins.lightTheme.tabs()}
      >
        {hasSummary ? (
          <Tab
            label="Summary"
            {...a11yProps('summary')}
            className={clsx([styles.tab, router.pathname === PROJECTS_SUMMARY_ROUTE && styles.selected])}
            onClick={() => router.push(preview ? `${PROJECTS_SUMMARY_ROUTE}?preview=true` : PROJECTS_SUMMARY_ROUTE)}
            value={PROJECTS_SUMMARY_ROUTE}
          />
        ) : null}
        <Tab
          label="Projects"
          className={clsx([styles.tab, router.pathname === PROJECTS_PROJECT_ROUTE && styles.selected])}
          {...a11yProps('project-templates')}
          onClick={() => router.push(preview ? `${PROJECTS_PROJECT_ROUTE}?preview=true` : PROJECTS_PROJECT_ROUTE)}
          value={PROJECTS_PROJECT_ROUTE}
        />
        {hasInsights ? (
          <Tab
            label="Additional Insights"
            {...a11yProps('insights')}
            className={clsx([styles.tab, router.pathname === PROJECTS_INSIGHTS_ROUTE && styles.selected])}
            onClick={() => router.push(preview ? `${PROJECTS_INSIGHTS_ROUTE}?preview=true` : PROJECTS_INSIGHTS_ROUTE)}
            value={PROJECTS_INSIGHTS_ROUTE}
          />
        ) : null}
      </Tabs>
    </Box>
  );
};

export default ProjectTabs;
