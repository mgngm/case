import type { NextPage } from 'next';
import AdminHeader from 'src/components/admin/header';
import ProjectTemplates from 'src/components/admin/project-templates';
import Navigation from 'src/components/navigation';

const AdminProjects: NextPage = () => (
  <Navigation>
    <AdminHeader>
      <ProjectTemplates />
    </AdminHeader>
  </Navigation>
);
export default AdminProjects;
