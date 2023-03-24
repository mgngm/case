import QuickReportPicker from 'src/components/header/data-switcher/quick-report-switcher';
import useContextInfo from 'src/hooks/use-context-info';
import useReport from 'src/hooks/use-report';
import EmplyeeInfo from './employee-info';
import styles from './hx-title.module.scss';

const HXTitle = () => {
  const contextInfo = useContextInfo();

  const name = contextInfo.reportContext.meta?.organisationName ?? contextInfo.reportContext.prettyId;
  const { report } = useReport();
  const reportName = report?.data?.reportName;
  const fallback = name || 'Welcome to your';

  return (
    <div className={styles.hxTitle}>
      <span className={styles.orgName} id="report-title-display">
        {reportName ? <QuickReportPicker /> : fallback}
      </span>
      <div className={styles.title}>Human Experience</div>
      <EmplyeeInfo />
    </div>
  );
};

export default HXTitle;
