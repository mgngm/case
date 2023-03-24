import type { RefCallback } from 'react';
import { useEffect, useState } from 'react';

/**
 * Autofocuses given element when `open` is true
 * @param open Whether the modal is open
 * @returns Callback that receives element - usually passed to `ref`
 */
const useAutofocus = (open: boolean): RefCallback<HTMLElement> => {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (el && open) {
      el.focus();
    }
  }, [el, open]);
  return (el) => {
    setEl(el);
  };
};

export default useAutofocus;
