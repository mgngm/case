import type { DragEventHandler, InputHTMLAttributes, Ref } from 'react';
import { useState, forwardRef } from 'react';
import { FilePresent, FileUpload } from '@mui/icons-material';
import clsx from 'clsx';
import { validateFileType } from 'src/logic/libs/file';
import styles from './file.module.scss';

export type FileInputProps = {
  invalid?: boolean;
  containerRef?: Ref<HTMLLabelElement>;
  onDrop?: DragEventHandler<HTMLLabelElement>;
  onInvalidFile?: (file: File) => void;
  value?: File | string;
  displayFullPath?: true;
  variant?: 'full' | 'slim';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onDrop' | 'value'>;

const displayName = (name: string, displayFull = false) => (displayFull ? name : name.split('/').at(-1));

/**
 * A file input for forms.
 *
 * **IMPORTANT NOTE: Files that are dragged and dropped will not be attached to the root form element**
 */
const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      invalid,
      containerRef,
      children,
      onDrop,
      onInvalidFile,
      value,
      displayFullPath,
      id,
      variant = 'full',
      ...props
    },
    ref
  ) => {
    const [dragActive, setDragActive] = useState(false);
    const handleDragEnter: DragEventHandler<HTMLLabelElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    };
    const handleDragLeave: DragEventHandler<HTMLLabelElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };
    const handleDragOver: DragEventHandler<HTMLLabelElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDrop: DragEventHandler<HTMLLabelElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (props.accept && !validateFileType(e.dataTransfer.files?.[0], props.accept)) {
        console.error('Invalid file: ', e.dataTransfer.files[0]);
        return onInvalidFile?.(e.dataTransfer.files[0]);
      }
      onDrop?.(e);
    };
    return (
      <label
        className={clsx(
          styles.container,
          variant === 'slim' && styles.slimContainer,
          { [styles.invalid]: invalid, [styles.dragged]: dragActive, [styles.hasFile]: !!value },
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        id={id && id + '-label'}
        ref={containerRef}
      >
        <input
          type="file"
          ref={ref}
          className={styles.input}
          id={id}
          aria-labelledby={id && id + '-label'}
          {...props}
        />
        {value ? (
          <>
            <FilePresent className={styles.icon} />
            <div className={clsx(styles.title, styles.filename)}>
              {displayName(typeof value === 'string' ? value : value.name, displayFullPath)}
            </div>
          </>
        ) : (
          <>
            <FileUpload className={styles.icon} />
            {children && <div className={styles.title}>{children}</div>}
          </>
        )}
        <span className={styles.subtitle}>Drag and drop file, or click to browse</span>
      </label>
    );
  }
);

FileInput.displayName = 'FileInput';

export default FileInput;
