import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useState } from 'react';
import { BarChart } from '@mui/icons-material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import { highlight, languages } from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-dark.css';
import ChartDataDialog from 'src/components/admin/preview/charts/chart-data-dialog';
import { alignHeight, setEditorText } from 'src/components/admin/preview/helpers';
import styles from 'src/components/admin/preview/preview.module.scss';
import type { PreviewAccordion } from 'src/constants/report';
import { REPORT_ACCORDION } from 'src/constants/report';
import exports from 'styles/_exports.module.scss';

const editorStyles = {
  fontFamily: exports.adminCodeFont,
  fontSize: exports.adminCodeSize,
  background: exports.adminCodeBackground,
};

type ReportEditorProps = {
  reportText: string;
  setReportText: Dispatch<SetStateAction<string>>;
  toggleAccordion: (x: PreviewAccordion) => void;
  isAccordionClosed: (x: PreviewAccordion) => boolean;
  isAccordionOpen: (x: PreviewAccordion) => boolean;
  focusJson: () => void;
  applyChanges: (json?: string, settings?: string) => void;
  setErrorTitle: Dispatch<SetStateAction<string>>;
  setErrorText: Dispatch<SetStateAction<string>>;
  jsonEditorRef: MutableRefObject<{
    _input: HTMLTextAreaElement;
  } | null>;
};

const ReportEditor = ({
  reportText,
  setReportText,
  toggleAccordion,
  isAccordionClosed,
  isAccordionOpen,
  focusJson,
  jsonEditorRef,
  applyChanges,
  setErrorText,
  setErrorTitle,
}: ReportEditorProps) => {
  const [chartDialogOpen, setChartDialogOpen] = useState(false);

  return (
    <>
      <div
        className={styles.accordion}
        id="report-accordion"
        onClick={() => {
          toggleAccordion(REPORT_ACCORDION);
          // if we're opening the report, focus the json
          if (isAccordionOpen(REPORT_ACCORDION)) {
            focusJson();
          }
        }}
      >
        <div className={styles.accordionTitle}>Report Data</div>
        <KeyboardArrowUpIcon
          className={clsx(styles.accordionArrow, isAccordionClosed(REPORT_ACCORDION) && styles.accordionClosed)}
        />
      </div>
      <div className={clsx(styles.accordionContent, isAccordionClosed(REPORT_ACCORDION) && styles.accordionClosed)}>
        <div className={styles.reportConfigWrap}>
          <Button
            id="chart-config-btn"
            className={styles.chartConfigBtn}
            variant="outlined"
            startIcon={<BarChart />}
            onClick={() => setChartDialogOpen(true)}
          >
            Configure chart data
          </Button>
        </div>
        <Editor
          value={reportText}
          // @ts-expect-error Editor does not expose its underlying html elements in its LegacyRef type, so I've had to
          // create a new type to access them { _input: HTMLTextAreaElement }
          ref={jsonEditorRef}
          onValueChange={(text) => setReportText(text)}
          highlight={(code) => highlight(code, languages.json)}
          padding={10}
          className={styles.jsonEditor}
          style={editorStyles}
          textareaClassName={styles.jsonTextarea}
          textareaId="json-editor-textarea"
          preClassName={styles.jsonPre}
          onFocus={(ev) => alignHeight(ev.target as EventTarget & HTMLTextAreaElement)}
          onBlur={(ev) => alignHeight(ev.target as EventTarget & HTMLTextAreaElement)}
          onKeyUp={(ev) => alignHeight(ev.target as EventTarget & HTMLTextAreaElement)}
        />
      </div>
      <ChartDataDialog
        reportText={reportText}
        isOpen={chartDialogOpen}
        handleClose={(reportText) => {
          if (reportText) {
            setEditorText({
              dataObject: JSON.parse(reportText),
              setter: setReportText,
              editorType: 'report',
              setErrorTitle,
              setErrorText,
            });

            applyChanges(reportText);
          }

          setChartDialogOpen(false);
        }}
      />
    </>
  );
};

export default ReportEditor;
