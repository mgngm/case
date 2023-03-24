import { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { MoonLoader } from 'react-spinners';
import QuickReportPicker from 'src/components/header/data-switcher/quick-report-switcher';
import EmptyBlock from 'src/components/projects/empty-state/block';
import styles from 'src/components/projects/projects.module.scss';
import CustomProjects from 'src/components/projects/summary/custom-projects';
import ProjectTabs from 'src/components/projects/tabs';
import { PROJECTS_PROJECT_ROUTE } from 'src/constants/routes';
import { useAppSelector } from 'src/hooks';
import useIsPreview from 'src/hooks/use-is-preview';
import useReport from 'src/hooks/use-report';
import { selectCustomProjects } from 'src/slices/preview';
import { selectCustomProjectsFromReportData } from 'src/slices/report';

const ImprovementsSummary = () => {
  const theme = useTheme();
  const router = useRouter();
  const preview = useIsPreview();
  const previewCustomProjects = useAppSelector(selectCustomProjects);
  const { report } = useReport();

  const customProjects = preview
    ? previewCustomProjects
    : report?.data
    ? selectCustomProjectsFromReportData(report?.data)
    : [];

  // if we don't have custom projects, redirect to the projects tab
  useEffect(() => {
    if (!preview && report && !report.loading && report.data) {
      const projects = selectCustomProjectsFromReportData(report?.data);

      if (projects && projects.length === 0) {
        router.push(PROJECTS_PROJECT_ROUTE);
      }
    }
  }, [preview, report, router]);

  const emptyState = !preview ? (
    <div className={styles.loadingWrapper}>
      <MoonLoader size={32} color={theme.palette.primary.main} />
    </div>
  ) : (
    <EmptyBlock>No improvements summary available</EmptyBlock>
  );

  return (
    <div className={styles.projectsWrapper}>
      <div className={styles.projectsTitle}>
        <h1 id="improvements-header">Improvements</h1>
        <span id="improvements-report-name" className={styles.projectReportName}>
          <label>Based on report: </label>
          <QuickReportPicker variant="light" />
        </span>
      </div>
      <ProjectTabs />
      <div className={styles.projectsContent}>
        {customProjects && customProjects.length > 0 ? <CustomProjects projects={customProjects ?? []} /> : emptyState}
      </div>
    </div>
  );
};

export default ImprovementsSummary;
