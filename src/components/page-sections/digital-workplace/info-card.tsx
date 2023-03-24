import { forwardRef } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';
import clsx from 'clsx';
import { formatCount, round } from 'src/logic/libs/helpers';
import ChartDonut from './donut';
import styles from './info-card.module.scss';

interface InfoCardProps {
  id: string;
  title: string;
  value: number;
  total?: number;
  color?: string;
  tooltip?: string;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} placement="top-start" />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}));

const InfoCard = forwardRef<HTMLDivElement, InfoCardProps>(({ title, value, color, id, total, tooltip }, ref) => {
  const t = total || 1;
  return (
    <div ref={ref} id={id} className={styles.infoCard}>
      <div className={styles.title}>{title}</div>

      <div className={styles.text}>{formatCount(value || 0)}</div>
      {value > 0 && t > value && (
        <div className={styles.donut}>
          <ChartDonut series={round((value / t) * 100, 1)} color={color ?? 'red'} />
        </div>
      )}
      {tooltip && (
        <LightTooltip title={tooltip}>
          <div className={clsx(styles.icon, styles.info)}>
            <InfoOutlinedIcon className={styles.infoOutlineIcon} />
            <InfoIcon className={styles.infoIcon} />
          </div>
        </LightTooltip>
      )}
    </div>
  );
});

InfoCard.displayName = 'InfoCard';

export default InfoCard;
