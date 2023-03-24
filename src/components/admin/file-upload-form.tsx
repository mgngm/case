import type { ChangeEventHandler, DragEventHandler, MouseEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import LoadingButton from '@mui/lab/LoadingButton';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import FileInput from 'src/components/shared/input/file';
import type { ResponseData } from 'src/types/api';
import type { ReportData } from 'src/types/report';
import styles from './file-upload-form.module.scss';

type FileUploadFormProps = {
  label?: string;
  uploadFn?: (formData: FormData) => Promise<unknown>;
  idPrefix: string;
  fileTypes?: string[];
  children?: ReactNode;
  footer?: ReactNode;
  onSuccess?: (json: ResponseData) => void;
  fileFieldName: string;
};

const FileUploadForm = ({
  label,
  idPrefix,
  fileTypes = ['text/json', 'application/json'],
  uploadFn,
  children,
  footer,
  onSuccess,
  fileFieldName,
}: FileUploadFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);

  const fieldId = idPrefix + '-field';

  const handleDrop: DragEventHandler<HTMLLabelElement> = (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSuccess(false);
    setError('');
    setUploading(false);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submitFile = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }

    if (formRef?.current && file) {
      // validate form
      const formIsValid = formRef.current.reportValidity();

      if (!formIsValid) {
        return false;
      }

      const formData = new FormData(formRef?.current);
      setError('');
      setSuccess(false);

      formData.set(fileFieldName, file);

      formData.delete(fieldId);

      if (!(formData.get(fileFieldName) as File).size) {
        setError('No file selected');
        setUploading(false);
        return;
      }

      if (uploadFn) {
        setUploading(true);
        try {
          const data = await (uploadFn(formData) as Promise<{ data: ReportData }>);

          if (error) {
            setError(error);
          } else {
            setError('');
            setSuccess(true);
            onSuccess?.({ data } as ResponseData);
          }
        } catch (err) {
          console.error(err);
          setError(`${err}`);
        } finally {
          setFile(undefined);
          setUploading(false);
        }
      } else {
        console.log('Something went wrong, no upload function defined.');
      }
    }
  };

  return (
    <form ref={formRef}>
      {children}
      <label htmlFor={fieldId}>{label}</label>
      <FileInput
        id={fieldId}
        name={fieldId}
        accept={fileTypes.join(',')}
        className={styles.fileInput}
        onDrop={handleDrop}
        onChange={handleChange}
        value={file}
      >
        Upload file
      </FileInput>
      {footer}
      {success ? (
        <p className={styles.success} id={idPrefix + '-success'}>
          <CheckCircleIcon />
          File Uploaded successfully!
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} id={idPrefix + '-error'}>
          <ErrorIcon />
          Error uploading file<div>{error}</div>
        </p>
      ) : null}
      <LoadingButton
        onClick={submitFile}
        variant="contained"
        loading={uploading}
        loadingIndicator={<ButtonLoadingIndicator />}
        id={idPrefix + '-upload'}
        className={styles.fileSubmitButton}
      >
        Upload
      </LoadingButton>
    </form>
  );
};

export default FileUploadForm;
