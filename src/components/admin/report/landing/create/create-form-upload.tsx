import type {
  ChangeEventHandler,
  Dispatch,
  DragEventHandler,
  FormEventHandler,
  ReactNode,
  SetStateAction,
} from 'react';
import { useRef, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import styles from 'src/components/admin/file-upload-form.module.scss';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import FileInput from 'src/components/shared/input/file';
import { CSV_MIME_TYPES } from 'src/constants/mime';
import {
  KEY_SITES_CSV_FILE_KEY,
  PERSONA_SETTINGS_FILE_KEY,
  PROJECT_CSV_FILE_KEY,
  REPORT_CSV_FILE_KEY,
  UPGRADING_SITES_CSV_FILE_KEY,
} from 'src/constants/report';
import { useAppDispatch } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';
import { resetPreview } from 'src/slices/preview';
import { uploadReportCsv } from 'src/slices/report';
import createStyles from './create-form.module.scss';

type FileUploadFormProps = {
  children?: ReactNode;
  footer?: ReactNode;
  onSuccess?: ({ parseId }: { parseId: string }) => void;
  onClose: () => void;
  disableUpload?: boolean;
};

const CreateReportFileUploadForm = ({ children, footer, onSuccess, onClose, disableUpload }: FileUploadFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const [reportFile, setReportFile] = useState<File | undefined>(undefined);
  const [projectFile, setProjectFile] = useState<File | undefined>(undefined);
  const [keySitesFile, setKeySitesFile] = useState<File | undefined>(undefined);
  const [upgradingSitesFile, setUpgradingSitesFile] = useState<File | undefined>(undefined);

  const contextInfo = useContextInfo();

  const handleDrop =
    (setter: Dispatch<SetStateAction<File | undefined>>): DragEventHandler<HTMLLabelElement> =>
    (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setter(e.dataTransfer.files[0]);
      }
    };
  const handleChange =
    (setter: Dispatch<SetStateAction<File | undefined>>): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      setSuccess(false);
      setError('');
      setUploading(false);
      if (e.target.files && e.target.files[0]) {
        setter(e.target.files[0]);
      }
    };

  const dispatch = useAppDispatch();
  const uploadReport = async (formData: FormData) => {
    // clear preview state
    dispatch(resetPreview());
    // upload the report
    return await dispatch(uploadReportCsv(formData)).unwrap();
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (formRef?.current && reportFile && projectFile) {
      // validate form
      const reportFormIsValid = formRef.current.reportValidity();

      if (!contextInfo.adminContext.meta?.personaSettings) {
        setError('Could not find persona settings on the org');
        console.log('Could not find persona settings on the org', contextInfo.adminContext);
        return;
      }

      if (!reportFormIsValid) {
        setError('The report form is invalid');
        console.log('The report form is invalid', reportFormIsValid);
        return;
      }

      const formData = new FormData(formRef?.current);

      setError('');
      setSuccess(false);

      formData.set(REPORT_CSV_FILE_KEY, reportFile);
      formData.set(PROJECT_CSV_FILE_KEY, projectFile);
      formData.set(PERSONA_SETTINGS_FILE_KEY, JSON.stringify(contextInfo?.adminContext?.meta?.personaSettings));

      if (keySitesFile) {
        formData.set(KEY_SITES_CSV_FILE_KEY, keySitesFile);
      }

      if (upgradingSitesFile) {
        formData.set(UPGRADING_SITES_CSV_FILE_KEY, upgradingSitesFile);
      }

      if (!(formData.get(REPORT_CSV_FILE_KEY) as File).size) {
        setError('No input file selected');
        setUploading(false);
        return;
      }

      if (!(formData.get(PROJECT_CSV_FILE_KEY) as File).size) {
        setError('No project file selected');
        setUploading(false);
        return;
      }

      setUploading(true);

      try {
        // Subscribe to creation of report
        // const subscription = await graphQLSubscription({ query: onCreateReport }).subscribe({
        //   next: ({ provider, value }) => console.log({ provider, value }),
        //   error: (error) => console.warn(error),
        // });
        const { error, parseId } = await uploadReport(formData);

        if (error) {
          console.log('Something went wrong triggering the parse.');
        } else {
          setError('');
          setSuccess(true);
          onSuccess?.({ parseId });
        }
      } catch (err) {
        console.error('err', err);
        // @ts-expect-error casting errors ooOOOooooOOOoooo
        setError(`${err?.errors[0]?.message ?? err?.name}`);
      } finally {
        setReportFile(undefined);
        setProjectFile(undefined);
        setUploading(false);
      }
    }
  };

  return (
    <form className={createStyles.createForm} onSubmit={handleSubmit} ref={formRef}>
      {children}
      <div className={createStyles.fileInputWrapper}>
        <h3>Input Files:</h3>
        <div className={createStyles.fileInputs}>
          <div className={createStyles.fileInputSingle}>
            <label htmlFor={REPORT_CSV_FILE_KEY}>Input CSV:</label>
            <FileInput
              className={styles.fileInput}
              id={REPORT_CSV_FILE_KEY}
              name={REPORT_CSV_FILE_KEY}
              accept={CSV_MIME_TYPES.join(',')}
              onDrop={handleDrop(setReportFile)}
              onChange={handleChange(setReportFile)}
              value={reportFile}
            >
              Upload analytic csv
            </FileInput>
          </div>
          <div className={createStyles.fileInputSingle}>
            <label htmlFor={PROJECT_CSV_FILE_KEY}>Project CSV:</label>
            <FileInput
              id={PROJECT_CSV_FILE_KEY}
              name={PROJECT_CSV_FILE_KEY}
              accept={CSV_MIME_TYPES.join(',')}
              className={styles.fileInput}
              onDrop={handleDrop(setProjectFile)}
              onChange={handleChange(setProjectFile)}
              value={projectFile}
            >
              Upload project csv
            </FileInput>
          </div>
        </div>
        <div className={createStyles.fileInputWrapper}>
          <h4>Optional inputs</h4>
          <FileInput
            id={KEY_SITES_CSV_FILE_KEY}
            name={KEY_SITES_CSV_FILE_KEY}
            accept={CSV_MIME_TYPES.join(',')}
            className={styles.fileInput}
            onDrop={handleDrop(setKeySitesFile)}
            onChange={handleChange(setKeySitesFile)}
            value={keySitesFile}
            variant="slim"
          >
            Upload key sites csv
          </FileInput>
          <FileInput
            id={UPGRADING_SITES_CSV_FILE_KEY}
            name={UPGRADING_SITES_CSV_FILE_KEY}
            accept={CSV_MIME_TYPES.join(',')}
            className={styles.fileInput}
            onDrop={handleDrop(setUpgradingSitesFile)}
            onChange={handleChange(setUpgradingSitesFile)}
            value={upgradingSitesFile}
            variant="slim"
          >
            Upload upgrading sites csv
          </FileInput>
        </div>
      </div>
      {footer}
      {success ? (
        <p className={styles.success}>
          <CheckCircleIcon />
          File uploaded successfully!
        </p>
      ) : null}
      {error ? (
        <p className={styles.error}>
          <ErrorIcon />
          Error uploading file: <div>{error}</div>
        </p>
      ) : null}
      <div className={createStyles.submit}>
        <Button id="create-report-close-button" variant="outlined" onClick={onClose}>
          Close
        </Button>
        <LoadingButton
          type="submit"
          id="create-report-upload-button"
          variant="contained"
          loading={uploading}
          loadingIndicator={<ButtonLoadingIndicator />}
          className={styles.fileSubmitButton}
          disabled={disableUpload}
        >
          Upload
        </LoadingButton>
      </div>
    </form>
  );
};

export default CreateReportFileUploadForm;
