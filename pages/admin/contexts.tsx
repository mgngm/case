import type { NextPage } from 'next';
import Context from 'src/components/admin/context-tab';
import AdminHeader from 'src/components/admin/header';
import Navigation from 'src/components/navigation';

const AdminContext: NextPage = () => (
  <Navigation>
    <AdminHeader>
      <Context />
    </AdminHeader>
  </Navigation>
);
export default AdminContext;
