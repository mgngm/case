import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonLoadingIndicator from 'src/components/shared/button/loader';
import Input from 'src/components/shared/input';
import useAutofocus from 'src/hooks/use-autofocus';
import { useDeleteProjectTemplateMutation } from 'src/slices/project-templates';
import type { ProjectTemplate } from 'src/types/projects';
import styles from './index.module.scss';

type DeleteProps = {
  open: boolean;
  onClose: () => void;
  projectTemplate: ProjectTemplate;
};

const DeleteProjectTemplateDialog = ({ open, onClose, projectTemplate }: DeleteProps) => {
  const [confirm, setConfirm] = useState('');
  const [deleteProjectTemplate, deleteRes] = useDeleteProjectTemplateMutation();

  const autofocusRef = useAutofocus(open);

  const handleClose = () => {
    setConfirm('');
    onClose();
  };

  const onClick = async () => {
    try {
      await deleteProjectTemplate({ projectTemplate, context: projectTemplate.context });
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Project Template?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span>
            Are you sure you want to delete {projectTemplate.name} ({projectTemplate.templateId})? This action cannot be
            undone.
          </span>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel} htmlFor="confirm">
              Type &lsquo;delete&rsquo; to continue
            </label>
            <Input ref={autofocusRef} id="confirm" onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} id="delete-project-template-cancel-button">
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          loading={deleteRes.isLoading}
          id="delete-project-template-confirm-button"
          loadingIndicator={<ButtonLoadingIndicator />}
          disabled={confirm !== 'delete'}
          variant="contained"
          color="error"
          onClick={onClick}
        >
          Delete Template
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProjectTemplateDialog;
