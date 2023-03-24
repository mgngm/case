import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminContextSelect from 'src/components/admin/context';
import AdminTabs from 'src/components/admin/tabs';
import { ADMIN_PREVIEW_ROUTE, ADMIN_ROUTE } from 'src/constants/routes';
import styles from 'styles/Admin.module.scss';

const headerTitles: Record<string, string> = {
  [ADMIN_ROUTE]: 'Admin',
  [ADMIN_PREVIEW_ROUTE]: 'Report Preview',
};

type HeaderProps = {
  children: ReactNode;
};

const AdminHeader = ({ children }: HeaderProps) => {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <Head>
        <title>Report admin</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.adminHeader}>
          <h1 id="admin-title">{headerTitles[router.pathname] ?? 'Admin'}</h1>
          <AdminContextSelect />
        </div>
        {router.pathname !== ADMIN_PREVIEW_ROUTE ? <AdminTabs /> : null}
        <div className={styles.adminPanelContent}>{children}</div>
      </main>
    </div>
  );
};

export default AdminHeader;
