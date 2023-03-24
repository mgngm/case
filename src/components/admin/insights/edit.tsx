import type { ChangeEventHandler, DragEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { skipToken } from '@reduxjs/toolkit/query';
import { formatISO, parseISO } from 'date-fns';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import Input from 'src/components/shared/input';
import DatePicker from 'src/components/shared/input/date-picker';
import FileInput from 'src/components/shared/input/file';
import { useAppDispatch } from 'src/hooks';
import useAutofocus from 'src/hooks/use-autofocus';
import useContextInfo from 'src/hooks/use-context-info';
import {
  createProjectInsight,
  selectInsightById,
  updateProjectInsight,
  useListProjectInsightsByContextQuery,
} from 'src/slices/insights';
import styles from './index.module.scss';

type EditInsightProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

const EditInsight = ({ id, open, onClose }: EditInsightProps) => {
  const dispatch = useAppDispatch();
  const isCreate = id === 'CREATE';
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const contextInfo = useContextInfo();

  const autofocusRef = useAutofocus(open);

  const { existingInsight } = useListProjectInsightsByContextQuery(
    isCreate ? skipToken : { context: contextInfo.adminContext.prettyId as string },
    {
      skip: !contextInfo.adminContext.prettyId,
      selectFromResult: ({ data }) => ({ existingInsight: data && selectInsightById(data.data, id) }),
    }
  );

  useEffect(() => {
    if (existingInsight) {
      setName(existingInsight.name ?? '');
      setDate(parseISO(existingInsight.insightDate ?? ''));
    }
  }, [existingInsight]);

  const handleDrop: DragEventHandler<HTMLLabelElement> = (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const valid = !!(name && date && date.getFullYear() <= 9999 && (file || !isCreate) && (isCreate || existingInsight));

  const handleClose = () => {
    onClose();
    setName('');
    setDate(null);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (valid) {
      setLoading(true);
      try {
        if (isCreate && file && contextInfo.adminContext.prettyId) {
          await dispatch(
            createProjectInsight({
              name,
              date: formatISO(date, { representation: 'date' }),
              file,
              formattedOrgId: contextInfo.adminContext.prettyId,
            })
          ).unwrap();
        } else if (existingInsight && contextInfo.adminContext.prettyId) {
          await dispatch(
            updateProjectInsight({
              id,
              _version: existingInsight._version,
              name,
              date: formatISO(date, { representation: 'date' }),
              s3Key: existingInsight.s3Key,
              fileName: existingInsight.fileName,
              formattedOrgId: contextInfo.adminContext.prettyId,
              ...(file && { file }),
            })
          ).unwrap();
        } else {
          throw new Error('how did you get here');
        }
        handleClose();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isCreate ? 'Create' : 'Edit'} Insight</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="insight-name">
            Name
          </label>
          <Input ref={autofocusRef} id="insight-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="insight-date">
            Date
          </label>
          <DatePicker
            id="insight-date"
            dateFormat="yyyy-MM-dd"
            selected={date}
            onChange={setDate}
            inputProps={{ fullWidth: true }}
          />
        </div>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="insight-file">
            File
          </label>
          <FileInput
            id="insight-file"
            value={file ?? existingInsight?.s3Key ?? undefined}
            onDrop={handleDrop}
            onChange={handleChange}
          >
            Upload insight file
          </FileInput>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} id="cancel-insight">
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          loadingIndicator={<ButtonLoadingIndicator />}
          variant="contained"
          onClick={handleSubmit}
          disabled={!valid}
          id="submit-insight"
        >
          {isCreate ? 'Create' : 'Apply'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditInsight;
