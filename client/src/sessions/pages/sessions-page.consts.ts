import type { SessionAction } from '../types';

export const SESSION_ACTIONS: Record<
  SessionAction,
  {
    title: string;
    getDescription: (id: string) => string;
    successMessage: string;
    shouldDelete: boolean;
  }
> = {
  delete: {
    title: 'Delete session?',
    getDescription: (id) => `Session ${id} will be permanently deleted.`,
    successMessage: 'Session deleted',
    shouldDelete: true,
  },
  cancel: {
    title: 'Cancel session?',
    getDescription: (id) => `Session ${id} will be canceled.`,
    successMessage: 'Session canceled',
    shouldDelete: false,
  },
};
