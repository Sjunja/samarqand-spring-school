import { hashPassword } from '../../auth.lib';
import { corsHeaders, jsonResponse } from '../../shared.lib';

interface Env {
  DB: D1Database;
  DEVELOPER_EMAILS?: string;
}

const isDeveloper = (request: Request, env: Env) => {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  if (!email || !env.DEVELOPER_EMAILS) return false;
  const allowed = env.DEVELOPER_EMAILS.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  if (!isDeveloper(request, env)) {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  }

  let payload: { email?: string; password?: string; role?: string; name?: string } = {};
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
  }

  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');
  const role = String(payload.role || 'admin');
  const name = String(payload.name || '').trim();

  if (!email || !password) {
    return jsonResponse({ success: false, error: 'Email and password required' }, 400);
  }

  const { hash, salt } = await hashPassword(password);
  try {
    await env.DB.prepare(
      'insert into users (id, email, password_hash, password_salt, role, name) values (?, ?, ?, ?, ?, ?)'
    )
      .bind(crypto.randomUUID(), email, hash, salt, role, name || null)
      .run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes('unique')) {
      return jsonResponse({ success: false, error: 'Email already exists' }, 409);
    }
    console.error('Create user error:', error);
    return jsonResponse({ success: false, error: 'Database error' }, 500);
  }

  return jsonResponse({ success: true });
};
