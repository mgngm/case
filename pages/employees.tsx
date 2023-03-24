import { clsx } from 'clsx';
import Head from 'next/head';
import Employees from 'src/components/employees';
import Navigation from 'src/components/navigation';
import homeStyles from 'styles/Home.module.scss';

const EmployeesPage = () => {
  return (
    <>
      <Head>
        <title>Actual Experience Portal | Your Employees</title>
      </Head>

      <Navigation>
        {/* table-page is a global scope selector */}
        <div className={clsx([homeStyles.mainContentWrapper, homeStyles.tablePageWrapper, 'table-page'])}>
          <Employees />
        </div>
      </Navigation>
    </>
  );
};

export default EmployeesPage;
