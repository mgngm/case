import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import userStyles from 'src/components/admin/users/index.module.scss';
import { a11yProps, TabPanel } from 'src/components/shared/tabs';
import type { LocalUser } from 'src/types/user';
import UserContextManagement from './context-management';
import ResetUserPassword from './reset-password';

type UsersProps = {
  open: boolean;
  onClose: () => void;
  user: LocalUser;
};

const EditUser = ({ open, onClose, user }: UsersProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>User Management</DialogTitle>

      <Tabs value={value} onChange={handleChange} aria-label="admin tabs" className={userStyles.tabContainer}>
        <Tab label="Context Management" {...a11yProps('user-context-management')} sx={{ color: 'black' }} />
        <Tab label="Reset Password" {...a11yProps('reset-password')} sx={{ color: 'black' }} />
      </Tabs>

      <TabPanel padding={0} value={value} index={0} name="user-context-management">
        <UserContextManagement user={user} onClose={onClose} tabValue={value} />
      </TabPanel>

      <TabPanel value={value} index={1} padding={0} name="reset-password">
        <ResetUserPassword user={user} onClose={onClose} tabValue={value} />
      </TabPanel>
    </Dialog>
  );
};

export default EditUser;
