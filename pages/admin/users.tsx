import type { NextPage } from 'next';
import AdminHeader from 'src/components/admin/header';
import Users from 'src/components/admin/users';
import Navigation from 'src/components/navigation';

const AdminUsers: NextPage = () => (
  <Navigation>
    <AdminHeader>
      <Users />
    </AdminHeader>
  </Navigation>
);
export default AdminUsers;
