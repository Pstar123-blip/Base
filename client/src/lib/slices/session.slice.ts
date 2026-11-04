import type { StateCreator } from 'zustand';

export type SessionSlice = {
  accessToken: string | null;
  tokenStage: 'provider' | 'application' | null;
  signedOut: boolean;
  setProviderToken: (token: string) => void;
  setToken: (token: string | null) => void;
  signOut: () => void;
  clearSignedOut: () => void;
};

export const createSessionSlice: StateCreator<SessionSlice> = (set) => {
  const setProviderToken = (accessToken: string) =>
    set({ accessToken, tokenStage: 'provider' });
  const setToken = (accessToken: string | null) =>
    set({ accessToken, tokenStage: accessToken ? 'application' : null });
  const signOut = () =>
    set({ accessToken: null, tokenStage: null, signedOut: true });
  const clearSignedOut = () => set({ signedOut: false });
  return {
    accessToken: null,
    tokenStage: null,
    signedOut: false,
    setProviderToken,
    setToken,
    signOut,
    clearSignedOut,
  };
};
