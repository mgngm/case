import type { Dispatch, SetStateAction } from 'react';
import type { PersonaSettings } from 'src/types/csv';
import type { DashboardData } from 'src/types/slices';

export const focusEditorByRef = (ref: { _input: HTMLTextAreaElement }) => {
  ref._input.focus();
  ref._input.selectionEnd = 0;

  if (ref._input.parentElement) {
    ref._input.parentElement.scrollTop = 0;
  }
};

/**
 * Align the Editor <textarea> height with the <pre> which
 * contains the syntax highlighted code. Necessary since we
 * have overflow hidden due to the accordions
 *
 * @param target - EventTarget for the Editor textarea component
 */
export const alignHeight = (target: EventTarget & HTMLTextAreaElement) => {
  // fallback to original height if anything goes wrong
  const originalHeight = target.clientHeight;

  // <pre> tag is always next to the <textarea> so we can use nextElementSibling instead of
  // searching for the childNode on the Editor div
  target.style.height = `${target.nextElementSibling?.clientHeight ?? originalHeight}px`;
};

type EditorProps = {
  dataObject: DashboardData | PersonaSettings;
  setter: Dispatch<SetStateAction<string>>;
  editorType: string;
  setErrorTitle: Dispatch<SetStateAction<string>>;
  setErrorText: Dispatch<SetStateAction<string>>;
};
export const setEditorText = ({ dataObject, setter, editorType, setErrorTitle, setErrorText }: EditorProps) => {
  if (dataObject) {
    try {
      const prettyJson = JSON.stringify(dataObject, null, 4);
      setter(prettyJson);
    } catch (err) {
      console.error(err);
      setter('');
      setErrorTitle('Error loading data');
      setErrorText('Invalid JSON');
    }
  } else {
    setter('');
    setErrorTitle('Error loading data');
    setErrorText(`Could not find ${editorType} data object`);
  }
};
