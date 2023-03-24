import type { ChangeEventHandler, Dispatch, DragEventHandler, SetStateAction } from 'react';
import { useCallback, useState, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Storage } from 'aws-amplify';
import download from 'downloadjs';
import { MoonLoader } from 'react-spinners';
import FileInput from 'src/components/shared/input/file';
import { CSV_MIME_TYPES } from 'src/constants/mime';
import { PROJECT_CSV_FILE_KEY } from 'src/constants/report';
import styles from './upload.module.scss';

const ProjectUploadDialog = ({
  open,
  onClose,
  inputProjectCsv,
  regenerateTrigger,
}: {
  open: boolean;
  onClose: () => void;
  inputProjectCsv: string;
  regenerateTrigger: (csvKey: string) => Promise<void>;
}) => {
  const [uploading, setUploading] = useState(false);
  const [, setSuccess] = useState(false);
  const [, setError] = useState('');
  const [projectFile, setProjectFile] = useState<File | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);
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

  const clear = useCallback(() => {
    setProjectFile(undefined);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    setUploading(false);
    setError('');
    setSuccess(false);
  }, [fileRef]);

  const handleClose = useCallback(() => {
    onClose();
    clear();
  }, [onClose, clear]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="project-upload-title"
      aria-describedby="project-upload-description"
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
      className={styles.projectUploadDialog}
    >
      <DialogTitle id="project-upload-title" className={styles.title}>
        Replace Project File
        <IconButton sx={{ color: 'white' }} className={styles.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.createProjectDialog}>
        <div>
          <h3>Current projects</h3>
          <Button
            id="download-project-csv-btn"
            variant="outlined"
            className={styles.downloadBtn}
            endIcon={<FileDownloadIcon />}
            onClick={async () => {
              const result = await Storage.get(inputProjectCsv, { download: true });
              download(result.Body as Blob, 'projects.csv');
            }}
          >
            Download
          </Button>
        </div>
        <div>
          <h3>Upload projects</h3>
          <Alert severity="warning" sx={{ alignItems: 'center' }}>
            <h3>Warning</h3>
            Uploading new projects will replace the current set of projects for this report and regenerate all data.
            <p>This happens even if you do not publish your changes and is not reversable.</p>
          </Alert>
          <div className={styles.fileInputSingle}>
            <FileInput
              id={PROJECT_CSV_FILE_KEY}
              name={PROJECT_CSV_FILE_KEY}
              accept={CSV_MIME_TYPES.join(',')}
              className={styles.fileInput}
              onDrop={handleDrop(setProjectFile)}
              onChange={handleChange(setProjectFile)}
              value={projectFile}
              ref={fileRef}
            >
              Upload Project CSV
            </FileInput>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} variant="contained" id="cancel-project-upload-btn">
          Cancel
        </Button>
        <Button
          id="upload-project-file-btn"
          onClick={async () => {
            setUploading(true);

            const now = Date.now();
            const oneHour = 1000 * 60 * 60;

            try {
              const { key } = await Storage.put(inputProjectCsv, projectFile, {
                contentType: 'text/csv',
                expires: new Date(now + oneHour),
              });

              // start regeneration
              await regenerateTrigger(key);
            } catch (err) {
              console.error(err);
              setSuccess(false);
              setError('Error uploading file');
            } finally {
              handleClose();
            }
          }}
          disabled={!projectFile}
          variant="contained"
          sx={{
            display: 'inline-flex',
            textAlign: uploading ? 'left' : 'center',
          }}
        >
          {uploading ? <MoonLoader size={20} /> : <span>Upload</span>}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectUploadDialog;
