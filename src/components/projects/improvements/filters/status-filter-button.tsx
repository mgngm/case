import type { ReactNode } from 'react';
import { FilterAlt } from '@mui/icons-material';
import ArchiveIcon from '@mui/icons-material/Archive';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Button } from '@mui/material';
import type { DataType } from 'csstype';
import { ImprovementStatus } from 'src/components/projects/improvements/table';
import styleExports from 'styles/_exports.module.scss';

const icons: Record<ImprovementStatus, ReactNode> = {
  [ImprovementStatus.NOT_STARTED]: <FormatListNumberedIcon />,
  [ImprovementStatus.IN_PROGRESS]: <PublishedWithChangesIcon />,
  [ImprovementStatus.ON_HOLD]: <DoNotDisturbIcon />,
  [ImprovementStatus.COMPLETED]: <CheckCircleOutlineIcon />,
  [ImprovementStatus.ARCHIVED]: <ArchiveIcon />,
};

const colors: Partial<Record<ImprovementStatus, DataType.Color>> = {
  [ImprovementStatus.IN_PROGRESS]: styleExports.frustratedDark,
  [ImprovementStatus.ON_HOLD]: styleExports.sufferingDark,
  [ImprovementStatus.COMPLETED]: styleExports.satisfiedDark,
  [ImprovementStatus.ARCHIVED]: styleExports.lightThemeSubtitle,
};

const ids: Record<ImprovementStatus, string> = {
  [ImprovementStatus.NOT_STARTED]: 'not-started',
  [ImprovementStatus.IN_PROGRESS]: 'in-progress',
  [ImprovementStatus.ON_HOLD]: 'on-hold',
  [ImprovementStatus.COMPLETED]: 'completed',
  [ImprovementStatus.ARCHIVED]: 'archived',
};

const StatusFilterButton = ({
  projectStatus,
  projectCount,
  onClick,
  selected,
}: {
  projectStatus: ImprovementStatus;
  projectCount: number;
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <Button
      id={`status-filter-button-${ids[projectStatus]}`}
      variant="outlined"
      startIcon={icons[projectStatus] ?? <FilterAlt />}
      endIcon={'(' + projectCount + ')'}
      sx={(theme) => theme.mixins.lightTheme.button({ selected, accentColor: colors[projectStatus] })}
      onClick={onClick}
    >
      {projectStatus}
    </Button>
  );
};

export default StatusFilterButton;
