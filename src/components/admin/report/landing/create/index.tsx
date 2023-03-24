import { useState } from 'react';
import { useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/router';
import { MoonLoader } from 'react-spinners';
import DialogStyles from 'src/components/admin/context-tab/dialogs/dialogs.module.scss';
import styles from 'src/components/admin/report/landing/landing.module.scss';
import LeversInputs from 'src/components/admin/report/levers';
import Input from 'src/components/shared/input';
import DatePicker from 'src/components/shared/input/date-picker';
import { ADMIN_REPORTS_ROUTE } from 'src/constants/routes';
import useAutofocus from 'src/hooks/use-autofocus';
import useContextInfo from 'src/hooks/use-context-info';
import CreateReportFileUploadForm from './create-form-upload';

const CreateReport = ({
  personaSettings,
  loading,
  open,
  onClose,
}: {
  personaSettings: boolean;
  loading: boolean;
  open: boolean;
  onClose: () => void;
}) => {
  const contextInfo = useContextInfo();
  const theme = useTheme();
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(new Date());

  const autofocusRef = useAutofocus(open);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      id="create-report-dialog"
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
      aria-labelledby="create-report-dialog-title"
    >
      <DialogTitle id="create-report-dialog-title" className={DialogStyles.dialogTitle}>
        Create New Report
      </DialogTitle>
      {loading ? (
        <div className={styles.loadingWrapper}>
          <MoonLoader color={theme.palette.primary.main} />
        </div>
      ) : personaSettings ? (
        <DialogContent>
          <CreateReportFileUploadForm
            onSuccess={async ({ parseId }) => {
              if (parseId) {
                onClose();
                router.push(`${ADMIN_REPORTS_ROUTE}?parseId=${parseId}&newReport=true`); //Takes us to the landing page but tells it to check for a parse.
              } else {
                console.error('Something went wrong!');
              }
            }}
            footer={
              <>
                <h3>Settings</h3>
                <LeversInputs />
              </>
            }
            onClose={onClose}
            disableUpload={!date || date.getFullYear() > 9999}
          >
            <input hidden name="org-id" value={contextInfo.adminContext.prettyId as string} readOnly />
            <div className={styles.nameWrapper}>
              <label htmlFor="report-name">Name:</label>
              <Input
                id="report-name"
                name="name"
                ref={autofocusRef}
                defaultValue={contextInfo.adminContext.prettyId as string}
              />
            </div>
            <div className={styles.dateWrapper}>
              <label htmlFor="report-date">Date:</label>
              <DatePicker
                id="report-date"
                name="date"
                dateFormat="yyyy-MM-dd"
                selected={date}
                onChange={(date) => setDate(date)}
              />
            </div>
          </CreateReportFileUploadForm>
        </DialogContent>
      ) : (
        <p className={styles.noSettings}>
          In order to create a report Persona Settings must exist, please use the{' '}
          <span>Upload persona settings file</span> form to upload a Persona Settings json file.
        </p>
      )}
    </Dialog>
  );
};

export default CreateReport;
