import { Stack } from '@mui/material';

import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';
import { StepHeader } from '@/shared/components/step-header/step-header';
import { SUMMARY_TITLE } from '@/shared/constants';
import { useObjectUrls } from '@/shared/hooks/use-object-urls';

import { SUMMARY_GALLERY_COLUMNS, SUMMARY_IMAGES_LABEL } from '../../consts';
import type { SummaryImage } from './types';

const getId = (image: SummaryImage) => image.id;
const getImage = (image: SummaryImage) => image;

type EvaluationSummaryStepProps = {
  images: File[];
};

export const EvaluationSummaryStep = ({
  images,
}: EvaluationSummaryStepProps) => {
  const urls = useObjectUrls(images);

  const items = images.flatMap((file): SummaryImage[] => {
    const src = urls.get(file);

    return src ? [{ id: src, src, alt: file.name }] : [];
  });

  return (
    <Stack spacing={3}>
      <StepHeader title={SUMMARY_TITLE} />
      <ImageGallery
        items={items}
        getId={getId}
        getImage={getImage}
        label={SUMMARY_IMAGES_LABEL}
        columns={SUMMARY_GALLERY_COLUMNS}
      />
    </Stack>
  );
};
