import type { NextPage } from 'next';
import AdminHeader from 'src/components/admin/header';
import ReportSection from 'src/components/admin/report';
import Navigation from 'src/components/navigation';

const Reports: NextPage = () => (
  <Navigation>
    <AdminHeader>
      <ReportSection />
    </AdminHeader>
  </Navigation>
);
export default Reports;
