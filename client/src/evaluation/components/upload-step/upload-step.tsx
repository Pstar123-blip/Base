import { Button } from '@mui/material';
import { useRef, useState } from 'react';

import { DeleteIcon } from '@/assets/icons/delete-icon';
import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';
import { RemoveButton } from '@/shared/components/remove-button/remove-button';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { IMAGE_ACCEPT } from '@/shared/constants';
import { useObjectUrls } from '@/shared/hooks/use-object-urls';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';

import {
  DROPZONE_DESCRIPTION,
  GALLERY_LABEL,
  getGalleryCountLabel,
  getRemoveAllDescription,
  getRemoveImageLabel,
  MAX_IMAGES,
  REMOVE_ALL_LABEL,
  REMOVE_ALL_TITLE,
  UPLOAD_SUBTITLE,
  UPLOAD_TITLE,
} from './consts';
import {
  Dropzone,
  GalleryCount,
  GalleryScrollArea,
  GallerySection,
  GalleryToolbar,
  UploadStepRoot,
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
      if (node) {
        removeButtons.current.set(file, node);
      } else {
        removeButtons.current.delete(file);
      }
    };

  const renderRemoveButton = ({ file }: UploadedImage, index: number) => (
    <RemoveButton
      ref={registerRemoveButton(file)}
      label={getRemoveImageLabel(file.name)}
      onClick={() => remove(file, index)}
    />
  );

  return (
    <UploadStepRoot>
      <StepHeader title={UPLOAD_TITLE} subtitle={UPLOAD_SUBTITLE} />
      <Dropzone
        hasGallery={hasGallery}
        value={images}
        onChange={onImagesChange}
        description={DROPZONE_DESCRIPTION}
        accept={IMAGE_ACCEPT}
        maxFiles={MAX_IMAGES}
      />
      {hasGallery && (
        <GallerySection>
          <GalleryToolbar>
            <GalleryCount aria-live="polite">
              {getGalleryCountLabel(images.length)}
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
        description={getRemoveAllDescription(images.length)}
        onCancel={cancelRemoveAll}
        onConfirm={confirmRemoveAll}
      />
    </UploadStepRoot>
  );
};
