import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';
import clsx from 'clsx';
import styles from './tooltip-target.module.scss';

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} placement="top-start" />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}));

const TooltipTarget = ({ tooltip }: { tooltip: string }) => {
  return (
    <LightTooltip title={tooltip}>
      <div className={clsx(styles.icon, styles.info)}>
        <InfoOutlinedIcon className={styles.infoOutlineIcon} />
        <InfoIcon className={styles.infoIcon} />
      </div>
    </LightTooltip>
  );
};

export default TooltipTarget;
