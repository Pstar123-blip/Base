import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { SESSION_STORAGE_KEY } from '@/shared/constants';

import { createSessionSlice, type SessionSlice } from './slices/session.slice';

export const selectSignedOut = (state: SessionSlice) => state.signedOut;
export const selectAccessToken = (state: SessionSlice) => state.accessToken;

export const useSession = create<SessionSlice>()(
  persist(createSessionSlice, {
    name: SESSION_STORAGE_KEY,
    partialize: ({ accessToken, tokenStage }) => ({ accessToken, tokenStage }),
  }),
);
