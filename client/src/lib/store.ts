import { create, type StateCreator } from 'zustand';

type SessionState = {
  accessToken: string | null;
  setToken: (token: string | null) => void;
};

const createSession: StateCreator<SessionState> = (set) => {
  const setToken = (accessToken: string | null) => set({ accessToken });
  return { accessToken: null, setToken };
};

export const useSession = create<SessionState>(createSession);
