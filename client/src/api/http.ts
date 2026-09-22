import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
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

const storeRefreshedToken = ({
  data,
}: AxiosResponse<{ accessToken: string }>) => {
  useSession.getState().setToken(data.accessToken);
  return data.accessToken;
};

const handleRefreshError = (error: unknown) => {
  useSession.getState().setToken(null);
  throw error;
};

const finishRefresh = () => {
  refreshing = null;
};

export const refreshSession = (): Promise<string> => {
  refreshing ??= sessionHttp
    .post<{ accessToken: string }>(AUTH_ENDPOINTS.refresh)
    .then(storeRefreshedToken)
    .catch(handleRefreshError)
    .finally(finishRefresh);
  return refreshing;
};

const authorizeRequest = (config: InternalAxiosRequestConfig) => {
  const token = useSession.getState().accessToken;

  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }

  return config;
};

http.interceptors.request.use(authorizeRequest);
const passResponse = (response: AxiosResponse) => response;

const retryUnauthorizedRequest = async (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    throw error;
  }

  const config:
    (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined =
    error.config;

  const isSessionEndpoint = (endpoint: string) =>
    config?.url?.includes(endpoint);

  if (
    error.response?.status !== HttpStatusCode.Unauthorized ||
    !config ||
    config._retry ||
    SESSION_ENDPOINTS.some(isSessionEndpoint)
  ) {
    throw error;
  }

  config._retry = true;
  await refreshSession();
  return http(config);
};

http.interceptors.response.use(passResponse, retryUnauthorizedRequest);

export const request = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  // OpenAPI includes the global /api prefix; baseURL owns it at runtime.
  const url = config.url?.replace(/^\/api(?=\/)/, '');
  const response = await http.request<T>({ ...config, ...options, url });
  return response.data;
};

export const logout = async () => {
  await sessionHttp.post(AUTH_ENDPOINTS.logout);
  useSession.getState().setToken(null);
};
