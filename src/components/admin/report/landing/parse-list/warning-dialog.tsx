import type { Dispatch, SetStateAction } from 'react';
import { Button, DialogActions, Dialog, DialogContent, DialogTitle } from '@mui/material';
import DialogStyles from 'src/components/admin/context-tab/dialogs/dialogs.module.scss';
import ParseStyles from 'src/components/admin/report/landing/parse-progress-dialog.module.scss';
import type { Parse } from 'src/graphql';

const ParseWarnings = ({
  parse,
  setParse,
}: {
  parse: Parse | null;
  setParse: Dispatch<SetStateAction<Parse | null>>;
}) => {
  return (
    <Dialog
      open={!!parse}
      onClose={() => setParse(null)}
      id="parse-warnings-dialog"
      scroll="paper"
      maxWidth="sm"
      fullWidth={true}
      aria-labelledby="parse-warnings-dialog-title"
    >
      <DialogTitle id="parse-warnings-dialog-title" className={DialogStyles.dialogTitle}>
        Parse Warnings
      </DialogTitle>

      <DialogContent>
        <div id="parse-failure-info" className={ParseStyles.parseWarnings}>
          {parse?.warnings?.map((warn, idx) => (
            <div key={`warning-${idx}`} className={ParseStyles.parseWarning} id={`warning-${idx}`}>
              <pre className={ParseStyles.pre}>{warn}</pre>
            </div>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setParse(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParseWarnings;
