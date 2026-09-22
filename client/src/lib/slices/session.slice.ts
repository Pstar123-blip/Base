import type { StateCreator } from 'zustand';

export type SessionSlice = {
  accessToken: string | null;
  setToken: (token: string | null) => void;
};

export const createSessionSlice: StateCreator<SessionSlice> = (set) => {
  const setToken = (accessToken: string | null) => set({ accessToken });
  return { accessToken: null, setToken };
};
