import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  HttpStatusCode,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/lib/env';
import { useSession } from '@/lib/store';

const REQUEST_TIMEOUT_MS = 15_000;

const baseURL = env.apiUrl;
export const http = axios.create({
  baseURL,
  timeout: REQUEST_TIMEOUT_MS,
});

const authorizeRequest = (config: InternalAxiosRequestConfig) => {
  const token = useSession.getState().accessToken;

  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }

  return config;
};

http.interceptors.request.use(authorizeRequest);
const passResponse = (response: AxiosResponse) => response;

const handleResponseError = (error: unknown) => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Unauthorized
  ) {
    useSession.getState().setToken(null);
  }

  throw error;
};

http.interceptors.response.use(passResponse, handleResponseError);

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
  useSession.getState().setToken(null);
};
