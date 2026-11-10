import type { SvgIconComponent } from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import PsychologyIcon from '@mui/icons-material/Psychology';

import type { SessionType } from '@/api/generated/model';
import { EVALUATION_PATH } from '@/evaluation/consts';
import { INFERENCE_PATH } from '@/inference/consts';
import {
  SESSION_TYPE_LABELS,
  SESSION_TYPES,
  SESSIONS_PATH,
} from '@/sessions/consts';
import { TRAINING_PATH } from '@/training/consts';

import type { SidebarItemProps } from './sidebar-item';

export const SIDEBAR_WIDTH = 240;

const SESSION_TYPE_PATHS: Record<SessionType, SidebarItemProps['to']> = {
  training: TRAINING_PATH,
  inference: INFERENCE_PATH,
  evaluation: EVALUATION_PATH,
};

const SESSION_TYPE_ICONS: Record<SessionType, SvgIconComponent> = {
  training: ModelTrainingIcon,
  inference: PsychologyIcon,
  evaluation: AssessmentIcon,
};

// One entry per generated session type, so a new type fails to compile here
// until it gets a path and an icon. The sessions list comes last.
export const SIDEBAR_ENTRIES: SidebarItemProps[] = [
  ...SESSION_TYPES.map((type) => ({
    label: SESSION_TYPE_LABELS[type],
    to: SESSION_TYPE_PATHS[type],
    icon: SESSION_TYPE_ICONS[type],
  })),
  { label: 'Sessions', to: SESSIONS_PATH, icon: ListAltIcon },
];
