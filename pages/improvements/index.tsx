import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { PROJECTS_SUMMARY_ROUTE } from 'src/constants/routes';

const Improvements: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    console.log('How did you get here, Steve? Redirecting...');
    router.push(PROJECTS_SUMMARY_ROUTE);
  }, [router]);

  return null;
};
export default Improvements;
