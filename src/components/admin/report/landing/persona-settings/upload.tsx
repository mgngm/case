import { useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import FileUploadForm from 'src/components/admin/file-upload-form';
import { USER_CONTEXT_TAG } from 'src/constants/slices';
import { updateOrganisation } from 'src/graphql/mutations';
import { useAppDispatch } from 'src/hooks';
import useContextInfo from 'src/hooks/use-context-info';
import { graphQL } from 'src/logic/client/graphql';
import { baseApi } from 'src/slices/api';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-twilight.css';

const UploadPersonaSettingsDialog = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const contextInfo = useContextInfo();
  const dispatch = useAppDispatch();
  const fileKey = 'personaSettingsJson';

  const [error, setError] = useState('');

  const uploadSettings = async (formData: FormData) => {
    const fileReader = new FileReader();
    const file = formData.get(fileKey);

    if (file) {
      try {
        fileReader.readAsText(file as Blob, 'UTF-8');
        fileReader.onload = async (e) => {
          const content = e?.target?.result;
          if (content && contextInfo.adminContext.id) {
            // update org record with new persona settings
            try {
              await graphQL({
                query: updateOrganisation,
                variables: {
                  input: {
                    id: contextInfo.adminContext.id,
                    _version: contextInfo.adminContext.meta?._version,
                    personaSettings: content as string,
                  },
                },
              });
            } catch (e) {
              console.error(e);
              setError('Could not update Persona Settings');
            }
            dispatch(baseApi.util.invalidateTags([USER_CONTEXT_TAG]));
          } else {
            throw new Error('Cant update org entry, exiting...');
          }
        };
      } catch {
        console.error('Something went wrong with uploading persona settings');
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      id="upload-persona-dialog"
      aria-labelledby="persona-settings-dialog-title"
      aria-describedby="persona-settings-dialog-description"
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle id="persona-settings-dialog-title">Upload Persona Settings</DialogTitle>
      {error}
      <DialogContent id="persona-settings-dialog-description">
        <FileUploadForm
          idPrefix="upload-persona-settings"
          fileFieldName={fileKey}
          uploadFn={uploadSettings}
          label="Upload a new persona settings JSON file:"
        >
          <input hidden name="org-id" value={contextInfo.adminContext.prettyId as string} readOnly />
        </FileUploadForm>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} id="close-persona-settings">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadPersonaSettingsDialog;
