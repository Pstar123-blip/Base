import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Typography } from '@mui/material';

import { ImageTile } from '@/shared/components/image-tile/image-tile';

import { COMPARE_TITLES } from '../consts';
import type { CompareImage } from '../types';
import { formatFileSize } from '../utils/format-file-size';
import {
  CaptionName,
  CaptionSize,
  IconWrapper,
  Panel,
  Row,
  TileFrame,
} from './compare-row.styles';

export type CompareRowProps = {
  imageA?: CompareImage;
  imageB?: CompareImage;
};

const renderCaption = ({ name, size }: CompareImage) => (
  <>
    <CaptionName title={name}>{name}</CaptionName>
    <CaptionSize>{formatFileSize(size)}</CaptionSize>
  </>
);

const renderPanel = (title: string, image?: CompareImage) => (
  <Panel>
    <Typography variant="h6" component="h2" gutterBottom>
      {title}
    </Typography>
    {image && (
      <TileFrame>
        <ImageTile
          src={image.src}
          alt={image.alt}
          caption={renderCaption(image)}
          fit="contain"
        />
      </TileFrame>
    )}
  </Panel>
);

export const CompareRow = ({ imageA, imageB }: CompareRowProps) => (
  <Row direction={{ xs: 'column', sm: 'row' }}>
    {renderPanel(COMPARE_TITLES.a, imageA)}
    <IconWrapper>
      <CompareArrowsIcon fontSize="large" />
    </IconWrapper>
    {renderPanel(COMPARE_TITLES.b, imageB)}
  </Row>
);
