import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './textarea.module.scss';

type TextareaProps = { invalid?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, invalid, ...props }, ref) => (
  <textarea className={clsx(styles.textarea, { [styles.invalid]: invalid }, className)} {...props} ref={ref} />
));

Textarea.displayName = 'Textarea';

export default Textarea;
