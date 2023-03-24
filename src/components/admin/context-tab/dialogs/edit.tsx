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
import type { Organisation, Partner } from 'src/graphql';
import useAutofocus from 'src/hooks/use-autofocus';
import type { BaseDialogActionProps } from 'src/types/dialogs';
import styles from './dialogs.module.scss';

export enum EditType {
  partner,
  organisation,
}

type EditDialogProps = BaseDialogActionProps<
  [arg: { id: string; name: string; _version: number }],
  { unwrap: () => Promise<unknown> },
  []
> &
  (
    | {
        type: EditType.partner;
        partner: Partner;
        organisation?: never;
      }
    | {
        type: EditType.organisation;
        partner?: never;
        organisation: Organisation;
      }
  );

const EditDialog = ({
  type,
  isOpen,
  handleClose,
  onCancel,
  onSuccess,
  partner,
  organisation,
  onAction,
  isLoading,
  reset,
}: EditDialogProps) => {
  const initialName = (type === EditType.partner ? partner?.partnerName : organisation?.organisationName) ?? '';
  const [name, setName] = useState(initialName);
  const [validationError, setValidationError] = useState('');
  const [error, setError] = useState<unknown | null>(null);
  const close = useCallback(() => {
    setValidationError('');
    setError(null);
    setName(initialName);
    reset?.();
    handleClose();
  }, [handleClose, reset, initialName]);

  const autofocusRef = useAutofocus(isOpen);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="edit-context-dialog-title"
      aria-describedby="edit-context-dialog-description"
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle className={styles.dialogTitle} id="edit-context-dialog-title">
        Update {type === EditType.organisation ? 'Organisation' : 'Partner'}
      </DialogTitle>
      <DialogContent>
        <h3 className={styles.dialogSubtitle}>
          {type === EditType.organisation ? 'Organisation' : 'Partner'} details:
        </h3>
        {error ? (
          <Alert className={styles.alert} severity="error">
            Error: could not update {type === EditType.organisation ? 'organisation' : 'partner'}
          </Alert>
        ) : null}
        {validationError ? (
          <Alert className={styles.alert} severity="warning">
            Validation Error: {validationError}
          </Alert>
        ) : null}
        <DialogContentText className={styles.dialogInner} id="edit-context-dialog-form">
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel} id="edit-context-name-label" htmlFor="name">
              Name:
            </label>
            <Input
              name="name"
              ref={autofocusRef}
              className={styles.inputStyle}
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              id="edit-context-name-field"
              aria-labelledby="edit-context-name-label"
              required
            />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id={`edit-${type === EditType.organisation ? 'org' : 'partner'}-close-button`}
          onClick={onCancel ? onCancel : close}
          variant="outlined"
        >
          Cancel
        </Button>
        <LoadingButton
          id={`edit-${type === EditType.organisation ? 'org' : 'partner'}-confirm-button`}
          loading={isLoading}
          loadingIndicator={<ButtonLoadingIndicator />}
          variant="contained"
          onClick={async (ev) => {
            ev?.preventDefault();

            setValidationError('');

            const validationObj = {
              ['name missing']: name.length > 0,
            };

            if (Object.values(validationObj).every((v) => v)) {
              try {
                if (type === EditType.organisation && organisation) {
                  await onAction({ id: organisation.id, name, _version: organisation._version }).unwrap();
                } else if (type === EditType.partner && partner) {
                  await onAction({ id: partner.id, name, _version: partner._version }).unwrap();
                } else {
                  throw new Error(`Could not edit context type: ${type}`);
                }

                onSuccess?.();
                close();
              } catch (err) {
                console.error(err);
                setError(err);
              }
            } else {
              setValidationError(
                Object.entries(validationObj)
                  .filter(([, res]) => !res)
                  .map(([rule]) => rule)
                  .join(', ')
              );
            }
          }}
          autoFocus
        >
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
