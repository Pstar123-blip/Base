import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Typography } from '@mui/material';

import { ImageTile } from '@/shared/components/image-tile/image-tile';
import { formatFileSize } from '@/shared/utils/format-file-size/format-file-size';

import {
  CaptionName,
  CaptionSize,
  IconWrapper,
  Panel,
  Row,
  TileFrame,
} from './compare-row.styles';
import type { CompareImage } from './types';

export type CompareRowProps = {
  firstTitle: string;
  secondTitle: string;
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
    <Typography variant="h6" component="h3" gutterBottom>
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

export const CompareRow = ({
  firstTitle,
  secondTitle,
  imageA,
  imageB,
}: CompareRowProps) => (
  <Row direction={{ xs: 'column', sm: 'row' }}>
    {renderPanel(firstTitle, imageA)}
    <IconWrapper>
      <CompareArrowsIcon fontSize="large" />
    </IconWrapper>
    {renderPanel(secondTitle, imageB)}
  </Row>
);
