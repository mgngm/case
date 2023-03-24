import PageSection from 'src/components/ui/page-section';
import useReport from 'src/hooks/use-report';
import { selectAllReportBlocks } from 'src/slices/dashboard';
import Business from './business';
import Payroll from './payroll';
import Revenue from './revenue';
import Wellbeing from './wellbeing';

const ReportBlocks = () => {
  const { report } = useReport();
  const blocks = selectAllReportBlocks(report?.reportData);
  return (
    <>
      <PageSection title="Key Metrics">
        {blocks?.wellbeingBlockData ? <Wellbeing /> : null}
        {blocks?.payrollBlockData ? <Payroll /> : null}
        {blocks?.businessBlockData ? <Business /> : null}
        {blocks?.revenueBlockData ? <Revenue /> : null}
      </PageSection>
    </>
  );
};

export default ReportBlocks;
