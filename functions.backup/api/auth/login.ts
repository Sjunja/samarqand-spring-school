import { createSession, createSessionCookie, verifyPassword } from '../auth.lib';
import { corsHeaders, jsonResponse } from '../shared.lib';

interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  let payload: { email?: string; password?: string; role?: string } = {};
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
  }

  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');
  const role = payload.role ? String(payload.role) : null;

  if (!email || !password) {
    return jsonResponse({ success: false, error: 'Missing credentials' }, 400);
  }

  const user = await env.DB.prepare(
    'select id, email, password_hash, password_salt, role, name, registration_id from users where email = ?'
  )
    .bind(email)
    .first<{
      id: string;
      email: string;
      password_hash: string;
      password_salt: string;
      role: string;
      name: string | null;
      registration_id: string | null;
    }>();

  if (!user) {
    return jsonResponse({ success: false, error: 'Invalid credentials' }, 401);
  }

  if (role && user.role !== role) {
    return jsonResponse({ success: false, error: 'Access denied' }, 403);
  }

  const isValid = await verifyPassword(password, user.password_salt, user.password_hash);
  if (!isValid) {
    return jsonResponse({ success: false, error: 'Invalid credentials' }, 401);
  }

  const session = await createSession(env, user.id, request);
  const cookie = createSessionCookie(session.token);

  return new Response(
    JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        registrationId: user.registration_id,
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
        ...corsHeaders,
      },
    }
  );
};
