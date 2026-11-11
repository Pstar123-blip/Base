import { Alert } from '@mui/material';
import { type DropzoneOptions, useDropzone } from 'react-dropzone';

import {
  BROWSE_HINT,
  DEFAULT_DRAG_ACTIVE_LABEL,
  DEFAULT_DRAG_REJECT_LABEL,
  DEFAULT_LABEL,
} from './consts';
import {
  BrowseHint,
  DropArea,
  DropDescription,
  DropText,
  DropTitle,
  DropzoneRoot,
  IconBadge,
  RejectionLine,
  UploadIcon,
} from './file-dropzone.styles';
import { mergeFiles } from './utils/merge-files';

export interface FileDropzoneProps extends Omit<
  DropzoneOptions,
  'onDropAccepted'
> {
  value: File[];
  onChange: (files: File[]) => void;
  label?: string;
  dragActiveLabel?: string;
  dragRejectLabel?: string;
  description?: string;
  className?: string;
}

/**
 * A click-or-drop area for picking files. Has a default size; restyle it with
 * `styled(FileDropzone)` to change it.
 */
export const FileDropzone = ({
  className,
  value,
  onChange,
  label = DEFAULT_LABEL,
  dragActiveLabel = DEFAULT_DRAG_ACTIVE_LABEL,
  dragRejectLabel = DEFAULT_DRAG_REJECT_LABEL,
  description,
  multiple = true,
  maxFiles = 0,
  disabled = false,
  ...options
}: FileDropzoneProps) => {
  const isFull = multiple && maxFiles > 0 && value.length >= maxFiles;

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    ...options,
    multiple,
    // react-dropzone counts per drop, so only offer the slots that are left.
    maxFiles: maxFiles > 0 ? maxFiles - value.length : 0,
    disabled: disabled || isFull,
    onDropAccepted: (files) =>
      onChange(multiple ? mergeFiles(value, files) : files),
  });

  const title = isDragReject
    ? dragRejectLabel
    : isDragActive
      ? dragActiveLabel
      : label;

  return (
    <DropzoneRoot className={className}>
      <DropArea
        {...getRootProps({ role: 'button' })}
        data-drag-active={isDragActive}
        data-drag-reject={isDragReject}
      >
        {/* react-dropzone hides the native input itself. */}
        <input {...getInputProps()} />
        <IconBadge>
          <UploadIcon />
        </IconBadge>
        <DropText>
          <DropTitle>{title}</DropTitle>
          <BrowseHint>{BROWSE_HINT}</BrowseHint>
        </DropText>
        {description && <DropDescription>{description}</DropDescription>}
      </DropArea>

      {fileRejections.length > 0 && (
        <Alert severity="error">
          {fileRejections.map(({ file, errors }, index) => (
            <RejectionLine key={`${file.name}-${index}`}>
              {file.name}: {errors.map(({ message }) => message).join(', ')}
            </RejectionLine>
          ))}
        </Alert>
      )}
    </DropzoneRoot>
  );
};
