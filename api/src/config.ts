import { LOG_LEVELS } from './common/logger.js';
import { ENV_KEYS } from './envKeys.constants.js';

const DEFAULT_PORT = 3000;
const MIN_PORT = 1;
const MAX_PORT = 65535;
const MIN_JWT_SECRET_LENGTH = 32;
const MIN_DEV_MASTER_TOKEN_LENGTH = 32;
const JWT_SECRET_KEYS = [ENV_KEYS.JWT_ACCESS_SECRET];
const REQUIRED_ENV_KEYS = [
  ENV_KEYS.DATABASE_URL,
  ...JWT_SECRET_KEYS,
  ENV_KEYS.CLIENT_ORIGIN,
];
const DATABASE_PROTOCOLS = ['postgres:', 'postgresql:'];
const HTTP_PROTOCOLS = ['http:', 'https:'];
const NODE_ENVIRONMENTS = ['development', 'test', 'production'];

export const validateEnv = (env: Record<string, unknown>) => {
  for (const key of REQUIRED_ENV_KEYS) {
    if (typeof env[key] !== 'string' || !env[key]) {
      throw new Error(key + ' is required');
    }
  }

  for (const key of JWT_SECRET_KEYS) {
    if (String(env[key]).length < MIN_JWT_SECRET_LENGTH) {
      throw new Error(
        `${key} must have at least ${MIN_JWT_SECRET_LENGTH} characters`,
      );
    }
  }

  const port = Number(env[ENV_KEYS.PORT] ?? DEFAULT_PORT);

  if (!Number.isInteger(port) || port < MIN_PORT || port > MAX_PORT) {
    throw new Error('Invalid PORT');
  }

  const databaseUrl = new URL(String(env[ENV_KEYS.DATABASE_URL]));

  if (!DATABASE_PROTOCOLS.includes(databaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use PostgreSQL');
  }

  const origin = new URL(String(env[ENV_KEYS.CLIENT_ORIGIN]));

  if (
    !HTTP_PROTOCOLS.includes(origin.protocol) ||
    origin.origin !== env[ENV_KEYS.CLIENT_ORIGIN]
  ) {
    throw new Error(
      'CLIENT_ORIGIN must be an HTTP origin without a trailing slash',
    );
  }

  const nodeEnv = String(env[ENV_KEYS.NODE_ENV] ?? 'development');

  if (!NODE_ENVIRONMENTS.includes(nodeEnv)) {
    throw new Error('Invalid NODE_ENV');
  }

  if (nodeEnv === 'production' && origin.protocol !== 'https:') {
    throw new Error('Production CLIENT_ORIGIN must use HTTPS');
  }

  const devMasterToken = env[ENV_KEYS.DEV_MASTER_TOKEN];

  if (devMasterToken !== undefined && devMasterToken !== '') {
    if (env[ENV_KEYS.NODE_ENV] !== 'development') {
      throw new Error(
        `${ENV_KEYS.DEV_MASTER_TOKEN} requires NODE_ENV=development to be set explicitly`,
      );
    }

    if (
      typeof devMasterToken !== 'string' ||
      devMasterToken.length < MIN_DEV_MASTER_TOKEN_LENGTH
    ) {
      throw new Error(
        `${ENV_KEYS.DEV_MASTER_TOKEN} must have at least ${MIN_DEV_MASTER_TOKEN_LENGTH} characters`,
      );
    }
  }

  const logFormat =
    env[ENV_KEYS.LOG_FORMAT] ?? (nodeEnv === 'production' ? 'ecs' : 'pretty');

  if (logFormat !== 'pretty' && logFormat !== 'ecs') {
    throw new Error('LOG_FORMAT must be pretty or ecs');
  }

  const logLevel = env[ENV_KEYS.LOG_LEVEL] ?? 'info';

  if (typeof logLevel !== 'string' || !Object.hasOwn(LOG_LEVELS, logLevel)) {
    throw new Error('Invalid LOG_LEVEL');
  }

  const serviceName = env[ENV_KEYS.LOG_SERVICE_NAME] ?? 'api';

  if (typeof serviceName !== 'string' || !serviceName.trim()) {
    throw new Error('LOG_SERVICE_NAME must be a nonblank string');
  }

  return {
    ...env,
    [ENV_KEYS.LOG_FORMAT]: logFormat,
    [ENV_KEYS.LOG_LEVEL]: logLevel,
    [ENV_KEYS.LOG_SERVICE_NAME]: serviceName,
    [ENV_KEYS.NODE_ENV]: nodeEnv,
    [ENV_KEYS.PORT]: port,
  };
};
