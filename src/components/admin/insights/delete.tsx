import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Storage } from 'aws-amplify';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import Input from 'src/components/shared/input';
import useAutofocus from 'src/hooks/use-autofocus';
import useContextInfo from 'src/hooks/use-context-info';
import { getErrorMessageFromRTK } from 'src/slices/api';
import {
  selectInsightById,
  useDeleteProjectInsightMutation,
  useListProjectInsightsByContextQuery,
} from 'src/slices/insights';
import styles from './index.module.scss';

type DeleteInsightProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

const DeleteInsight = ({ id, open, onClose }: DeleteInsightProps) => {
  const [confirm, setConfirm] = useState('');
  const contextInfo = useContextInfo();
  const autofocusRef = useAutofocus(open);
  const { insight } = useListProjectInsightsByContextQuery(
    { context: contextInfo.adminContext.prettyId as string },
    {
      skip: !contextInfo.adminContext.prettyId,
      selectFromResult: ({ data }) => ({
        insight: data && selectInsightById(data.data, id),
      }),
    }
  );
  const [deleteInsightMutation, { isLoading, error }] = useDeleteProjectInsightMutation({
    selectFromResult: ({ isLoading, error }) => ({ isLoading, error }),
  });
  const deleteInsight = async () => {
    if (insight) {
      try {
        const { _version, s3Key } = insight;
        await deleteInsightMutation({ id, _version }).unwrap();
        if (s3Key) {
          await Storage.remove(s3Key);
        }
        onClose();
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleClose = async () => {
    setConfirm('');
    onClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Insight?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span>Are you sure you want to delete this insight? This action cannot be undone.</span>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel} htmlFor="confirm">
              Type &lsquo;delete&rsquo; to continue
            </label>
            <Input id="confirm" ref={autofocusRef} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </DialogContentText>
        {error && <span className={styles.deleteInsightError}>{getErrorMessageFromRTK(error)}</span>}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          loadingIndicator={<ButtonLoadingIndicator />}
          color="error"
          variant="contained"
          disabled={confirm !== 'delete'}
          onClick={deleteInsight}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteInsight;
