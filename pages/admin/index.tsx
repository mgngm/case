import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ADMIN_REPORTS_ROUTE } from 'src/constants/routes';

const Admin: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    console.log('How did you get here, Steve? Redirecting...');
    router.push(ADMIN_REPORTS_ROUTE);
  }, [router]);

  return null;
};
export default Admin;
