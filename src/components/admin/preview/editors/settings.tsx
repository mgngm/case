import type { Dispatch, SetStateAction, RefObject, MutableRefObject } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Alert from '@mui/material/Alert';
import clsx from 'clsx';
import { highlight, languages } from 'prismjs/components/prism-core';
import Editor from 'react-simple-code-editor';
import { alignHeight } from 'src/components/admin/preview/helpers';
import styles from 'src/components/admin/preview/preview.module.scss';
import LeversInputs from 'src/components/admin/report/levers';
import type { PreviewAccordion } from 'src/constants/report';
import { PERSONA_SETTINGS_ACCORDION } from 'src/constants/report';
import { ParseStatus } from 'src/graphql';
import exports from 'styles/_exports.module.scss';
const editorStyles = {
  fontFamily: exports.adminCodeFont,
  fontSize: exports.adminCodeSize,
  background: exports.adminCodeBackground,
};

type SettingsEditorProps = {
  settingsText: string;
  setSettingsText: Dispatch<SetStateAction<string>>;
  toggleAccordion: (x: PreviewAccordion) => void;
  isAccordionClosed: (x: PreviewAccordion) => boolean;
  isAccordionOpen: (x: PreviewAccordion) => boolean;
  focusSettings: () => void;
  settingsWrapperRef: RefObject<HTMLDivElement>;
  settingsEditorRef: MutableRefObject<{
    _input: HTMLTextAreaElement;
  } | null>;
  duStatus: ParseStatus;
  setHybridLower: Dispatch<SetStateAction<number>>;
  setHybridUpper: Dispatch<SetStateAction<number>>;
  setWorkingDays: Dispatch<SetStateAction<number>>;
  hybridUpper: number;
  hybridLower: number;
  workingDays: number;
};
const SettingsEditor = ({
  settingsText,
  setSettingsText,
  toggleAccordion,
  isAccordionClosed,
  isAccordionOpen,
  focusSettings,
  settingsWrapperRef,
  settingsEditorRef,
  duStatus,
  hybridUpper,
  hybridLower,
  workingDays,
  setHybridLower,
  setHybridUpper,
  setWorkingDays,
}: SettingsEditorProps) => {
  return (
    <>
      <div
        className={styles.accordion}
        id="settings-accordion"
        onClick={() => {
          toggleAccordion(PERSONA_SETTINGS_ACCORDION);
          // if we're opening settings, focus the json
          if (isAccordionOpen(PERSONA_SETTINGS_ACCORDION)) {
            focusSettings();
          }
        }}
      >
        <div className={styles.accordionTitle}>Settings</div>
        <KeyboardArrowUpIcon
          className={clsx(
            styles.accordionArrow,
            isAccordionClosed(PERSONA_SETTINGS_ACCORDION) && styles.accordionClosed
          )}
        />
      </div>
      <div
        className={clsx(
          styles.accordionContent,
          isAccordionClosed(PERSONA_SETTINGS_ACCORDION) && styles.accordionClosed,
          styles.settingsContent
        )}
        ref={settingsWrapperRef}
      >
        <div>
          <h3>Persona Settings</h3>
          {duStatus === ParseStatus.IN_PROGRESS && (
            <Alert severity="info" className={styles.settingsWarning}>
              DU processing in progress, you cannot modify settings until this is complete
            </Alert>
          )}
          <Alert severity="warning" className={styles.settingsWarning}>
            Modifying and applying changes to settings will overwrite the current report data and projects
          </Alert>
          <div>
            <Editor
              value={settingsText}
              disabled={duStatus === ParseStatus.IN_PROGRESS}
              onValueChange={(settings) => setSettingsText(settings)}
              highlight={(code) => highlight(code, languages.json)}
              padding={10}
              className={styles.jsonEditor}
              style={editorStyles}
              // @ts-expect-error Editor does not expose its underlying html elements in its LegacyRef type, so I've had to
              // create a new type to access them { _input: HTMLTextAreaElement }
              ref={settingsEditorRef}
              textareaId="settings-editor-textarea"
              onFocus={(ev) => alignHeight(ev.target as EventTarget & HTMLTextAreaElement)}
              onBlur={(ev) => alignHeight(ev.target as EventTarget & HTMLTextAreaElement)}
              onKeyUp={(ev) => alignHeight(ev.target as EventTarget & HTMLTextAreaElement)}
            />
          </div>
          <h3>Lever Settings</h3>
          <div>
            <LeversInputs
              iconFill="white"
              levers={{ hybridLower, hybridUpper, workingDays }}
              setLevers={{
                setHybridLower,
                setHybridUpper,
                setWorkingDays,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsEditor;
