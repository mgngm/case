import { useCallback, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import Input from 'src/components/shared/input';
import { DeleteType } from 'src/constants/api';
import type { Organisation, Partner } from 'src/graphql';
import { useAppDispatch } from 'src/hooks';
import useAutofocus from 'src/hooks/use-autofocus';
import { deleteContext } from 'src/logic/client/cleanup';
import type { BaseDialogProps } from 'src/types/dialogs';
import styles from './dialogs.module.scss';

interface ConfirmProps extends BaseDialogProps {
  type: DeleteType;
  isOpen: boolean;
  id: string;
  displayName: string;
  contextInfo: Partner | Organisation;
}

const ConfirmDeleteDialog = ({ type, isOpen, handleClose, id, contextInfo, displayName }: ConfirmProps) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<unknown | null>(null);
  const [confirm, setConfirm] = useState('');

  const [loading, setLoading] = useState(false);

  const close = useCallback(() => {
    setConfirm('');
    handleClose();
  }, [handleClose, setConfirm]);

  const autofocusRef = useAutofocus(isOpen);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm delete {type}</DialogTitle>
      <DialogContent>
        {error ? <Alert severity="error">Error - could not delete {type}</Alert> : null}
        <DialogContentText id="alert-dialog-description">
          <span>
            {`Are you sure you want to delete ${
              type === DeleteType.organisation ? 'organisation' : 'partner'
            }: ${displayName}?`}
          </span>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel} htmlFor="confirm">
              Type &lsquo;delete&rsquo; to continue
            </label>
            <Input
              ref={autofocusRef}
              id={`confirm-delete-${type === DeleteType.organisation ? 'org' : 'partner'}-field`}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id={`delete-${type === DeleteType.organisation ? 'org' : 'partner'}-close-button`}
          variant="outlined"
          onClick={close}
        >
          Cancel
        </Button>
        <LoadingButton
          id={`delete-${type === DeleteType.organisation ? 'org' : 'partner'}-confirm-button`}
          loading={loading}
          disabled={confirm !== 'delete'}
          loadingIndicator={<ButtonLoadingIndicator />}
          variant="contained"
          color="error"
          onClick={async () => {
            setLoading(true);
            try {
              //Delete from dynamo
              if (id) {
                await dispatch(
                  deleteContext({
                    id,
                    deleteType: type,
                    context: contextInfo,
                  })
                );
                close();
              } else {
                setError('No id provided');
              }
            } catch (error) {
              console.error(error);
              setError(error);
            } finally {
              setLoading(false);
            }
          }}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
