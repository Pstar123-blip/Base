import { create } from 'zustand';
type SessionState = {
  accessToken: string | null;
  setToken: (token: string | null) => void;
};
export const useSession = create<SessionState>((set) => ({
  accessToken: null,
  setToken: (accessToken) => set({ accessToken }),
}));
type UiState = { error: string | null; notify: (error: string | null) => void };
export const useUi = create<UiState>((set) => ({
  error: null,
  notify: (error) => set({ error }),
}));
