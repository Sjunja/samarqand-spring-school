import { createSession, createSessionCookie } from '../../auth.lib';
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

  let payload: { userId?: string } = {};
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
  }

  const userId = String(payload.userId || '').trim();
  if (!userId) {
    return jsonResponse({ success: false, error: 'User ID required' }, 400);
  }

  const user = await env.DB.prepare('select id from users where id = ?').bind(userId).first();
  if (!user) {
    return jsonResponse({ success: false, error: 'User not found' }, 404);
  }

  const session = await createSession(env, userId, request);
  const cookie = createSessionCookie(session.token);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookie,
      ...corsHeaders,
    },
  });
};
