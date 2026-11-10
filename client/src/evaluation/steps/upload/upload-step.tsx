import { Button } from '@mui/material';
import { useRef, useState } from 'react';

import { DeleteIcon } from '@/assets/icons/delete-icon';
import { FileDropzone } from '@/shared/components/file-dropzone/file-dropzone';
import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';
import { RemoveButton } from '@/shared/components/remove-button/remove-button';
import { useObjectUrls } from '@/shared/hooks/use-object-urls';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';

import {
  GALLERY_LABEL,
  IMAGE_ACCEPT,
  IMAGE_ACCEPT_DESCRIPTION,
  MAX_IMAGES,
  REMOVE_ALL_LABEL,
  REMOVE_ALL_TITLE,
} from './consts';
import {
  DropzoneContainer,
  GalleryCount,
  GalleryScrollArea,
  GallerySection,
  GalleryToolbar,
  UploadHeader,
  UploadStepRoot,
  UploadSubtitle,
  UploadTitle,
} from './upload-step.styles';

type UploadedImage = { file: File; src: string };

type UploadStepProps = {
  images: File[];
  onImagesChange: (images: File[]) => void;
};

export const UploadStep = ({ images, onImagesChange }: UploadStepProps) => {
  const urls = useObjectUrls(images);
  const [isConfirmingRemoveAll, setIsConfirmingRemoveAll] = useState(false);
  // Lets focus move to a neighbouring tile when one is removed, instead of
  // being dropped on the page.
  const removeButtons = useRef(new Map<File, HTMLButtonElement>());

  // A file's URL is created right after the drop, before the browser paints.
  const uploaded = images.flatMap((file): UploadedImage[] => {
    const src = urls.get(file);

    return src ? [{ file, src }] : [];
  });
  const hasGallery = uploaded.length > 0;

  const remove = (file: File, index: number) => {
    const neighbour = uploaded[index + 1] ?? uploaded[index - 1];

    if (neighbour) {
      removeButtons.current.get(neighbour.file)?.focus();
    }

    onImagesChange(images.filter((image) => image !== file));
  };

  const openRemoveAll = () => setIsConfirmingRemoveAll(true);
  const cancelRemoveAll = () => setIsConfirmingRemoveAll(false);

  const confirmRemoveAll = () => {
    setIsConfirmingRemoveAll(false);
    onImagesChange([]);
  };

  const registerRemoveButton =
    (file: File) => (node: HTMLButtonElement | null) => {
      if (!node) {
        return;
      }

      removeButtons.current.set(file, node);

      return () => {
        removeButtons.current.delete(file);
      };
    };

  const renderRemoveButton = ({ file }: UploadedImage, index: number) => (
    <RemoveButton
      ref={registerRemoveButton(file)}
      label={`Remove ${file.name}`}
      onClick={() => remove(file, index)}
    />
  );

  return (
    <UploadStepRoot>
      <UploadHeader>
        <UploadTitle variant="h5">Upload files</UploadTitle>
        <UploadSubtitle variant="body2">
          Add up to {MAX_IMAGES} images (JPEG or PNG) to continue.
        </UploadSubtitle>
      </UploadHeader>
      <DropzoneContainer data-has-gallery={hasGallery}>
        <FileDropzone
          value={images}
          onChange={onImagesChange}
          description={IMAGE_ACCEPT_DESCRIPTION}
          accept={IMAGE_ACCEPT}
          maxFiles={MAX_IMAGES}
        />
      </DropzoneContainer>
      {hasGallery && (
        <GallerySection>
          <GalleryToolbar>
            <GalleryCount aria-live="polite">
              {images.length} of {MAX_IMAGES} images
            </GalleryCount>
            <Button
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={openRemoveAll}
            >
              {REMOVE_ALL_LABEL}
            </Button>
          </GalleryToolbar>
          <GalleryScrollArea>
            <ImageGallery
              items={uploaded}
              getId={({ src }) => src}
              getImage={({ file, src }) => ({
                src,
                alt: file.name,
                caption: file.name,
              })}
              renderAction={renderRemoveButton}
              label={GALLERY_LABEL}
            />
          </GalleryScrollArea>
        </GallerySection>
      )}
      <ConfirmationDialog
        open={isConfirmingRemoveAll}
        title={REMOVE_ALL_TITLE}
        description={`All ${images.length} images will be removed. You'll need to upload them again.`}
        onCancel={cancelRemoveAll}
        onConfirm={confirmRemoveAll}
      />
    </UploadStepRoot>
  );
};
