import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useRouter } from 'next/router';
import { a11yProps } from 'src/components/shared/tabs';
import {
  ADMIN_INSIGHTS_ROUTE,
  ADMIN_PARTNERS_ORGS_ROUTE,
  ADMIN_PROJECTS_ROUTE,
  ADMIN_REPORTS_ROUTE,
  ADMIN_USERS_ROUTE,
} from 'src/constants/routes';
import { AccessLevel } from 'src/graphql';
import { useAppSelector } from 'src/hooks';
import { selectUserAccessLevel } from 'src/slices/users';
import styles from './tabs.module.scss';

const AdminTabs = () => {
  const router = useRouter();
  const accessLevel = useAppSelector(selectUserAccessLevel);
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={router.pathname} aria-label="admin tabs" className={styles.tabContainer}>
          <Tab
            label="Report"
            {...a11yProps('report')}
            onClick={() => router.push(ADMIN_REPORTS_ROUTE)}
            sx={{ color: 'white' }}
            value={ADMIN_REPORTS_ROUTE}
          />
          <Tab
            label="Insights"
            {...a11yProps('insights')}
            onClick={() => router.push(ADMIN_INSIGHTS_ROUTE)}
            sx={{ color: 'white' }}
            value={ADMIN_INSIGHTS_ROUTE}
          />
          <Tab
            label="Project Templates"
            {...a11yProps('project-templates')}
            sx={{ color: 'white' }}
            onClick={() => router.push(ADMIN_PROJECTS_ROUTE)}
            value={ADMIN_PROJECTS_ROUTE}
          />
          <Tab
            label="User Management"
            {...a11yProps('user-management')}
            sx={{ color: 'white' }}
            onClick={() => router.push(ADMIN_USERS_ROUTE)}
            value={ADMIN_USERS_ROUTE}
          />
          {accessLevel !== AccessLevel.ORGANISATION && (
            <Tab
              label="Partners & Organisations"
              {...a11yProps('partners-and-orgs')}
              sx={{ color: 'white' }}
              onClick={() => router.push(ADMIN_PARTNERS_ORGS_ROUTE)}
              value={ADMIN_PARTNERS_ORGS_ROUTE}
            />
          )}
        </Tabs>
      </Box>
    </Box>
  );
};

export default AdminTabs;
