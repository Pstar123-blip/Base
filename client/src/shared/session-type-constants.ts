import type { SvgIconComponent } from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import PsychologyIcon from '@mui/icons-material/Psychology';

import { SessionType } from '@/api/generated/model';

// Everything the app shows per session type lives here, so features read it
// from one place instead of from each other. Each map is keyed by the
// generated `SessionType`, so a new type fails to compile until it's added.

export const SESSION_TYPES = Object.values(SessionType);

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  training: 'Training',
  inference: 'Inference',
  evaluation: 'Evaluation',
};

// Each type's signature color.
export const SESSION_TYPE_COLORS: Record<SessionType, string> = {
  training: '#7c4dff',
  inference: '#0288d1',
  evaluation: '#2e7d32',
};

// Literal paths, so the router keeps type-checking links to them.
export const SESSION_TYPE_PATHS = {
  training: `/${SessionType.training}`,
  inference: `/${SessionType.inference}`,
  evaluation: `/${SessionType.evaluation}`,
} as const satisfies Record<SessionType, `/${string}`>;

export const SESSION_TYPE_ICONS: Record<SessionType, SvgIconComponent> = {
  training: ModelTrainingIcon,
  inference: PsychologyIcon,
  evaluation: AssessmentIcon,
};
