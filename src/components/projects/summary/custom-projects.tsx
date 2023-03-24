import { useState } from 'react';
import { VisibilityOutlined, Assessment } from '@mui/icons-material';
import { ButtonBase } from '@mui/material';
import clsx from 'clsx';
import type { ProjectBodyContent } from 'src/components/projects/improvements/project-body';
import ProjectBody from 'src/components/projects/improvements/project-body';
import SidePanel from 'src/components/shared/drawer/side-panel';
import type { CustomProject } from 'src/types/projects';
import styles from './custom-projects.module.scss';

const CustomProjects = ({ projects }: { projects: CustomProject[] }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState<ProjectBodyContent | null>(null);

  return (
    <>
      {projects?.map(({ title, body: bodyText, keyMetrics, charts }, idx) => (
        <ButtonBase
          component="div"
          onClick={() => {
            setBody({
              bodyText,
              keyMetrics,
              charts,
            });
            setHeading(title);
            setDrawerOpen(true);
          }}
          key={`${idx}-${title}`}
          classes={{
            root: clsx(styles.customProject, heading === title && body?.bodyText === bodyText && styles.selected),
          }}
        >
          <span className={styles.eyeIcon}>
            <VisibilityOutlined />
          </span>
          <span className={styles.customProjectIcon}>
            <Assessment />
          </span>
          <span className={styles.customProjectName}>{title}</span>
        </ButtonBase>
      ))}
      <SidePanel
        heading={heading}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setHeading('');
          setBody(null);
        }}
      >
        {body ? <ProjectBody body={body} /> : null}
      </SidePanel>
    </>
  );
};

export default CustomProjects;
