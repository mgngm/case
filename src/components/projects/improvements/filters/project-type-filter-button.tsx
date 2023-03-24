import type { ReactNode } from 'react';
import { FilterAlt } from '@mui/icons-material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AppsIcon from '@mui/icons-material/Apps';
import HomeIcon from '@mui/icons-material/Home';
import HubIcon from '@mui/icons-material/Hub';
import { Button } from '@mui/material';
import clsx from 'clsx';
import { ProjectType } from 'src/graphql';
import styles from './filter-button.module.scss';
import styleExports from 'styles/_exports.module.scss';

const icons: Record<ProjectType, ReactNode> = {
  [ProjectType.APPLICATION]: <AppsIcon />,
  [ProjectType.NETWORK_REMOTE]: <HomeIcon />,
  [ProjectType.NETWORK_OFFICE]: <ApartmentIcon />,
  [ProjectType.WIDER_NETWORK]: <HubIcon />,
};

const ids: Record<ProjectType, string> = {
  [ProjectType.APPLICATION]: 'application',
  [ProjectType.NETWORK_REMOTE]: 'network-remote',
  [ProjectType.NETWORK_OFFICE]: 'network-office',
  [ProjectType.WIDER_NETWORK]: 'wider-network',
};

const name: Record<ProjectType, string> = {
  [ProjectType.APPLICATION]: 'Application',
  [ProjectType.NETWORK_REMOTE]: 'Network (remote)',
  [ProjectType.NETWORK_OFFICE]: 'Network (office)',
  [ProjectType.WIDER_NETWORK]: 'Wider Network',
};

const ProjectTypeFilterButton = ({
  projectType,
  projectCount,
  onClick,
  selected,
}: {
  projectType: ProjectType;
  projectCount: number;
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <Button
      className={styles.projectTypeFilterButton}
      id={`status-filter-button-${ids[projectType]}`}
      variant="outlined"
      startIcon={<FilterAlt />}
      sx={(theme) => ({
        ...theme.mixins.lightTheme.button({
          selected,
          accentColor: styleExports.lightThemeButtonIconColor,
        }),
        justifyContent: 'flex-start',
      })}
      onClick={onClick}
    >
      <div className={styles.buttonInner}>
        <div className={styles.innerIcon}>{icons[projectType]}</div>
        <div className={clsx([styles.innerTextWrap, selected && styles.selected])}>
          <span>{name[projectType]}</span>
          <span className={styles.innerTextSubtitle}>
            Projects: <span className={styles.innerProjectCount}>{projectCount}</span>
          </span>
        </div>
      </div>
    </Button>
  );
};

export default ProjectTypeFilterButton;
