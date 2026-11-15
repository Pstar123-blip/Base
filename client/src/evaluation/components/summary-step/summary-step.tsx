import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { SUMMARY_TITLE } from '@/shared/constants';
import { useObjectUrls } from '@/shared/hooks/use-object-urls';

import {
  GalleryScrollArea,
  GallerySection,
  UploadStepRoot,
} from '../upload-step/upload-step.styles';
import { SUMMARY_GALLERY_COLUMNS, SUMMARY_IMAGES_LABEL } from './consts';

type SummaryImage = { file: File; src: string };

type EvaluationSummaryStepProps = {
  images: File[];
};

export const EvaluationSummaryStep = ({
  images,
}: EvaluationSummaryStepProps) => {
  const urls = useObjectUrls(images);

  const items = images.flatMap((file): SummaryImage[] => {
    const src = urls.get(file);

    return src ? [{ file, src }] : [];
  });

  return (
    <UploadStepRoot>
      <StepHeader title={SUMMARY_TITLE} />
      {/* Scrolls inside its own area, like the upload step, so up to 50 images
          don't push the step's buttons off screen. */}
      <GallerySection>
        <GalleryScrollArea>
          <ImageGallery
            items={items}
            getId={({ src }) => src}
            getImage={({ file, src }) => ({ src, alt: file.name })}
            label={SUMMARY_IMAGES_LABEL}
            columns={SUMMARY_GALLERY_COLUMNS}
          />
        </GalleryScrollArea>
      </GallerySection>
    </UploadStepRoot>
  );
};
