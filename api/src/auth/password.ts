import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const SALT_BYTES = 16;
const DERIVED_KEY_BYTES = 64;
const HASH_ENCODING = 'hex';
const HASH_SEPARATOR = ':';

const derive = promisify(scrypt);
export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_BYTES).toString(HASH_ENCODING);
  const key = (await derive(password, salt, DERIVED_KEY_BYTES)) as Buffer;
  return salt + HASH_SEPARATOR + key.toString(HASH_ENCODING);
}
export async function verifyPassword(password: string, hash: string) {
  const [salt, key] = hash.split(HASH_SEPARATOR);
  if (!salt || !key) return false;
  const actual = (await derive(password, salt, DERIVED_KEY_BYTES)) as Buffer;
  const expected = Buffer.from(key, HASH_ENCODING);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
