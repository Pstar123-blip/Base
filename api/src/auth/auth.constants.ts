const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_DAY = 24 * 60 * SECONDS_PER_MINUTE;
const MILLISECONDS_PER_SECOND = 1000;

export const JWT_ISSUER = 'starter-api';
export const JWT_AUDIENCE = 'starter-client';
export const ACCESS_TOKEN_KIND = 'access';
export const REFRESH_TOKEN_KIND = 'refresh';
export const ACCESS_TOKEN_TTL_SECONDS = 15 * SECONDS_PER_MINUTE;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * SECONDS_PER_DAY;
export const REFRESH_TOKEN_TTL_MS =
  REFRESH_TOKEN_TTL_SECONDS * MILLISECONDS_PER_SECOND;
export const REFRESH_COOKIE_NAME = 'refresh_token';
export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_EMAIL_LENGTH = 254;
