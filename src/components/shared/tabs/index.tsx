import Box from '@mui/material/Box';
import styles from './tabs.module.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  padding?: number;
  name: string;
}

export function TabPanel({ children, value, index, padding, name, ...other }: TabPanelProps) {
  return (
    <div
      className={styles.tabContent}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${name}`}
      aria-labelledby={`simple-tab-${name}`}
      {...other}
    >
      {value === index && <Box sx={{ p: padding ?? 3 }}>{children}</Box>}
    </div>
  );
}

export function a11yProps(name: string) {
  return {
    id: `simple-tab-${name}`,
    'aria-controls': `simple-tabpanel-${name}`,
  };
}
