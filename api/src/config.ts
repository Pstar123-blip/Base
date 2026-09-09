const DEFAULT_PORT = 3000;
const MIN_PORT = 1;
const MAX_PORT = 65535;
const MIN_JWT_SECRET_LENGTH = 32;
const JWT_SECRET_KEYS = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const REQUIRED_ENV_KEYS = ['DATABASE_URL', ...JWT_SECRET_KEYS, 'CLIENT_ORIGIN'];
const DATABASE_PROTOCOLS = ['postgres:', 'postgresql:'];
const HTTP_PROTOCOLS = ['http:', 'https:'];
const NODE_ENVIRONMENTS = ['development', 'test', 'production'];

export function validateEnv(env: Record<string, unknown>) {
  for (const key of REQUIRED_ENV_KEYS)
    if (typeof env[key] !== 'string' || !env[key])
      throw new Error(key + ' is required');
  for (const key of JWT_SECRET_KEYS)
    if (String(env[key]).length < MIN_JWT_SECRET_LENGTH)
      throw new Error(
        `${key} must have at least ${MIN_JWT_SECRET_LENGTH} characters`,
      );
  if (env.JWT_ACCESS_SECRET === env.JWT_REFRESH_SECRET)
    throw new Error('JWT secrets must differ');
  const port = Number(env.PORT ?? DEFAULT_PORT);
  if (!Number.isInteger(port) || port < MIN_PORT || port > MAX_PORT)
    throw new Error('Invalid PORT');
  const databaseUrl = new URL(String(env.DATABASE_URL));
  if (!DATABASE_PROTOCOLS.includes(databaseUrl.protocol))
    throw new Error('DATABASE_URL must use PostgreSQL');
  const origin = new URL(String(env.CLIENT_ORIGIN));
  if (
    !HTTP_PROTOCOLS.includes(origin.protocol) ||
    origin.origin !== env.CLIENT_ORIGIN
  )
    throw new Error(
      'CLIENT_ORIGIN must be an HTTP origin without a trailing slash',
    );
  const nodeEnv = String(env.NODE_ENV ?? 'development');
  if (!NODE_ENVIRONMENTS.includes(nodeEnv)) throw new Error('Invalid NODE_ENV');
  if (nodeEnv === 'production' && origin.protocol !== 'https:')
    throw new Error('Production CLIENT_ORIGIN must use HTTPS');
  return { ...env, NODE_ENV: nodeEnv, PORT: port };
}
