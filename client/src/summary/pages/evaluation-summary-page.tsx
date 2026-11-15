import { Stack, Typography } from '@mui/material';

import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';

import {
  SUMMARY_GALLERY_COLUMNS,
  SUMMARY_IMAGES_LABEL,
  SUMMARY_TITLE,
} from '../consts';
import type { SummaryImage } from '../types';

const getId = (image: SummaryImage) => image.id;
const getImage = (image: SummaryImage) => image;

export const EvaluationSummaryPage = () => {
  // TODO: get the images from the store.
  const images: SummaryImage[] = [];

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        {SUMMARY_TITLE}
      </Typography>
      <ImageGallery
        items={images}
        getId={getId}
        getImage={getImage}
        label={SUMMARY_IMAGES_LABEL}
        columns={SUMMARY_GALLERY_COLUMNS}
      />
    </Stack>
  );
};
