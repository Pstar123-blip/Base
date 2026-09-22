import { create } from 'zustand';

import { createSessionSlice, type SessionSlice } from './slices/session.slice';

export const useSession = create<SessionSlice>(createSessionSlice);
