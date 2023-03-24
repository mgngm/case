import QuickReportPicker from 'src/components/header/data-switcher/quick-report-switcher';
// import EmployeeGraphics from './graphics';
import styles from './index.module.scss';
import EmployeeList from './list';

const Employees = () => {
  return (
    <div className={styles.employeesMain}>
      <div className={styles.title}>
        <h1 id="employees-header">Your Employees</h1>
        <span id="employees-report-name" className={styles.employeesReportName}>
          <label>Employees within:</label>
          <QuickReportPicker variant="light" />
        </span>
      </div>
      <EmployeeList />
    </div>
  );
};

export default Employees;
