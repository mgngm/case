import { useState } from 'react';
import { Visibility, VisibilityOff, Warning } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import { Button, DialogActions, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { MoonLoader } from 'react-spinners';
import styles from 'src/components/admin/preview/preview.module.scss';
import { ParseStatus } from 'src/graphql';
import { useGetParseQuery } from 'src/slices/report';

type ParseStatusProps = {
  parseStatus: ParseStatus | null;
  duStatus: ParseStatus;
  theme: Theme;
  parseId?: string;
};

const ParseStatusIndicator = ({ parseStatus, duStatus, theme, parseId }: ParseStatusProps) => {
  const [warningsOpen, setWarningsOpen] = useState(false);
  const { warnings } = useGetParseQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { id: parseId! },
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

  if (parseStatus === ParseStatus.SUCCESS) {
    return null;
  }

  let icon;
  let parseText;

  if (parseStatus === ParseStatus.IN_PROGRESS) {
    icon = <MoonLoader size={24} color={theme.palette.primary.main} />;
    parseText = 'Re-parse in progress...';
  }

  if (parseStatus === ParseStatus.ERROR) {
    icon = <Warning />;

    if (warnings && warnings.length > 0) {
      let parsedWarnings: string[] = [];

      try {
        parsedWarnings = warnings.map((w: string | null) => (w ? JSON.parse(w).parseError ?? '' : ''));
      } catch (err) {
        // ignore unparsable warnings..
      }

      parseText = (
        <div className={styles.parseFailureWrap}>
          <span>Parse has failed!</span>
          <IconButton id="parse-warning-toggle" onClick={() => setWarningsOpen(!warningsOpen)}>
            {warningsOpen ? (
              <VisibilityOff color="primary" />
            ) : (
              <Visibility color="primary" titleAccess="Show parse warnings" />
            )}
          </IconButton>
          <Dialog open={warningsOpen} onClose={() => setWarningsOpen(false)}>
            <DialogTitle id="parse-warnings-title">Parse warnings</DialogTitle>
            <DialogContent>
              {parsedWarnings.map((warn, idx) => (
                <div key={`warning-${idx}`} className={styles.parseWarning} id={`warning-${idx}`}>
                  <pre>{warn}</pre>
                </div>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setWarningsOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    } else {
      parseText = 'Parse has failed!';
    }
  }

  return (
    <div className={styles.parseInfo}>
      <div className={styles.parseLoading}>{icon}</div>
      <div className={styles.parseState}>
        {parseText}
        {duStatus !== ParseStatus.SUCCESS ? (
          duStatus === ParseStatus.IN_PROGRESS ? (
            <span>DU processing in progress...</span>
          ) : (
            <span>DU Processing has failed!</span>
          )
        ) : null}
      </div>
    </div>
  );
};

export default ParseStatusIndicator;
