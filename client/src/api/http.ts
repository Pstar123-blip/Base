import axios, {
  type AxiosRequestConfig,
  HttpStatusCode,
  type InternalAxiosRequestConfig,
} from 'axios';

import { AUTH_ENDPOINTS } from '@/lib/auth.constants';
import { env } from '@/lib/env';
import { useSession } from '@/lib/store';
const REQUEST_TIMEOUT_MS = 15_000;
const SESSION_ENDPOINTS = Object.values(AUTH_ENDPOINTS);

const baseURL = env.apiUrl;
export const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});
const sessionHttp = axios.create({
  baseURL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});
let refreshing: Promise<string> | null = null;
export function refreshSession(): Promise<string> {
  refreshing ??= sessionHttp
    .post<{ accessToken: string }>(AUTH_ENDPOINTS.refresh)
    .then(({ data }) => {
      useSession.getState().setToken(data.accessToken);
      return data.accessToken;
    })
    .catch((error: unknown) => {
      useSession.getState().setToken(null);
      throw error;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}
http.interceptors.request.use((config) => {
  const token = useSession.getState().accessToken;
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});
http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;
    const config = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (
      error.response?.status !== HttpStatusCode.Unauthorized ||
      !config ||
      config._retry ||
      SESSION_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint))
    )
      throw error;
    config._retry = true;
    await refreshSession();
    return http(config);
  },
);
export async function request<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  // OpenAPI includes the global /api prefix; baseURL owns it at runtime.
  const url = config.url?.replace(/^\/api(?=\/)/, '');
  const response = await http.request<T>({ ...config, ...options, url });
  return response.data;
}
export async function logout() {
  await sessionHttp.post(AUTH_ENDPOINTS.logout);
  useSession.getState().setToken(null);
}
