import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import WorstOfficesData from 'src/components/admin/preview/charts/worst-offices-data';
import { a11yProps, TabPanel } from 'src/components/shared/tabs';
import type { DashboardData, WorstOffices } from 'src/types/slices';

const ChartDataDialog = ({
  isOpen,
  handleClose,
  reportText,
}: {
  isOpen: boolean;
  handleClose: (reportText?: string) => void;
  reportText: string;
}) => {
  const [dialogTab, setDialogTab] = useState(0);
  const [reportData, setReportData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!reportText) {
      setReportData(null);
    } else {
      try {
        const report = JSON.parse(reportText);
        setReportData(report);
      } catch (err) {
        console.error(err);
        setReportData(null);
      }
    }
  }, [reportText]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => handleClose()}
      maxWidth="lg"
      fullWidth={true}
      aria-labelledby="chart-data-dialog"
    >
      <DialogTitle>Configure chart data</DialogTitle>
      <DialogContent>
        {reportData ? (
          <>
            <Tabs
              value={dialogTab}
              onChange={(e, tab) => setDialogTab(tab)}
              id="chart-data-tabs"
              aria-label="chart data tabs"
            >
              <Tab label="Worst Offices" {...a11yProps('worst-offices')} />
            </Tabs>
            <TabPanel value={dialogTab} index={0} name="worst-offices">
              <WorstOfficesData
                worstOffices={reportData.worstOffices}
                handleChange={(worstOffices: WorstOffices) => {
                  setReportData({ ...reportData, worstOffices });
                }}
              />
            </TabPanel>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button onClick={() => handleClose(JSON.stringify(reportData))}>Apply and close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChartDataDialog;
