import { Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { type MouseEvent, useRef } from 'react';
import { type DropzoneOptions, useDropzone } from 'react-dropzone';

import {
  BROWSE_HINT,
  CHOOSE_FOLDER_LABEL,
  DEFAULT_DRAG_ACTIVE_LABEL,
  DEFAULT_DRAG_REJECT_LABEL,
  DEFAULT_LABEL,
  DEFAULT_SINGLE_LABEL,
  FOLDER_HINT_JOINER,
  FOLDER_INPUT_ATTRIBUTES,
  getMoreRejectionsLabel,
  MAX_REJECTION_LINES,
} from './consts';
import {
  BrowseHint,
  DropArea,
  DropDescription,
  DropText,
  DropTitle,
  DropzoneRoot,
  FolderLink,
  IconBadge,
  RejectionLine,
  RejectionList,
  UploadIcon,
} from './file-dropzone.styles';
import { mergeFiles } from './utils/merge-files';

export interface FileDropzoneProps extends Omit<
  DropzoneOptions,
  'onDropAccepted'
> {
  /**
   * The files picked so far, which new drops are merged into and counted
   * against `maxFiles`. Only used when `multiple`.
   */
  value?: File[];
  onChange: (files: File[]) => void;
  label?: string;
  dragActiveLabel?: string;
  dragRejectLabel?: string;
  description?: string;
  className?: string;
}

/**
 * A click-or-drop area for picking files. A dropped folder adds every file
 * inside it, and when `multiple`, a link in the area picks a folder.
 * Has a default size; restyle it with `styled(FileDropzone)` to change it.
 */
export const FileDropzone = ({
  className,
  value = [],
  onChange,
  label,
  dragActiveLabel = DEFAULT_DRAG_ACTIVE_LABEL,
  dragRejectLabel = DEFAULT_DRAG_REJECT_LABEL,
  description,
  multiple = true,
  maxFiles = 0,
  disabled = false,
  onDropRejected,
  ...options
}: FileDropzoneProps) => {
  const isFull = multiple && maxFiles > 0 && value.length >= maxFiles;
  const isDisabled = disabled || isFull;
  const folderInputRef = useRef<HTMLInputElement>(null);

  // One short snackbar per drop, so a folder full of rejected files doesn't
  // flood the screen.
  const notifyRejections: DropzoneOptions['onDropRejected'] = (
    rejections,
    event,
  ) => {
    const hiddenCount = rejections.length - MAX_REJECTION_LINES;

    enqueueSnackbar(
      <RejectionList>
        {rejections
          .slice(0, MAX_REJECTION_LINES)
          .map(({ file, errors }, index) => (
            <RejectionLine key={`${file.name}-${index}`}>
              {file.name}: {errors.map(({ message }) => message).join(', ')}
            </RejectionLine>
          ))}
        {hiddenCount > 0 && (
          <RejectionLine>{getMoreRejectionsLabel(hiddenCount)}</RejectionLine>
        )}
      </RejectionList>,
      { variant: 'error' },
    );
    onDropRejected?.(rejections, event);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      ...options,
      multiple,
      // react-dropzone counts per drop, so only offer the slots that are left.
      maxFiles: maxFiles > 0 ? maxFiles - value.length : 0,
      disabled: isDisabled,
      onDropAccepted: (files) =>
        onChange(multiple ? mergeFiles(value, files) : files),
      onDropRejected: notifyRejections,
    });

  const chooseFolder = (event: MouseEvent) => {
    // Otherwise the area's click opens the file picker as well.
    event.stopPropagation();

    const input = folderInputRef.current;

    if (input) {
      // Lets the same folder be picked again.
      input.value = '';
      input.click();
    }
  };

  const title = isDragReject
    ? dragRejectLabel
    : isDragActive
      ? dragActiveLabel
      : (label ?? (multiple ? DEFAULT_LABEL : DEFAULT_SINGLE_LABEL));

  return (
    <DropzoneRoot className={className}>
      <DropArea
        {...getRootProps({ role: 'button' })}
        data-drag-active={isDragActive}
        data-drag-reject={isDragReject}
      >
        {/* react-dropzone hides the native inputs itself. Wrapped, so they
            take a single gap in the area. */}
        <Box>
          <input {...getInputProps()} />
          {/* One picker can't offer files and folders both, so folders get
              their own input. It reuses the file input's props, so its picks
              go through the same `onChange`, `accept` and `multiple`; only
              its `ref` is replaced, so react-dropzone's `open()` and the
              area's click still use the file input. */}
          {multiple && (
            <input
              {...getInputProps()}
              {...FOLDER_INPUT_ATTRIBUTES}
              ref={folderInputRef}
            />
          )}
        </Box>
        <IconBadge>
          <UploadIcon />
        </IconBadge>
        <DropText>
          <DropTitle>{title}</DropTitle>
          <BrowseHint>
            {BROWSE_HINT}
            {multiple && (
              <>
                {FOLDER_HINT_JOINER}
                <FolderLink
                  component="button"
                  type="button"
                  disabled={isDisabled}
                  onClick={chooseFolder}
                >
                  {CHOOSE_FOLDER_LABEL}
                </FolderLink>
              </>
            )}
          </BrowseHint>
        </DropText>
        {description && <DropDescription>{description}</DropDescription>}
      </DropArea>
    </DropzoneRoot>
  );
};
