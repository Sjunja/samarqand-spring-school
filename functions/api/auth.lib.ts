import { buildCookie, buildExpiredCookie, parseCookies } from './_shared';

export type UserRole = 'participant' | 'admin' | 'developer';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  registrationId: string | null;
}

const SESSION_COOKIE = 'session_token';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 32;

const encoder = new TextEncoder();

const toBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

export const hashPassword = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    PASSWORD_KEY_LENGTH * 8
  );

  return {
    salt: toBase64(salt.buffer),
    hash: toBase64(hash),
  };
};

export const verifyPassword = async (password: string, saltBase64: string, hashBase64: string) => {
  const saltBuffer = fromBase64(saltBase64);
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: PASSWORD_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    PASSWORD_KEY_LENGTH * 8
  );
  return toBase64(hash) === hashBase64;
};

export const createSessionCookie = (token: string) => {
  return buildCookie(SESSION_COOKIE, token, SESSION_TTL_SECONDS);
};

export const clearSessionCookie = () => buildExpiredCookie(SESSION_COOKIE);

export const createSession = async (env: { DB: D1Database }, userId: string, request: Request) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  const ip = request.headers.get('cf-connecting-ip');
  const userAgent = request.headers.get('user-agent');

  await env.DB.prepare(
    'insert into sessions (id, user_id, token, expires_at, ip, user_agent) values (?, ?, ?, ?, ?, ?)'
  )
    .bind(crypto.randomUUID(), userId, token, expiresAt, ip, userAgent)
    .run();

  return { token, expiresAt };
};

export const getSessionUser = async (env: { DB: D1Database }, request: Request) => {
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE];
  if (!token) {
    return null;
  }

  const record = await env.DB.prepare(
    `select sessions.token, sessions.expires_at, users.id as user_id, users.email, users.role, users.name, users.registration_id
     from sessions
     join users on users.id = sessions.user_id
     where sessions.token = ?`
  )
    .bind(token)
    .first<{
      token: string;
      expires_at: string;
      user_id: string;
      email: string;
      role: UserRole;
      name: string | null;
      registration_id: string | null;
    }>();

  if (!record) {
    return null;
  }

  const expiresAt = new Date(record.expires_at);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
    await env.DB.prepare('delete from sessions where token = ?').bind(token).run();
    return null;
  }

  return {
    id: record.user_id,
    email: record.email,
    role: record.role,
    name: record.name,
    registrationId: record.registration_id,
  } satisfies AuthenticatedUser;
};
