import type { NextPage } from 'next';
import AdminHeader from 'src/components/admin/header';
import Insights from 'src/components/admin/insights';
import Navigation from 'src/components/navigation';

const AdminInsights: NextPage = () => (
  <Navigation>
    <AdminHeader>
      <Insights />
    </AdminHeader>
  </Navigation>
);
export default AdminInsights;
