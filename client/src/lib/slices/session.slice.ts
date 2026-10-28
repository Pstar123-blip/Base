import type { StateCreator } from 'zustand';

export type SessionSlice = {
  accessToken: string | null;
  tokenStage: 'provider' | 'application' | null;
  setProviderToken: (token: string) => void;
  setToken: (token: string | null) => void;
};

export const createSessionSlice: StateCreator<SessionSlice> = (set) => {
  const setProviderToken = (accessToken: string) =>
    set({ accessToken, tokenStage: 'provider' });
  const setToken = (accessToken: string | null) =>
    set({ accessToken, tokenStage: accessToken ? 'application' : null });
  return { accessToken: null, tokenStage: null, setProviderToken, setToken };
};
