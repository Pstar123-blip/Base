import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createSessionSlice, type SessionSlice } from './slices/session.slice';

export const useSession = create<SessionSlice>()(
  persist(createSessionSlice, {
    name: 'session',
    partialize: ({ accessToken }) => ({ accessToken }),
  }),
);
