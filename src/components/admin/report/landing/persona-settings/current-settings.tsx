import { useEffect } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { highlightAll, highlight, languages } from 'prismjs/components/prism-core';
import { MoonLoader } from 'react-spinners';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-twilight.css';
import useContextInfo from 'src/hooks/use-context-info';
import baseAdminStyles from 'styles/Admin.module.scss';

const CodeHighlighting = ({ highlightedCode, language }: { highlightedCode: string; language: string }) => {
  useEffect(() => {
    // highlights the "outer" code block
    highlightAll();
  }, []);
  return (
    <pre>
      <code
        className={`language-${language}`}
        style={{ fontSize: '0.8rem', textShadow: '0 0 black' }}
        // highlighted code is a set of tags, so needs to be set as inner html
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      ></code>
    </pre>
  );
};

const PersonaSettingsDialog = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const contextInfo = useContextInfo();
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="persona-settings-dialog-title"
      aria-describedby="persona-settings-dialog-description"
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle id="persona-settings-dialog-title">Persona Settings</DialogTitle>
      <DialogContent id="persona-settings-dialog-description">
        {contextInfo.loading ? (
          <div className={baseAdminStyles.loadingWrapper}>
            <MoonLoader color={theme.palette.primary.main} size={20} />
          </div>
        ) : (
          <CodeHighlighting
            language="json"
            highlightedCode={`${highlight(
              JSON.stringify(contextInfo.adminContext.meta?.personaSettings ?? '{}', null, 4),
              languages.json
            )}`}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonaSettingsDialog;
