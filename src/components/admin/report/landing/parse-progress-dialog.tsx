import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, useTheme, IconButton } from '@mui/material';
import { MoonLoader } from 'react-spinners';
import { ParseStatus } from 'src/graphql';
import { useGetParseQuery } from 'src/slices/report';
import styles from './parse-progress-dialog.module.scss';

const parseStrings = (
  id: string,
  parseStatus: string,
  {
    warnings,
    warningsOpen,
    setWarningsOpen,
  }: { warnings?: (string | null)[]; warningsOpen: boolean; setWarningsOpen: (f: boolean) => void }
) => {
  let string = '';
  let extra = [];

  switch (parseStatus) {
    case ParseStatus.SUCCESS:
      string = 'Parse has successfully completed, preparing your report preview...';
      break;
    case ParseStatus.UPLOADING:
      string = 'Parse in progress, do not navigate away from this page or you will lose your report upload!';
      break;
    case ParseStatus.ERROR: {
      string = 'Parse failed! Please check your input files and try again';

      if (warnings && warnings.length > 0) {
        try {
          extra = warnings.map((w: string | null) => (w ? JSON.parse(w).parseError ?? '' : ''));
        } catch (err) {
          // ignore unparsable warnings..
        }
      }

      break;
    }
    default:
      string = '';
  }

  return (
    <div className={styles.parseInfo}>
      <div id="parse-message" className={styles.parseDetails}>
        <span>{string}</span>
        {extra.length > 0 ? (
          <>
            <p className={styles.showParseWarningWrap}>
              <IconButton id="parse-warning-toggle" onClick={() => setWarningsOpen(!warningsOpen)}>
                {warningsOpen ? <VisibilityOff /> : <Visibility />}
              </IconButton>{' '}
              {warningsOpen ? 'Hide' : 'Show'} parse failure details
            </p>
            <div id="parse-failure-info" className={styles.parseWarnings} style={{ height: warningsOpen ? 'auto' : 0 }}>
              {extra.map((warn, idx) => (
                <div key={`warning-${idx}`} className={styles.parseWarning} id={`warning-${idx}`}>
                  <pre>{warn}</pre>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
      {id && <span className={styles.parseDetails}>Parse ID: {id}</span>}
    </div>
  );
};

const ParseProgressDialog = ({
  parseId,
  parseStatus,
  close,
}: {
  parseId?: string;
  parseStatus?: ParseStatus;
  close: () => void;
}) => {
  const theme = useTheme();
  const [warningsOpen, setWarningsOpen] = useState(false);
  const { warnings } = useGetParseQuery(
    { id: parseId as string },
    {
      skip: !parseId || parseStatus !== ParseStatus.ERROR,
      selectFromResult: ({ data }) => ({
        warnings: data ? data.data?.warnings ?? [] : [],
      }),
    }
  );

  if (!parseStatus) {
    return null;
  }

  return (
    <Dialog open={true} maxWidth="sm" fullWidth={true} id="processing-report-dialog">
      <DialogTitle id="processing-report-dialog-title">Processing report</DialogTitle>
      <DialogContent className={styles.parseStatus}>
        <div className={styles.parseLoading}>
          <div id="processing-report-dialog-spinner" className={styles.parseLoader}>
            {parseStatus !== ParseStatus.ERROR && <MoonLoader color={theme.palette.primary.main} size={24} />}
          </div>
          {parseStrings(parseId ?? '', parseStatus ?? '', { warnings, warningsOpen, setWarningsOpen })}
        </div>
      </DialogContent>
      {parseStatus === ParseStatus.ERROR ? (
        /* on error, show a close button so user can get away from the dialog */
        <DialogActions>
          <Button onClick={() => close()}>Close</Button>
        </DialogActions>
      ) : null}
    </Dialog>
  );
};

export default ParseProgressDialog;
