import type { ReactNode } from 'react';
import type { NoInfer } from '@aws-amplify/ui';
import { Close, Undo } from '@mui/icons-material';
import type { DrawerProps } from '@mui/material';
import { Tab, Tabs, useControlled, IconButton, Drawer } from '@mui/material';
import clsx from 'clsx';
import styles from './side-panel.module.scss';

export type SidePanelProps = {
  heading: ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClose?: (e: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'closeIconClick' | 'backIconClick') => void;
  back?: boolean;
};

const SidePanel = ({
  heading,
  children,
  className,
  onClose,
  back,
  ...props
}: SidePanelProps & Omit<DrawerProps, keyof SidePanelProps>) => (
  <Drawer
    anchor="right"
    onClose={onClose}
    {...props}
    classes={{ paper: styles.paper }}
    className={clsx(styles.drawer, className)}
  >
    <div className={styles.header}>
      <h3 className={styles.heading}>{heading}</h3>
      <IconButton className={styles.closeButton} onClick={(e) => onClose?.(e, 'closeIconClick')}>
        {back ? <Undo /> : <Close />}
      </IconButton>
    </div>
    {children}
  </Drawer>
);

export default SidePanel;

type SidePanelTabsProps<Tab extends string> = {
  tabs: Record<Tab, ReactNode>;
  tab?: NoInfer<Tab>;
  defaultTab?: NoInfer<Tab>;
  onTabChange?: (tab: NoInfer<Tab>) => void;
  labels?: Partial<Record<NoInfer<Tab>, ReactNode>>;
};

export const SidePanelTabs = <Tab extends string>({
  tabs,
  labels,
  tab,
  defaultTab,
  onTabChange,
}: SidePanelTabsProps<Tab>) => {
  const [_tab, setTab] = useControlled({ controlled: tab, default: defaultTab, name: 'SidePanelTabs', state: 'tab' });
  return (
    <>
      <Tabs
        value={_tab}
        classes={{
          flexContainer: styles.flexContainer,
          indicator: styles.indicator,
        }}
        className={styles.tabs}
        onChange={(e, tab) => {
          setTab(tab);
          onTabChange?.(tab);
        }}
      >
        {Object.keys(tabs).map((key) => (
          <Tab key={key} label={labels?.[key as Tab] ?? key} value={key} className={styles.tab} />
        ))}
      </Tabs>
      {tabs[_tab]}
    </>
  );
};
